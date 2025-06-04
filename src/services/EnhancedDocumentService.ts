import { v4 as uuidv4 } from 'uuid';
import { documentValidationService } from './DocumentValidationService';
import { documentPermissionService } from './DocumentPermissionService';
import { Document, DocumentVersion, DownloadRecord } from './DocumentService';

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
  hash?: string;
  isValid: boolean;
  errors?: string[];
}

class EnhancedDocumentService {
  private documents: Document[] = [];

  // Extrair metadados do arquivo
  async extractMetadata(file: File, userId: string): Promise<FileMetadata> {
    const metadata: FileMetadata = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified),
      isValid: true,
      errors: []
    };

    // Validações básicas
    if (file.size > 50 * 1024 * 1024) { // 50MB
      metadata.isValid = false;
      metadata.errors?.push('Arquivo muito grande (máximo 50MB)');
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
      metadata.isValid = false;
      metadata.errors?.push('Tipo de arquivo não permitido');
    }

    // Simular geração de hash
    metadata.hash = `hash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log da extração de metadados
    documentPermissionService.logAction(
      'system',
      userId,
      'metadata_extraction',
      `Metadados extraídos para ${file.name}`,
      { fileSize: file.size, fileType: file.type }
    );

    return metadata;
  }

  // Criar documento com validações aprimoradas
  async createDocument(
    data: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'downloads' | 'version'>,
    userId: string,
    userRole: 'admin' | 'manager' | 'client' | 'inspector'
  ): Promise<{ success: boolean; document?: Document; errors?: string[] }> {
    
    // Verificar permissões
    const permissions = documentPermissionService.getUserPermissions(userId, userRole);
    if (!permissions.canCreate) {
      return { 
        success: false, 
        errors: ['Usuário não tem permissão para criar documentos'] 
      };
    }

    // Validar dados do documento
    const validationErrors = this.validateDocumentData(data);
    if (validationErrors.length > 0) {
      return { success: false, errors: validationErrors };
    }

    const newDocument: Document = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      downloads: 0,
      version: 1
    };
    
    this.documents.push(newDocument);
    
    // Log da criação
    documentPermissionService.logAction(
      newDocument.id,
      userId,
      'create',
      `Documento "${newDocument.title}" criado`
    );

    console.log('EnhancedDocumentService: Documento criado:', newDocument.title);
    return { success: true, document: newDocument };
  }

  // Atualizar documento com controle de versões aprimorado
  async updateDocument(
    id: string, 
    data: Partial<Document>,
    userId: string,
    userRole: 'admin' | 'manager' | 'client' | 'inspector'
  ): Promise<{ success: boolean; document?: Document; errors?: string[] }> {
    
    const permissions = documentPermissionService.getUserPermissions(userId, userRole);
    if (!permissions.canEdit) {
      return { 
        success: false, 
        errors: ['Usuário não tem permissão para editar documentos'] 
      };
    }

    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) {
      return { success: false, errors: ['Documento não encontrado'] };
    }

    const document = this.documents[index];
    
    // Verificar se documento está arquivado
    if (document.status === 'archived' && !permissions.canArchive) {
      return { 
        success: false, 
        errors: ['Documento arquivado não pode ser editado'] 
      };
    }

    const hasContentChanges = data.template && data.template !== document.template;
    const oldDocument = { ...document };

    // Atualizar documento
    this.documents[index] = {
      ...document,
      ...data,
      updatedAt: new Date(),
      version: hasContentChanges ? document.version + 1 : document.version
    };

    // Criar entrada no histórico de versões se houve mudanças no conteúdo
    if (hasContentChanges && permissions.canManageVersions) {
      const versionEntry: DocumentVersion = {
        id: uuidv4(),
        version: oldDocument.version,
        title: oldDocument.title,
        template: oldDocument.template,
        createdAt: new Date(),
        createdBy: userId,
        changes: this.generateChangesSummary(oldDocument, this.documents[index]),
        fileHash: oldDocument.fileHash
      };

      if (!this.documents[index].versionHistory) {
        this.documents[index].versionHistory = [];
      }
      this.documents[index].versionHistory!.push(versionEntry);
    }

    // Log da atualização
    documentPermissionService.logAction(
      id,
      userId,
      'edit',
      `Documento atualizado${hasContentChanges ? ' (nova versão)' : ''}`
    );

    return { success: true, document: this.documents[index] };
  }

  // Download seguro com auditoria
  async downloadDocument(
    documentId: string, 
    userId: string,
    userRole: 'admin' | 'manager' | 'client' | 'inspector',
    metadata?: { ipAddress?: string; userAgent?: string }
  ): Promise<{ success: boolean; fileUrl?: string; errors?: string[] }> {
    
    const permissions = documentPermissionService.getUserPermissions(userId, userRole);
    if (!permissions.canDownload) {
      return { 
        success: false, 
        errors: ['Usuário não tem permissão para baixar documentos'] 
      };
    }

    const document = this.getDocumentById(documentId);
    if (!document) {
      return { success: false, errors: ['Documento não encontrado'] };
    }

    // Verificar acesso específico ao documento
    if (!documentPermissionService.canAccessDocument(userId, documentId, 'read')) {
      return { 
        success: false, 
        errors: ['Acesso negado a este documento específico'] 
      };
    }

    // Verificar se documento está visível
    if (!document.visible && userRole === 'client') {
      return { 
        success: false, 
        errors: ['Documento não está disponível para download'] 
      };
    }

    // Registrar download
    const downloadRecord: DownloadRecord = {
      id: uuidv4(),
      userId,
      downloadedAt: new Date(),
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
      success: true
    };

    if (!document.downloadHistory) {
      document.downloadHistory = [];
    }
    document.downloadHistory.push(downloadRecord);

    // Atualizar contadores e último acesso
    document.downloads += 1;
    document.lastAccessedAt = new Date();
    document.lastAccessedBy = userId;

    // Log do download
    documentPermissionService.logAction(
      documentId,
      userId,
      'download',
      `Download do documento "${document.title}"`,
      metadata
    );

    return { 
      success: true, 
      fileUrl: document.fileUrl || `/api/documents/${documentId}/download` 
    };
  }

  // Visualizar documento com auditoria
  async viewDocument(
    documentId: string,
    userId: string,
    userRole: 'admin' | 'manager' | 'client' | 'inspector'
  ): Promise<{ success: boolean; document?: Document; errors?: string[] }> {
    
    const permissions = documentPermissionService.getUserPermissions(userId, userRole);
    if (!permissions.canView) {
      return { 
        success: false, 
        errors: ['Usuário não tem permissão para visualizar documentos'] 
      };
    }

    const document = this.getDocumentById(documentId);
    if (!document) {
      return { success: false, errors: ['Documento não encontrado'] };
    }

    // Verificar acesso específico
    if (!documentPermissionService.canAccessDocument(userId, documentId, 'read')) {
      return { 
        success: false, 
        errors: ['Acesso negado a este documento'] 
      };
    }

    // Atualizar último acesso (sem incrementar downloads)
    document.lastAccessedAt = new Date();
    document.lastAccessedBy = userId;

    // Log da visualização (apenas para documentos restritos)
    if (document.securityLevel !== 'public') {
      documentPermissionService.logAction(
        documentId,
        userId,
        'view',
        `Visualização do documento "${document.title}"`
      );
    }

    return { success: true, document };
  }

  // Excluir documento com validações
  async deleteDocument(
    id: string,
    userId: string,
    userRole: 'admin' | 'manager' | 'client' | 'inspector'
  ): Promise<{ success: boolean; errors?: string[] }> {
    
    const permissions = documentPermissionService.getUserPermissions(userId, userRole);
    if (!permissions.canDelete) {
      return { 
        success: false, 
        errors: ['Usuário não tem permissão para excluir documentos'] 
      };
    }

    const document = this.getDocumentById(id);
    if (!document) {
      return { success: false, errors: ['Documento não encontrado'] };
    }

    // Verificar se documento pode ser excluído
    if (document.status === 'published' && document.downloads > 0 && userRole !== 'admin') {
      return { 
        success: false, 
        errors: ['Documento publicado com downloads não pode ser excluído'] 
      };
    }

    const index = this.documents.findIndex(doc => doc.id === id);
    this.documents.splice(index, 1);

    // Log da exclusão
    documentPermissionService.logAction(
      id,
      userId,
      'delete',
      `Documento "${document.title}" excluído permanentemente`
    );

    return { success: true };
  }

  // Aprovar documento
  async approveDocument(
    id: string,
    userId: string,
    userRole: 'admin' | 'manager' | 'client' | 'inspector'
  ): Promise<{ success: boolean; document?: Document; errors?: string[] }> {
    
    const permissions = documentPermissionService.getUserPermissions(userId, userRole);
    if (!permissions.canApprove) {
      return { 
        success: false, 
        errors: ['Usuário não tem permissão para aprovar documentos'] 
      };
    }

    const document = this.getDocumentById(id);
    if (!document) {
      return { success: false, errors: ['Documento não encontrado'] };
    }

    if (document.status !== 'draft') {
      return { 
        success: false, 
        errors: ['Apenas documentos em rascunho podem ser aprovados'] 
      };
    }

    // Atualizar status
    document.status = 'published';
    document.approvedBy = userId;
    document.approvedAt = new Date();
    document.updatedAt = new Date();

    // Log da aprovação
    documentPermissionService.logAction(
      id,
      userId,
      'approve',
      `Documento "${document.title}" aprovado e publicado`
    );

    return { success: true, document };
  }

  // Métodos auxiliares
  private validateDocumentData(data: Partial<Document>): string[] {
    const errors: string[] = [];

    if (!data.title || data.title.trim().length === 0) {
      errors.push('Título é obrigatório');
    }

    if (!data.category) {
      errors.push('Categoria é obrigatória');
    }

    if (!data.createdBy) {
      errors.push('Criador é obrigatório');
    }

    if (data.type === 'auto' && !data.template) {
      errors.push('Template é obrigatório para documentos automáticos');
    }

    return errors;
  }

  private generateChangesSummary(oldDoc: Document, newDoc: Document): string {
    const changes: string[] = [];

    if (oldDoc.title !== newDoc.title) changes.push('título alterado');
    if (oldDoc.template !== newDoc.template) changes.push('template alterado');
    if (oldDoc.category !== newDoc.category) changes.push('categoria alterada');
    if (oldDoc.priority !== newDoc.priority) changes.push('prioridade alterada');

    return changes.length > 0 ? changes.join(', ') : 'alterações menores';
  }

  // Métodos de consulta (mantendo compatibilidade)
  getAllDocuments(): Document[] {
    return this.documents;
  }

  getDocumentById(id: string): Document | undefined {
    return this.documents.find(doc => doc.id === id);
  }

  getDocumentsByClient(clientName: string): Document[] {
    return this.documents.filter(doc => 
      doc.visible && 
      (doc.associatedTo.client === clientName || !doc.associatedTo.client)
    );
  }

  // Limpeza automática de documentos expirados
  cleanupExpiredDocuments(): { removed: number; documents: string[] } {
    const now = new Date();
    const expiredDocs = this.documents.filter(doc => 
      doc.expiresAt && doc.expiresAt <= now
    );

    const removedTitles = expiredDocs.map(doc => doc.title);
    
    this.documents = this.documents.filter(doc => 
      !doc.expiresAt || doc.expiresAt > now
    );

    expiredDocs.forEach(doc => {
      documentPermissionService.logAction(
        doc.id,
        'system',
        'delete',
        `Documento "${doc.title}" removido automaticamente por expiração`
      );
    });

    return { removed: expiredDocs.length, documents: removedTitles };
  }

  // Verificar integridade dos arquivos
  async verifyDocumentIntegrity(): Promise<{ valid: number; invalid: string[] }> {
    const invalidDocs: string[] = [];
    let validCount = 0;

    for (const doc of this.documents) {
      if (doc.fileHash && doc.fileUrl) {
        // Simular verificação de integridade
        const isValid = Math.random() > 0.05; // 95% dos arquivos são válidos
        
        if (isValid) {
          validCount++;
          doc.checksumValidated = true;
        } else {
          invalidDocs.push(doc.title);
          doc.checksumValidated = false;
          
          documentPermissionService.logAction(
            doc.id,
            'system',
            'edit',
            `Falha na verificação de integridade do arquivo`
          );
        }
      }
    }

    return { valid: validCount, invalid: invalidDocs };
  }
}

export const enhancedDocumentService = new EnhancedDocumentService();
