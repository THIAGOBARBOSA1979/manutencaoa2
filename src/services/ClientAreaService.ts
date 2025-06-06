
import { clientAreaBusinessRules, ClientData, ClientCredentials, UserRole, ClientStatus } from './ClientAreaBusinessRules';
import { v4 as uuidv4 } from 'uuid';

export interface CreateClientData {
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  property: string;
  unit: string;
  accessLevel?: 'full' | 'limited' | 'read-only';
}

export interface UpdateClientData {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  status?: ClientStatus;
  accessLevel?: 'full' | 'limited' | 'read-only';
}

export interface GenerateCredentialsData {
  username: string;
  sendByEmail?: boolean;
  temporaryPassword?: boolean;
  customPassword?: string;
}

class ClientAreaService {
  private clients: ClientData[] = [];

  // Criar novo cliente
  async createClient(
    data: CreateClientData,
    userId: string,
    userRole: UserRole
  ): Promise<{ success: boolean; client?: ClientData; errors?: string[] }> {
    
    // Validar dados de entrada
    const validation = clientAreaBusinessRules.validateClientCreation(data, userRole, userId);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    // Verificar se cliente já existe
    const existingClient = this.clients.find(c => c.email === data.email);
    if (existingClient) {
      return { success: false, errors: ['Cliente com este email já existe'] };
    }

    // Criar cliente
    const client: ClientData = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf,
      status: 'pending',
      property: data.property,
      unit: data.unit,
      accessLevel: data.accessLevel || 'limited',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      documents: [],
      inspections: [],
      warrantyClaims: []
    };

    this.clients.push(client);

    // Log da criação
    clientAreaBusinessRules.logClientAction(
      client.id,
      userId,
      'create',
      `Cliente "${client.name}" criado - ${client.property} Unidade ${client.unit}`
    );

