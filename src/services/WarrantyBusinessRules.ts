
import { documentPermissionService } from './DocumentPermissionService';

export type UserRole = 'admin' | 'manager' | 'client' | 'inspector';
export type WarrantyStatus = 'pending' | 'progress' | 'complete' | 'critical' | 'canceled';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface WarrantyRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: PriorityLevel;
  status: WarrantyStatus;
  property: string;
  unit: string;
  client: string;
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  estimatedResolutionTime?: number; // em horas
  actualResolutionTime?: number; // em horas
  satisfactionRating?: number; // 1-5
  isUrgent: boolean;
  requiresInspection: boolean;
  materials?: string[];
  evidences?: string[];
  notes?: string[];
}

export interface WarrantyPermissions {
  canCreate: boolean;
  canView: boolean;
  canEdit: boolean;
  canAssign: boolean;
  canComplete: boolean;
  canCancel: boolean;
  canRate: boolean;
  canViewAll: boolean;
  canExport: boolean;
  canManageProblems: boolean;
}

class WarrantyBusinessRules {
  // Definir permissões baseadas no perfil do usuário
  getWarrantyPermissions(userRole: UserRole, isOwner: boolean = false): WarrantyPermissions {
    const rolePermissions: Record<UserRole, WarrantyPermissions> = {
      admin: {
        canCreate: true,
        canView: true,
        canEdit: true,
        canAssign: true,
        canComplete: true,
        canCancel: true,
        canRate: false,
        canViewAll: true,
        canExport: true,
        canManageProblems: true
      },
      manager: {
        canCreate: true,
        canView: true,
        canEdit: true,
        canAssign: true,
        canComplete: true,
        canCancel: true,
        canRate: false,
        canViewAll: true,
        canExport: true,
        canManageProblems: true
      },
      inspector: {
        canCreate: true,
        canView: true,
        canEdit: isOwner,
        canAssign: false,
        canComplete: isOwner,
        canCancel: false,
        canRate: false,
        canViewAll: false,
        canExport: false,
        canManageProblems: isOwner
      },
      client: {
        canCreate: true,
        canView: isOwner,
        canEdit: false,
        canAssign: false,
        canComplete: false,
        canCancel: isOwner && ['pending'].includes('pending'), // apenas se ainda não foi atribuída
        canRate: isOwner,
        canViewAll: false,
        canExport: false,
        canManageProblems: false
      }
    };

    return rolePermissions[userRole];
  }

