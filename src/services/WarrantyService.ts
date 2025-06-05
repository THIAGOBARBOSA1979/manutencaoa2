
import { warrantyBusinessRules, WarrantyRequest, UserRole, WarrantyStatus, PriorityLevel } from './WarrantyBusinessRules';
import { documentPermissionService } from './DocumentPermissionService';
import { v4 as uuidv4 } from 'uuid';

export interface CreateWarrantyData {
  title: string;
  description: string;
  category: string;
  priority?: PriorityLevel;
  property: string;
  unit: string;
  client: string;
  evidences?: string[];
  isUrgent?: boolean;
  requiresInspection?: boolean;
}

export interface UpdateWarrantyData {
  status?: WarrantyStatus;
  assignedTo?: string;
  notes?: string[];
  materials?: string[];
  satisfactionRating?: number;
}

class WarrantyService {
  private warranties: WarrantyRequest[] = [];

  // Criar nova solicitação de garantia
  async createWarranty(
    data: CreateWarrantyData,
    userId: string,
    userRole: UserRole,
    propertyDeliveryDate: Date = new Date('2023-01-01') // Data de entrega da propriedade
  ): Promise<{ success: boolean; warranty?: WarrantyRequest; errors?: string[] }> {
    
    // Validar dados de entrada
    const validation = warrantyBusinessRules.validateWarrantyCreation(data, userRole, userId);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    // Verificar período de garantia
    const warrantyPeriodCheck = warrantyBusinessRules.validateWarrantyPeriod(
      data.category,
      new Date(),
      propertyDeliveryDate
    );

    if (!warrantyPeriodCheck.isValid) {
      return { success: false, errors: warrantyPeriodCheck.errors };
    }

    // Calcular prioridade automática se não fornecida
    const priority = data.priority || warrantyBusinessRules.calculateAutoPriority(data);

    // Calcular tempo estimado de resolução
    const estimatedResolutionTime = warrantyBusinessRules.calculateEstimatedResolutionTime(
      data.category,
      priority
    );

    // Criar solicitação
    const warranty: WarrantyRequest = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      category: data.category,
      priority: priority,
      status: 'pending',
      property: data.property,
      unit: data.unit,
      client: data.client,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedResolutionTime,
      isUrgent: data.isUrgent || priority === 'critical',
      requiresInspection: data.requiresInspection || false,
      evidences: data.evidences || [],
      notes: [],
      materials: []
    };

    this.warranties.push(warranty);

    // Log da criação
    documentPermissionService.logAction(
      warranty.id,
      userId,
      'create',
      `Solicitação de garantia criada: "${warranty.title}" - ${warranty.category} (${warranty.priority})`
    );

    // Notificações automáticas para casos críticos
    if (warranty.priority === 'critical') {
      this.notifyCriticalWarranty(warranty);
    }