    return { success: true, client };
  }

  // Atualizar cliente
  async updateClient(
    clientId: string,
    data: UpdateClientData,
    userId: string,
    userRole: UserRole
  ): Promise<{ success: boolean; client?: ClientData; errors?: string[] }> {
    
    const client = this.getClientById(clientId);
    if (!client) {
      return { success: false, errors: ['Cliente não encontrado'] };
    }

    const validation = clientAreaBusinessRules.validateClientUpdate(clientId, data, userRole, userId);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    // Verificar se email já existe (se foi alterado)
    if (data.email && data.email !== client.email) {
      const existingClient = this.clients.find(c => c.email === data.email && c.id !== clientId);
      if (existingClient) {
        return { success: false, errors: ['Cliente com este email já existe'] };
      }
    }

    // Aplicar atualizações
    const oldStatus = client.status;
    Object.assign(client, {
      ...data,
      updatedAt: new Date()
    });

    // Log da atualização
    const changes: string[] = [];
    if (data.name) changes.push(`nome: ${data.name}`);
    if (data.email) changes.push(`email: ${data.email}`);
    if (data.status && data.status !== oldStatus) changes.push(`status: ${oldStatus} → ${data.status}`);
    if (data.accessLevel) changes.push(`nível de acesso: ${data.accessLevel}`);
    
    clientAreaBusinessRules.logClientAction(
      clientId,
      userId,
      'edit',
      `Cliente atualizado: ${changes.join(', ')}`
    );

    return { success: true, client };
  }

  // Gerar credenciais para cliente
  async generateCredentials(
    clientId: string,
    data: GenerateCredentialsData,
    userId: string,
    userRole: UserRole
  ): Promise<{ success: boolean; credentials?: { username: string; password: string }; errors?: string[] }> {
    
    const client = this.getClientById(clientId);
    if (!client) {
      return { success: false, errors: ['Cliente não encontrado'] };
    }

    const validation = clientAreaBusinessRules.validateCredentialsGeneration(clientId, userRole, userId, data);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    // Verificar se username já existe
    const existingCredentials = this.clients.find(c => c.credentials?.username === data.username);
    if (existingCredentials && existingCredentials.id !== clientId) {
      return { success: false, errors: ['Nome de usuário já existe'] };
    }

    // Gerar ou usar senha fornecida
    const password = data.customPassword || clientAreaBusinessRules.generateSecurePassword();
    
    // Criar credenciais
    const credentials: ClientCredentials = {
      id: uuidv4(),
      username: data.username,
      hashedPassword: this.hashPassword(password), // Em produção, usar bcrypt
      temporaryPassword: data.temporaryPassword ? password : undefined,
      lastPasswordChange: new Date(),
      requiresPasswordChange: data.temporaryPassword || false,
      loginAttempts: 0
    };

    client.credentials = credentials;
    client.status = 'active';
    client.updatedAt = new Date();

    // Log da geração de credenciais
    clientAreaBusinessRules.logClientAction(
      clientId,
      userId,
      'credentials',
      `Credenciais geradas para usuário "${data.username}"`
    );

    // Simular envio por email se solicitado
    if (data.sendByEmail) {
      console.log(`📧 Enviando credenciais por email para ${client.email}`);
    }

    return { 
      success: true, 
      credentials: { username: data.username, password } 
    };
  }

  // Buscar clientes
  async searchClients(
    searchQuery: string,
    userId: string,
    userRole: UserRole
  ): Promise<{ success: boolean; clients?: ClientData[]; errors?: string[] }> {
    
    const validation = clientAreaBusinessRules.validateClientSearch(searchQuery, userRole, userId);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const permissions = clientAreaBusinessRules.getClientPermissions(userRole);
    let clientsToSearch = this.clients;

    // Filtrar clientes baseado nas permissões
    if (!permissions.canViewAll) {
      clientsToSearch = this.clients.filter(client => client.createdBy === userId);
    }

    // Realizar busca
    const foundClients = clientsToSearch.filter(client => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      client.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.unit.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Log da busca
    clientAreaBusinessRules.logClientAction(
      'system',
      userId,
      'view',
      `Busca realizada: "${searchQuery}" - ${foundClients.length} resultados`
    );

    return { success: true, clients: foundClients };
  }

  // Obter todos os clientes (com permissões)
  getClientsByUser(userId: string, userRole: UserRole): ClientData[] {
    const permissions = clientAreaBusinessRules.getClientPermissions(userRole);

    if (permissions.canViewAll) {
      return this.clients;
    }

    // Filtrar por criador para roles específicos
    return this.clients.filter(client => client.createdBy === userId);
  }

  // Obter clientes por status
  getClientsByStatus(status: ClientStatus, userId: string, userRole: UserRole): ClientData[] {
    const userClients = this.getClientsByUser(userId, userRole);
    return userClients.filter(client => client.status === status);
  }

  // Obter métricas
  getClientMetrics(userId: string, userRole: UserRole) {
    const userClients = this.getClientsByUser(userId, userRole);
    return clientAreaBusinessRules.generateClientMetrics(userClients);
  }

  // Exportar dados
  async exportClients(
    userId: string,
    userRole: UserRole,
    filters?: { status?: ClientStatus; property?: string }
  ): Promise<{ success: boolean; data?: any[]; errors?: string[] }> {
    
    const permissions = clientAreaBusinessRules.getClientPermissions(userRole);
    if (!permissions.canExport) {
      return { success: false, errors: ['Usuário não tem permissão para exportar dados'] };
    }

    let clients = this.getClientsByUser(userId, userRole);

    // Aplicar filtros se fornecidos
    if (filters) {
      if (filters.status) {
        clients = clients.filter(c => c.status === filters.status);
      }
      
      if (filters.property) {
        clients = clients.filter(c => c.property === filters.property);
      }
    }

    // Log da exportação
    clientAreaBusinessRules.logClientAction(
      'system',
      userId,
      'view',
      `Exportação de ${clients.length} clientes`
    );

    return { 
      success: true, 
      data: clients.map(c => ({
        id: c.id,
        nome: c.name,
        email: c.email,
        telefone: c.phone,
        cpf: c.cpf || '',
        status: c.status,
        propriedade: c.property,
        unidade: c.unit,
        nivel_acesso: c.accessLevel,
        criado_em: c.createdAt.toLocaleDateString(),
        ultimo_login: c.lastLogin?.toLocaleDateString() || 'Nunca',
        tem_credenciais: c.credentials ? 'Sim' : 'Não'
      }))
    };
  }

  // Métodos auxiliares
  getClientById(id: string): ClientData | undefined {
    return this.clients.find(c => c.id === id);
  }

  private hashPassword(password: string): string {
    // Em produção, usar bcrypt ou similar
    return Buffer.from(password).toString('base64');
  }

  // Validar credenciais de login (para uso futuro)
  async validateLogin(username: string, password: string): Promise<{ success: boolean; client?: ClientData }> {
    const client = this.clients.find(c => c.credentials?.username === username);
    
    if (!client || !client.credentials) {
      return { success: false };
    }

    // Verificar se conta está bloqueada
    if (client.credentials.lockedUntil && new Date() < client.credentials.lockedUntil) {
      return { success: false };
    }

    // Verificar senha (em produção, usar bcrypt.compare)
    const isValidPassword = client.credentials.hashedPassword === this.hashPassword(password);
    
    if (isValidPassword) {
      // Reset tentativas de login
      client.credentials.loginAttempts = 0;
      client.credentials.lockedUntil = undefined;
      client.lastLogin = new Date();
      client.updatedAt = new Date();
      
      return { success: true, client };
    } else {
      // Incrementar tentativas de login
      client.credentials.loginAttempts++;
      
      // Bloquear após 5 tentativas
      if (client.credentials.loginAttempts >= 5) {
        client.credentials.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
      }
      
      return { success: false };
    }
  }

  // Limpar dados antigos
  cleanupOldData(daysToKeep: number = 180): { removed: number; clients: string[] } {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const oldClients = this.clients.filter(c => 
      c.updatedAt < cutoffDate && 
      c.status === 'inactive'
    );

    const removedNames = oldClients.map(c => c.name);
    
    this.clients = this.clients.filter(c => 
      c.updatedAt >= cutoffDate || 
      c.status !== 'inactive'
    );

    oldClients.forEach(c => {
      clientAreaBusinessRules.logClientAction(
        c.id,
        'system',
        'delete',
        `Cliente arquivado automaticamente após ${daysToKeep} dias`
      );
    });

    return { removed: oldClients.length, clients: removedNames };
  }
}

export const clientAreaService = new ClientAreaService();