  // Validar criação de solicitação de garantia
  validateWarrantyCreation(
    request: {
      title?: string;
      description?: string;
      category?: string;
      priority?: PriorityLevel;
      property?: string;
      unit?: string;
      client?: string;
    },
    userRole: UserRole,
    userId: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Verificar permissões básicas
    const permissions = this.getWarrantyPermissions(userRole);
    if (!permissions.canCreate) {
      errors.push('Usuário não tem permissão para criar solicitações de garantia');
      return { isValid: false, errors };
    }

    // Validações obrigatórias
    if (!request.title?.trim()) {
      errors.push('Título é obrigatório');
    }

    if (!request.description?.trim() || request.description.length < 20) {
      errors.push('Descrição deve ter pelo menos 20 caracteres');
    }

    if (!request.category) {
      errors.push('Categoria é obrigatória');
    }

    if (!request.property?.trim()) {
      errors.push('Empreendimento é obrigatório');
    }

    if (!request.unit?.trim()) {
      errors.push('Unidade é obrigatória');
    }

    // Validação de prioridade baseada no perfil
    if (request.priority === 'critical' && userRole === 'client') {
      errors.push('Clientes não podem criar solicitações com prioridade crítica');
    }

    // Verificar se o cliente pode criar solicitações para esta propriedade
    if (userRole === 'client') {
      // Aqui seria verificado se o cliente tem acesso à propriedade/unidade
      // Por simplicidade, assumimos que está validado
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validar atualização de status
  validateStatusChange(
    currentStatus: WarrantyStatus,
    newStatus: WarrantyStatus,
    userRole: UserRole,
    isAssigned: boolean = false
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const allowedTransitions: Record<WarrantyStatus, WarrantyStatus[]> = {
      pending: ['progress', 'canceled'],
      progress: ['complete', 'pending', 'critical'],
      critical: ['progress', 'complete'],
      complete: [], // Estado final
      canceled: [] // Estado final
    };

    // Verificar se a transição é válida
    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      errors.push(`Transição de ${currentStatus} para ${newStatus} não é permitida`);
    }

    // Verificar permissões específicas por status
    const permissions = this.getWarrantyPermissions(userRole, isAssigned);

    if (newStatus === 'complete' && !permissions.canComplete) {
      errors.push('Usuário não tem permissão para completar solicitações');
    }

    if (newStatus === 'canceled' && !permissions.canCancel) {
      errors.push('Usuário não tem permissão para cancelar solicitações');
    }

    if (newStatus === 'progress' && currentStatus === 'pending' && !permissions.canAssign) {
      errors.push('Usuário não tem permissão para iniciar atendimento');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Calcular prioridade automática baseada em critérios
  calculateAutoPriority(request: {
    category?: string;
    description?: string;
  }): PriorityLevel {
    let score = 0;

    // Critérios de urgência baseados na categoria
    const urgentCategories = ['Hidráulica', 'Elétrica', 'Estrutural'];
    if (urgentCategories.includes(request.category || '')) {
      score += 2;
    }

    // Palavras-chave na descrição que indicam urgência
    const urgentKeywords = ['vazamento', 'infiltração', 'curto', 'fogo', 'emergência', 'urgente'];
    const description = (request.description || '').toLowerCase();
    urgentKeywords.forEach(keyword => {
      if (description.includes(keyword)) {
        score += 1;
      }
    });

    // Retornar prioridade baseada no score
    if (score >= 4) return 'critical';
    if (score >= 2) return 'high';
    if (score >= 1) return 'medium';
    return 'low';
  }

  // Calcular tempo estimado de resolução
  calculateEstimatedResolutionTime(category: string, priority: PriorityLevel): number {
    const baseTimes: Record<string, number> = {
      'Hidráulica': 24,
      'Elétrica': 12,
      'Estrutural': 72,
      'Esquadrias': 48,
      'Acabamentos': 36,
      'Outros': 24
    };

    const priorityMultipliers: Record<PriorityLevel, number> = {
      critical: 0.25,
      high: 0.5,
      medium: 1,
      low: 2
    };

    const baseTime = baseTimes[category] || 24;
    const multiplier = priorityMultipliers[priority];

    return Math.max(2, baseTime * multiplier); // Mínimo de 2 horas
  }

  // Validar atribuição de técnico
  validateTechnicianAssignment(
    warrantyId: string,
    technicianId: string,
    assignedBy: string,
    userRole: UserRole
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const permissions = this.getWarrantyPermissions(userRole);
    if (!permissions.canAssign) {
      errors.push('Usuário não tem permissão para atribuir técnicos');
    }

    // Verificar se o técnico existe e está ativo
    // Aqui seria feita a verificação real no banco de dados
    if (!technicianId.trim()) {
      errors.push('Técnico deve ser especificado');
    }

    // Log da atribuição
    if (errors.length === 0) {
      documentPermissionService.logAction(
        warrantyId,
        assignedBy,
        'edit',
        `Técnico ${technicianId} atribuído à garantia`
      );
    }

    return { isValid: errors.length === 0, errors };
  }

  // Verificar se solicitação está dentro do prazo de garantia
  validateWarrantyPeriod(
    category: string,
    issueDate: Date,
    propertyDeliveryDate: Date
  ): { isValid: boolean; remainingDays: number; errors: string[] } {
    const errors: string[] = [];

    const warrantyPeriods: Record<string, number> = {
      'Estrutural': 5 * 365, // 5 anos
      'Hidráulica': 3 * 365, // 3 anos
      'Elétrica': 3 * 365, // 3 anos
      'Impermeabilização': 3 * 365, // 3 anos
      'Esquadrias': 2 * 365, // 2 anos
      'Acabamentos': 1 * 365, // 1 ano
      'Outros': 1 * 365 // 1 ano padrão
    };

    const warrantyDays = warrantyPeriods[category] || warrantyPeriods['Outros'];
    const expiryDate = new Date(propertyDeliveryDate);
    expiryDate.setDate(expiryDate.getDate() + warrantyDays);

    const remainingDays = Math.ceil((expiryDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));

    if (remainingDays <= 0) {
      errors.push(`Garantia expirada. Período de ${warrantyDays / 365} anos encerrado em ${expiryDate.toLocaleDateString()}`);
    } else if (remainingDays <= 30) {
      // Aviso de garantia próxima ao vencimento
      console.warn(`Garantia expira em ${remainingDays} dias`);
    }

    return {
      isValid: remainingDays > 0,
      remainingDays: Math.max(0, remainingDays),
      errors
    };
  }

  // Gerar relatório de métricas de garantia
  generateWarrantyMetrics(warranties: WarrantyRequest[]): {
    totalRequests: number;
    byStatus: Record<WarrantyStatus, number>;
    byPriority: Record<PriorityLevel, number>;
    averageResolutionTime: number;
    satisfactionAverage: number;
    overdueRequests: number;
  } {
    const byStatus: Record<WarrantyStatus, number> = {
      pending: 0,
      progress: 0,
      complete: 0,
      critical: 0,
      canceled: 0
    };

    const byPriority: Record<PriorityLevel, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };

    let totalResolutionTime = 0;
    let completedRequests = 0;
    let totalSatisfaction = 0;
    let ratedRequests = 0;
    let overdueRequests = 0;

    const now = new Date();

    warranties.forEach(warranty => {
      byStatus[warranty.status]++;
      byPriority[warranty.priority]++;

      if (warranty.status === 'complete' && warranty.actualResolutionTime) {
        totalResolutionTime += warranty.actualResolutionTime;
        completedRequests++;
      }

      if (warranty.satisfactionRating) {
        totalSatisfaction += warranty.satisfactionRating;
        ratedRequests++;
      }

      // Verificar se está atrasada
      if (warranty.estimatedResolutionTime && warranty.status !== 'complete') {
        const expectedCompletion = new Date(warranty.createdAt);
        expectedCompletion.setHours(expectedCompletion.getHours() + warranty.estimatedResolutionTime);
        
        if (now > expectedCompletion) {
          overdueRequests++;
        }
      }
    });

    return {
      totalRequests: warranties.length,
      byStatus,
      byPriority,
      averageResolutionTime: completedRequests > 0 ? totalResolutionTime / completedRequests : 0,
      satisfactionAverage: ratedRequests > 0 ? totalSatisfaction / ratedRequests : 0,
      overdueRequests
    };
  }

  // Validar avaliação de satisfação
  validateSatisfactionRating(
    warrantyId: string,
    rating: number,
    userId: string,
    userRole: UserRole,
    isOwner: boolean
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const permissions = this.getWarrantyPermissions(userRole, isOwner);
    if (!permissions.canRate) {
      errors.push('Usuário não tem permissão para avaliar solicitações');
    }

    if (rating < 1 || rating > 5) {
      errors.push('Avaliação deve ser entre 1 e 5');
    }

    // Log da avaliação
    if (errors.length === 0) {
      documentPermissionService.logAction(
        warrantyId,
        userId,
        'edit',
        `Avaliação de satisfação registrada: ${rating} estrelas`
      );
    }

    return { isValid: errors.length === 0, errors };
  }
}

export const warrantyBusinessRules = new WarrantyBusinessRules();
