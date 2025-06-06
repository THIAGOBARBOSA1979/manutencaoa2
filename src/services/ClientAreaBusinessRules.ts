
import { documentPermissionService } from './DocumentPermissionService';

export type UserRole = 'admin' | 'manager' | 'client' | 'inspector';
export type ClientStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type AccessLevel = 'full' | 'limited' | 'read-only' | 'none';

export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  status: ClientStatus;
  property: string;
  unit: string;
  accessLevel: AccessLevel;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  createdBy: string;
  documents: ClientDocument[];
  inspections: ClientInspection[];
  warrantyClaims: ClientWarrantyClaim[];
  credentials?: ClientCredentials;
}

export interface ClientDocument {
  id: string;
  title: string;
  type: string;
  uploadedAt: Date;
  uploadedBy: string;
  isRequired: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ClientInspection {
  id: string;
  title: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'canceled';
  inspector?: string;
  notes?: string;
}

export interface ClientWarrantyClaim {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  status: 'pending' | 'progress' | 'complete' | 'canceled';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ClientCredentials {
  id: string;
  username: string;
  hashedPassword: string;
  temporaryPassword?: string;
  lastPasswordChange: Date;
  requiresPasswordChange: boolean;
  loginAttempts: number;
  lockedUntil?: Date;
}

export interface ClientPermissions {
  canCreate: boolean;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canGenerateCredentials: boolean;
  canManageAccess: boolean;
  canViewSensitiveData: boolean;
  canExport: boolean;
  canViewAll: boolean;
}

class ClientAreaBusinessRules {
  // Definir permissões baseadas no perfil do usuário
  getClientPermissions(userRole: UserRole, isOwner: boolean = false): ClientPermissions {
    const rolePermissions: Record<UserRole, ClientPermissions> = {
      admin: {
        canCreate: true,
        canView: true,
        canEdit: true,
        canDelete: true,
        canGenerateCredentials: true,
        canManageAccess: true,
        canViewSensitiveData: true,
        canExport: true,
        canViewAll: true
      },
      manager: {
        canCreate: true,
        canView: true,
        canEdit: true,
        canDelete: false,
        canGenerateCredentials: true,
        canManageAccess: true,
        canViewSensitiveData: true,
        canExport: true,
        canViewAll: true
      },
      inspector: {
        canCreate: false,
        canView: isOwner,
        canEdit: false,
        canDelete: false,
        canGenerateCredentials: false,
        canManageAccess: false,
        canViewSensitiveData: false,
        canExport: false,
        canViewAll: false
      },
      client: {
        canCreate: false,
        canView: isOwner,
        canEdit: false,
        canDelete: false,
        canGenerateCredentials: false,
        canManageAccess: false,
        canViewSensitiveData: false,
        canExport: false,
        canViewAll: false
      }
    };

    return rolePermissions[userRole];
  }

