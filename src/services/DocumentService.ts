import { v4 as uuidv4 } from 'uuid';

export interface Document {
  id: string;
  title: string;
  type: "auto" | "manual";
  template?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  associatedTo: {
    client?: string;
    property?: string;
    unit?: string;
    phase?: string;
  };
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
  downloads: number;
  status: "draft" | "published" | "archived";
  tags?: string[];
}

export interface TemplateVariable {
  key: string;
  label: string;
  description: string;
}

class DocumentService {
  private documents: Document[] = [
    {
      id: "1",
      title: "Contrato de Compra e Venda",
      type: "auto",
      template: `CONTRATO DE COMPRA E VENDA

VENDEDOR: A2 Incorporadora LTDA
COMPRADOR: {{nome_cliente}}
IMÓVEL: {{endereco}}
EMPREENDIMENTO: {{empreendimento}}
VALOR: R$ {{valor}}
DATA: {{data}}

Este contrato estabelece as condições de venda do imóvel acima descrito.`,
      associatedTo: { client: "João Silva", property: "Edifício Aurora", unit: "101" },
      visible: true,
      createdAt: new Date(2025, 4, 10),
      updatedAt: new Date(2025, 4, 10),
      downloads: 5,
      status: "published",
      tags: ["contrato", "venda"]
    },
    {
      id: "2", 
      title: "Manual do Proprietário",
      type: "manual",
      fileUrl: "/docs/manual-proprietario.pdf",
      fileName: "manual-proprietario.pdf",
      fileSize: "850 KB",
      associatedTo: { property: "Edifício Aurora" },
      visible: true,
      createdAt: new Date(2025, 4, 12),
      updatedAt: new Date(2025, 4, 12),
      downloads: 12,
      status: "published",
      tags: ["manual", "proprietário"]
    },
    {
      id: "3",
      title: "Relatório de Vistoria",
      type: "auto",
      template: `RELATÓRIO DE VISTORIA

CLIENTE: {{nome_cliente}}
IMÓVEL: {{endereco}}
DATA DA VISTORIA: {{data_vistoria}}
RESPONSÁVEL: {{responsavel_vistoria}}

ITENS VERIFICADOS:
- Estado geral do imóvel: {{estado_geral}}
- Instalações elétricas: {{instalacoes_eletricas}}
- Instalações hidráulicas: {{instalacoes_hidraulicas}}

OBSERVAÇÕES: {{observacoes}}`,
      associatedTo: { client: "Maria Santos", property: "Residencial Bosque", unit: "205" },
      visible: true,
      createdAt: new Date(2025, 4, 15),
      updatedAt: new Date(2025, 4, 15),
      downloads: 3,
      status: "published",
      tags: ["vistoria", "relatório"]
    }
  ];

  private templateVariables: TemplateVariable[] = [
    { key: "nome_cliente", label: "Nome do Cliente", description: "Nome completo do cliente" },
    { key: "endereco", label: "Endereço", description: "Endereço completo do imóvel" },
    { key: "valor", label: "Valor", description: "Valor do imóvel" },
    { key: "data", label: "Data", description: "Data atual" },
    { key: "empreendimento", label: "Empreendimento", description: "Nome do empreendimento" },
    { key: "data_vistoria", label: "Data da Vistoria", description: "Data de realização da vistoria" },
    { key: "responsavel_vistoria", label: "Responsável Vistoria", description: "Nome do responsável pela vistoria" },
    { key: "estado_geral", label: "Estado Geral", description: "Estado geral do imóvel" },
    { key: "instalacoes_eletricas", label: "Instalações Elétricas", description: "Estado das instalações elétricas" },
    { key: "instalacoes_hidraulicas", label: "Instalações Hidráulicas", description: "Estado das instalações hidráulicas" },
    { key: "observacoes", label: "Observações", description: "Observações gerais" }
  ];

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

  createDocument(data: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'downloads'>): Document {
    const newDocument: Document = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      downloads: 0
    };
    
    this.documents.push(newDocument);
    console.log('DocumentService: Documento criado:', newDocument.title);
    return newDocument;
  }

  updateDocument(id: string, data: Partial<Document>): Document | null {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) return null;

    this.documents[index] = {
      ...this.documents[index],
      ...data,
      updatedAt: new Date()
    };

    console.log('DocumentService: Documento atualizado:', this.documents[index].title);
    return this.documents[index];
  }

  deleteDocument(id: string): boolean {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) return false;

    console.log('DocumentService: Documento excluído:', this.documents[index].title);
    this.documents.splice(index, 1);
    return true;
  }

  generateDocument(documentId: string, variables: Record<string, string>): string {
    const document = this.getDocumentById(documentId);
    if (!document || !document.template) {
      throw new Error('Documento ou template não encontrado');
    }

    let generatedContent = document.template;
    
    // Substituir variáveis no template
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      generatedContent = generatedContent.replace(regex, value);
    });

    // Incrementar contador de downloads
    this.updateDocument(documentId, { downloads: document.downloads + 1 });

    console.log('DocumentService: Documento gerado:', document.title);
    return generatedContent;
  }

  downloadDocument(documentId: string): void {
    const document = this.getDocumentById(documentId);
    if (!document) {
      throw new Error('Documento não encontrado');
    }

    // Incrementar contador de downloads
    this.updateDocument(documentId, { downloads: document.downloads + 1 });

    if (document.type === 'manual' && document.fileUrl) {
      // Simular download de arquivo usando window.document ao invés de document
      const link = window.document.createElement('a');
      link.href = document.fileUrl;
      link.download = document.fileName || document.title;
      link.click();
    }

    console.log('DocumentService: Download realizado:', document.title);
  }

  getTemplateVariables(): TemplateVariable[] {
    return this.templateVariables;
  }

  uploadFile(file: File): Promise<string> {
    return new Promise((resolve) => {
      // Simular upload de arquivo
      setTimeout(() => {
        const fileUrl = `/uploads/${file.name}`;
        console.log('DocumentService: Arquivo enviado:', file.name);
        resolve(fileUrl);
      }, 1000);
    });
  }
}

export const documentService = new DocumentService();