    return { success: true, warranty };
  }

  // Atualizar solicitação de garantia
  async updateWarranty(
    warrantyId: string,
    data: UpdateWarrantyData,
    userId: string,
    userRole: UserRole
  ): Promise<{ success: boolean; warranty?: WarrantyRequest; errors?: string[] }> {
    
    const warranty = this.getWarrantyById(warrantyId);
    if (!warranty) {
      return { success: false, errors: ['Solicitação de garantia não encontrada'] };
    }

    const isOwner = warranty.createdBy === userId || warranty.assignedTo === userId;
    const permissions = warrantyBusinessRules.getWarrantyPermissions(userRole, isOwner);

    if (!permissions.canEdit) {
      return { success: false, errors: ['Usuário não tem permissão para editar esta solicitação'] };
    }

    // Validar mudança de status se fornecida
    if (data.status && data.status !== warranty.status) {
      const statusValidation = warrantyBusinessRules.validateStatusChange(
        warranty.status,
        data.status,
        userRole,
        warranty.assignedTo === userId
      );

      if (!statusValidation.isValid) {
        return { success: false, errors: statusValidation.errors };
      }
    }

    // Validar avaliação de satisfação se fornecida
    if (data.satisfactionRating) {
      const ratingValidation = warrantyBusinessRules.validateSatisfactionRating(
        warrantyId,
        data.satisfactionRating,
        userId,
        userRole,
        isOwner
      );

      if (!ratingValidation.isValid) {
        return { success: false, errors: ratingValidation.errors };
      }
    }

    // Aplicar atualizações
    const oldStatus = warranty.status;
    Object.assign(warranty, {
      ...data,
      updatedAt: new Date()
    });

    // Calcular tempo de resolução se concluída
    if (data.status === 'complete' && oldStatus !== 'complete') {
      warranty.actualResolutionTime = Math.ceil(
        (new Date().getTime() - warranty.createdAt.getTime()) / (1000 * 60 * 60)
      );
    }

    // Log da atualização
    const changes: string[] = [];
    if (data.status) changes.push(`status: ${oldStatus} → ${data.status}`);
    if (data.assignedTo) changes.push(`técnico atribuído: ${data.assignedTo}`);
    if (data.satisfactionRating) changes.push(`avaliação: ${data.satisfactionRating} estrelas`);
    
    documentPermissionService.logAction(
      warrantyId,
      userId,
      'edit',
      `Garantia atualizada: ${changes.join(', ')}`
    );

    return { success: true, warranty };
  }

  // Atribuir técnico
  async assignTechnician(
    warrantyId: string,
    technicianId: string,
    assignedBy: string,
    userRole: UserRole
  ): Promise<{ success: boolean; errors?: string[] }> {
    
    const validation = warrantyBusinessRules.validateTechnicianAssignment(
      warrantyId,
      technicianId,
      assignedBy,
      userRole
    );

    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const warranty = this.getWarrantyById(warrantyId);
    if (!warranty) {
      return { success: false, errors: ['Solicitação de garantia não encontrada'] };
    }

    warranty.assignedTo = technicianId;
    warranty.status = 'progress';
    warranty.updatedAt = new Date();

    return { success: true };
  }

  // Obter solicitações por usuário
  getWarrantiesByUser(userId: string, userRole: UserRole): WarrantyRequest[] {
    const permissions = warrantyBusinessRules.getWarrantyPermissions(userRole);

    if (permissions.canViewAll) {
      return this.warranties;
    }

    // Filtrar por propriedade/cliente para roles específicos
    return this.warranties.filter(warranty => {
      if (userRole === 'client') {
        return warranty.createdBy === userId;
      }
      
      if (userRole === 'inspector') {
        return warranty.assignedTo === userId || warranty.createdBy === userId;
      }

      return false;
    });
  }

  // Obter solicitações por status
  getWarrantiesByStatus(status: WarrantyStatus, userId: string, userRole: UserRole): WarrantyRequest[] {
    const userWarranties = this.getWarrantiesByUser(userId, userRole);
    return userWarranties.filter(warranty => warranty.status === status);
  }

  // Obter solicitações em atraso
  getOverdueWarranties(userId: string, userRole: UserRole): WarrantyRequest[] {
    const userWarranties = this.getWarrantiesByUser(userId, userRole);
    const now = new Date();

    return userWarranties.filter(warranty => {
      if (warranty.status === 'complete' || warranty.status === 'canceled') {
        return false;
      }

      if (!warranty.estimatedResolutionTime) {
        return false;
      }

      const expectedCompletion = new Date(warranty.createdAt);
      expectedCompletion.setHours(expectedCompletion.getHours() + warranty.estimatedResolutionTime);

      return now > expectedCompletion;
    });
  }

  // Obter métricas
  getWarrantyMetrics(userId: string, userRole: UserRole) {
    const userWarranties = this.getWarrantiesByUser(userId, userRole);
    return warrantyBusinessRules.generateWarrantyMetrics(userWarranties);
  }

  // Exportar dados
  async exportWarranties(
    userId: string,
    userRole: UserRole,
    filters?: { status?: WarrantyStatus; priority?: string; dateRange?: [Date, Date] }
  ): Promise<{ success: boolean; data?: any[]; errors?: string[] }> {
    
    const permissions = warrantyBusinessRules.getWarrantyPermissions(userRole);
    if (!permissions.canExport) {
      return { success: false, errors: ['Usuário não tem permissão para exportar dados'] };
    }

    let warranties = this.getWarrantiesByUser(userId, userRole);

    // Aplicar filtros se fornecidos
    if (filters) {
      if (filters.status) {
        warranties = warranties.filter(w => w.status === filters.status);
      }
      
      if (filters.priority) {
        warranties = warranties.filter(w => w.priority === filters.priority);
      }
      
      if (filters.dateRange) {
        const [startDate, endDate] = filters.dateRange;
        warranties = warranties.filter(w => 
          w.createdAt >= startDate && w.createdAt <= endDate
        );
      }
    }

    // Log da exportação
    documentPermissionService.logAction(
      'system',
      userId,
      'download',
      `Exportação de ${warranties.length} solicitações de garantia`
    );

    return { 
      success: true, 
      data: warranties.map(w => ({
        id: w.id,
        titulo: w.title,
        categoria: w.category,
        prioridade: w.priority,
        status: w.status,
        propriedade: w.property,
        unidade: w.unit,
        cliente: w.client,
        criado_em: w.createdAt.toLocaleDateString(),
        tempo_estimado: w.estimatedResolutionTime ? `${w.estimatedResolutionTime}h` : '',
        tempo_real: w.actualResolutionTime ? `${w.actualResolutionTime}h` : '',
        avaliacao: w.satisfactionRating || ''
      }))
    };
  }

  // Métodos auxiliares
  getWarrantyById(id: string): WarrantyRequest | undefined {
    return this.warranties.find(w => w.id === id);
  }

  private notifyCriticalWarranty(warranty: WarrantyRequest): void {
    console.log(`🚨 GARANTIA CRÍTICA: ${warranty.title} - ${warranty.property} Unidade ${warranty.unit}`);
    // Aqui seria implementada a notificação real (email, SMS, etc.)
  }

  // Limpeza de dados antigos
  cleanupOldWarranties(daysToKeep: number = 180): { removed: number; warranties: string[] } {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const oldWarranties = this.warranties.filter(w => 
      w.updatedAt < cutoffDate && 
      (w.status === 'complete' || w.status === 'canceled')
    );

    const removedTitles = oldWarranties.map(w => w.title);
    
    this.warranties = this.warranties.filter(w => 
      w.updatedAt >= cutoffDate || 
      (w.status !== 'complete' && w.status !== 'canceled')
    );

    oldWarranties.forEach(w => {
      documentPermissionService.logAction(
        w.id,
        'system',
        'delete',
        `Garantia arquivada automaticamente após ${daysToKeep} dias`
      );
    });

    return { removed: oldWarranties.length, warranties: removedTitles };
  }
}

export const warrantyService = new WarrantyService();
