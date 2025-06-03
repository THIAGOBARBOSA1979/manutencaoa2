
export interface UserPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canDownload: boolean;
  canView: boolean;
  canApprove: boolean;
  canArchive: boolean;
  canManageVersions: boolean;
}

export interface DocumentAccess {
  userId: string;
  documentId: string;
  accessLevel: 'read' | 'write' | 'admin';
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
}

export interface AuditLog {
  id: string;
  documentId: string;
  userId: string;
  action: 'create' | 'view' | 'download' | 'edit' | 'delete' | 'approve' | 'archive' | 'share';
  timestamp: Date;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

class DocumentPermissionService {
  private auditLogs: AuditLog[] = [];
  private documentAccess: DocumentAccess[] = [];

  // Verificar permissões baseadas no perfil do usuário
  getUserPermissions(userId: string, userRole: 'admin' | 'manager' | 'client' | 'inspector'): UserPermissions {
    const basePermissions: Record<string, UserPermissions> = {
      admin: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canDownload: true,
        canView: true,
        canApprove: true,
        canArchive: true,
        canManageVersions: true
      },
      manager: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canDownload: true,
        canView: true,
        canApprove: true,
        canArchive: true,
        canManageVersions: true
      },
      inspector: {
        canCreate: true,
        canEdit: false,
        canDelete: false,
        canDownload: true,
        canView: true,
        canApprove: false,
        canArchive: false,
        canManageVersions: false
      },
      client: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canDownload: true,
        canView: true,
        canApprove: false,
        canArchive: false,
        canManageVersions: false
      }
    };

    return basePermissions[userRole] || basePermissions.client;
  }

  // Verificar se usuário pode acessar documento específico
  canAccessDocument(userId: string, documentId: string, action: string): boolean {
    const access = this.documentAccess.find(a => 
      a.userId === userId && 
      a.documentId === documentId &&
      (!a.expiresAt || a.expiresAt > new Date())
    );

    if (!access) return false;

    const actionPermissions = {
      'read': ['read', 'write', 'admin'],
      'write': ['write', 'admin'],
      'admin': ['admin']
    };

    return actionPermissions[action as keyof typeof actionPermissions]?.includes(access.accessLevel) || false;
  }

  // Registrar ação no log de auditoria
  logAction(
    documentId: string, 
    userId: string, 
    action: AuditLog['action'], 
    details: string,
    metadata?: { ipAddress?: string; userAgent?: string }
  ): void {
    const logEntry: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      documentId,
      userId,
      action,
      timestamp: new Date(),
      details,
      ...metadata
    };

    this.auditLogs.push(logEntry);
    console.log('DocumentPermissionService: Ação registrada no log:', logEntry);
  }

  // Conceder acesso a documento
  grantAccess(
    documentId: string,
    userId: string,
    accessLevel: DocumentAccess['accessLevel'],
    grantedBy: string,
    expiresAt?: Date
  ): void {
    // Remover acesso anterior se existir
    this.documentAccess = this.documentAccess.filter(a => 
      !(a.documentId === documentId && a.userId === userId)
    );

    const access: DocumentAccess = {
      userId,
      documentId,
      accessLevel,
      grantedBy,
      grantedAt: new Date(),
      expiresAt
    };

    this.documentAccess.push(access);
    this.logAction(documentId, grantedBy, 'share', `Acesso ${accessLevel} concedido para usuário ${userId}`);
  }

  // Revogar acesso a documento
  revokeAccess(documentId: string, userId: string, revokedBy: string): void {
    this.documentAccess = this.documentAccess.filter(a => 
      !(a.documentId === documentId && a.userId === userId)
    );

    this.logAction(documentId, revokedBy, 'share', `Acesso revogado para usuário ${userId}`);
  }

  // Obter logs de auditoria para um documento
  getDocumentAuditLogs(documentId: string): AuditLog[] {
    return this.auditLogs.filter(log => log.documentId === documentId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Obter logs de auditoria para um usuário
  getUserAuditLogs(userId: string): AuditLog[] {
    return this.auditLogs.filter(log => log.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Limpar logs antigos (política de retenção)
  cleanupOldLogs(daysToKeep: number = 90): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const originalCount = this.auditLogs.length;
    this.auditLogs = this.auditLogs.filter(log => log.timestamp >= cutoffDate);
    
    console.log(`DocumentPermissionService: ${originalCount - this.auditLogs.length} logs antigos removidos`);
  }

  // Validar integridade de acesso
  validateDocumentAccess(): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    const now = new Date();

    // Verificar acessos expirados
    const expiredAccess = this.documentAccess.filter(a => 
      a.expiresAt && a.expiresAt <= now
    );

    if (expiredAccess.length > 0) {
      issues.push(`${expiredAccess.length} permissões de acesso expiraram`);
    }

    // Verificar duplicatas
    const accessMap = new Map<string, number>();
    this.documentAccess.forEach(a => {
      const key = `${a.documentId}_${a.userId}`;
      accessMap.set(key, (accessMap.get(key) || 0) + 1);
    });

    const duplicates = Array.from(accessMap.entries()).filter(([_, count]) => count > 1);
    if (duplicates.length > 0) {
      issues.push(`${duplicates.length} permissões duplicadas encontradas`);
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

export const documentPermissionService = new DocumentPermissionService();