  // Validar criação de cliente
  validateClientCreation(
    clientData: Partial<ClientData>,
    userRole: UserRole,
    userId: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Verificar permissões básicas
    const permissions = this.getClientPermissions(userRole);
    if (!permissions.canCreate) {
      errors.push('Usuário não tem permissão para criar clientes');
      return { isValid: false, errors };
    }

    // Validações obrigatórias
    if (!clientData.name?.trim()) {
      errors.push('Nome é obrigatório');
    }

    if (!clientData.email?.trim()) {
      errors.push('Email é obrigatório');
    } else if (!this.isValidEmail(clientData.email)) {
      errors.push('Email deve ter um formato válido');
    }

    if (!clientData.phone?.trim()) {
      errors.push('Telefone é obrigatório');
    } else if (!this.isValidPhone(clientData.phone)) {
      errors.push('Telefone deve ter um formato válido');
    }

    if (!clientData.property?.trim()) {
      errors.push('Empreendimento é obrigatório');
    }

    if (!clientData.unit?.trim()) {
      errors.push('Unidade é obrigatória');
    }

    // Validar CPF se fornecido
    if (clientData.cpf && !this.isValidCPF(clientData.cpf)) {
      errors.push('CPF deve ter um formato válido');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validar geração de credenciais
  validateCredentialsGeneration(
    clientId: string,
    userRole: UserRole,
    userId: string,
    credentialsData: {
      username?: string;
      sendByEmail?: boolean;
      temporaryPassword?: boolean;
    }
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const permissions = this.getClientPermissions(userRole);
    if (!permissions.canGenerateCredentials) {
      errors.push('Usuário não tem permissão para gerar credenciais');
    }

    if (!credentialsData.username?.trim()) {
      errors.push('Nome de usuário é obrigatório');
    } else if (credentialsData.username.length < 3) {
      errors.push('Nome de usuário deve ter pelo menos 3 caracteres');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validar atualização de cliente
  validateClientUpdate(
    clientId: string,
    updateData: Partial<ClientData>,
    userRole: UserRole,
    userId: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const permissions = this.getClientPermissions(userRole);
    if (!permissions.canEdit) {
      errors.push('Usuário não tem permissão para editar clientes');
    }

    // Validar email se fornecido
    if (updateData.email && !this.isValidEmail(updateData.email)) {
      errors.push('Email deve ter um formato válido');
    }

    // Validar telefone se fornecido
    if (updateData.phone && !this.isValidPhone(updateData.phone)) {
      errors.push('Telefone deve ter um formato válido');
    }

    // Validar CPF se fornecido
    if (updateData.cpf && !this.isValidCPF(updateData.cpf)) {
      errors.push('CPF deve ter um formato válido');
    }

    // Validar mudança de status
    if (updateData.status) {
      const statusValidation = this.validateStatusChange(updateData.status, userRole);
      if (!statusValidation.isValid) {
        errors.push(...statusValidation.errors);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validar mudança de status
  validateStatusChange(
    newStatus: ClientStatus,
    userRole: UserRole
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const permissions = this.getClientPermissions(userRole);
    
    if (newStatus === 'suspended' && !permissions.canManageAccess) {
      errors.push('Usuário não tem permissão para suspender clientes');
    }

    if (newStatus === 'inactive' && !permissions.canManageAccess) {
      errors.push('Usuário não tem permissão para desativar clientes');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validar busca de cliente
  validateClientSearch(
    searchQuery: string,
    userRole: UserRole,
    userId: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const permissions = this.getClientPermissions(userRole);
    if (!permissions.canView) {
      errors.push('Usuário não tem permissão para buscar clientes');
    }

    if (!searchQuery.trim()) {
      errors.push('Termo de busca é obrigatório');
    }

    if (searchQuery.length < 3) {
      errors.push('Termo de busca deve ter pelo menos 3 caracteres');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Gerar senha segura
  generateSecurePassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Garantir pelo menos um caractere de cada tipo
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
    
    // Preencher o resto aleatoriamente
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Embaralhar a senha
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  // Validar nível de acesso
  validateAccessLevel(
    accessLevel: AccessLevel,
    userRole: UserRole
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const permissions = this.getClientPermissions(userRole);
    if (!permissions.canManageAccess) {
      errors.push('Usuário não tem permissão para gerenciar níveis de acesso');
    }

    if (accessLevel === 'full' && userRole !== 'admin') {
      errors.push('Apenas administradores podem conceder acesso completo');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Métodos de validação auxiliares
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  private isValidCPF(cpf: string): boolean {
    // Remove formatação
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cleanCPF.length !== 11) return false;
    
    // Verifica se não são todos iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF[i]) * (10 - i);
    }
    let digit1 = (sum * 10) % 11;
    if (digit1 === 10) digit1 = 0;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF[i]) * (11 - i);
    }
    let digit2 = (sum * 10) % 11;
    if (digit2 === 10) digit2 = 0;
    
    return digit1 === parseInt(cleanCPF[9]) && digit2 === parseInt(cleanCPF[10]);
  }

  // Gerar métricas da área do cliente
  generateClientMetrics(clients: ClientData[]): {
    totalClients: number;
    activeClients: number;
    inactiveClients: number;
    pendingClients: number;
    suspendedClients: number;
    clientsWithCredentials: number;
    recentLogins: number;
  } {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      totalClients: clients.length,
      activeClients: clients.filter(c => c.status === 'active').length,
      inactiveClients: clients.filter(c => c.status === 'inactive').length,
      pendingClients: clients.filter(c => c.status === 'pending').length,
      suspendedClients: clients.filter(c => c.status === 'suspended').length,
      clientsWithCredentials: clients.filter(c => c.credentials).length,
      recentLogins: clients.filter(c => c.lastLogin && c.lastLogin >= thirtyDaysAgo).length
    };
  }

  // Log de ações para auditoria
  logClientAction(
    clientId: string,
    userId: string,
    action: 'create' | 'edit' | 'delete' | 'view' | 'credentials' | 'status_change',
    details: string
  ): void {
    documentPermissionService.logAction(
      clientId,
      userId,
      action,
      `Cliente: ${details}`
    );
  }
}

export const clientAreaBusinessRules = new ClientAreaBusinessRules();
