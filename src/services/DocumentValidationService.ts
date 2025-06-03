
export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  validator: (file: File) => Promise<ValidationResult>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: Record<string, any>;
}

export interface DocumentMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  hash: string;
  uploadedAt: Date;
  uploadedBy: string;
  scanResults?: {
    isClean: boolean;
    threats: string[];
    scanDate: Date;
  };
}

class DocumentValidationService {
  private validationRules: ValidationRule[] = [
    {
      id: 'file_size',
      name: 'Tamanho do arquivo',
      description: 'Verifica se o arquivo não excede o limite permitido',
      validator: async (file: File) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const isValid = file.size <= maxSize;
        
        return {
          isValid,
          errors: isValid ? [] : [`Arquivo muito grande. Máximo permitido: ${this.formatFileSize(maxSize)}`],
          warnings: file.size > maxSize * 0.8 ? ['Arquivo próximo do limite de tamanho'] : [],
          metadata: { fileSize: file.size, maxSize }
        };
      }
    },
    {
      id: 'file_type',
      name: 'Tipo do arquivo',
      description: 'Verifica se o tipo do arquivo é permitido',
      validator: async (file: File) => {
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'image/jpeg',
          'image/png',
          'image/gif',
          'text/plain'
        ];

        const isValid = allowedTypes.includes(file.type);
        
        return {
          isValid,
          errors: isValid ? [] : [`Tipo de arquivo não permitido: ${file.type}`],
          warnings: [],
          metadata: { fileType: file.type, allowedTypes }
        };
      }
    },
    {
      id: 'file_name',
      name: 'Nome do arquivo',
      description: 'Verifica se o nome do arquivo é válido',
      validator: async (file: File) => {
        const invalidChars = /[<>:"/\\|?*]/;
        const hasInvalidChars = invalidChars.test(file.name);
        const isTooLong = file.name.length > 255;
        const isEmpty = file.name.trim().length === 0;

        const errors: string[] = [];
        if (hasInvalidChars) errors.push('Nome do arquivo contém caracteres inválidos');
        if (isTooLong) errors.push('Nome do arquivo muito longo (máximo 255 caracteres)');
        if (isEmpty) errors.push('Nome do arquivo não pode estar vazio');

        return {
          isValid: errors.length === 0,
          errors,
          warnings: file.name.length > 200 ? ['Nome do arquivo muito longo'] : [],
          metadata: { fileName: file.name, length: file.name.length }
        };
      }
    }
  ];

  // Validar arquivo completo
  async validateFile(file: File): Promise<ValidationResult> {
    const results = await Promise.all(
      this.validationRules.map(rule => rule.validator(file))
    );

    const allErrors = results.flatMap(r => r.errors);
    const allWarnings = results.flatMap(r => r.warnings);
    const metadata = results.reduce((acc, r) => ({ ...acc, ...r.metadata }), {});

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      metadata
    };
  }

  // Gerar hash do arquivo para verificação de integridade
  async generateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Extrair metadados do arquivo
  async extractMetadata(file: File, uploadedBy: string): Promise<DocumentMetadata> {
    const hash = await this.generateFileHash(file);
    
    return {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      hash,
      uploadedAt: new Date(),
      uploadedBy
    };
  }

  // Simular verificação de vírus/malware
  async scanForThreats(file: File): Promise<DocumentMetadata['scanResults']> {
    // Simular scan - em produção, integraria com serviço real
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isClean: true,
          threats: [],
          scanDate: new Date()
        });
      }, 1000);
    });
  }

  // Validar integridade do arquivo (verificar se não foi corrompido)
  async validateIntegrity(file: File, expectedHash: string): Promise<boolean> {
    const currentHash = await this.generateFileHash(file);
    return currentHash === expectedHash;
  }

  // Adicionar nova regra de validação
  addValidationRule(rule: ValidationRule): void {
    const existingIndex = this.validationRules.findIndex(r => r.id === rule.id);
    if (existingIndex >= 0) {
      this.validationRules[existingIndex] = rule;
    } else {
      this.validationRules.push(rule);
    }
  }

  // Remover regra de validação
  removeValidationRule(ruleId: string): void {
    this.validationRules = this.validationRules.filter(r => r.id !== ruleId);
  }

  // Obter todas as regras de validação
  getValidationRules(): ValidationRule[] {
    return [...this.validationRules];
  }

  // Formatar tamanho do arquivo
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const documentValidationService = new DocumentValidationService();
