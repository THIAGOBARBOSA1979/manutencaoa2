
export interface Property {
  id: string;
  name: string;
  unit?: string;
  address: string;
  city: string;
  state: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  deliveryDate: string;
  warrantyExpiration: string;
  status: "delivered" | "progress" | "pending";
  rating: number;
  completionPercentage: number;
  clientId: string;
  clientName: string;
}

export interface PropertyDocument {
  id: string;
  title: string;
  type: "manual" | "warranty" | "blueprint" | "contract" | "inspection" | "certificate";
  category: "contrato" | "manual" | "relatorio" | "certificado" | "outros";
  size: string;
  lastModified: string;
  isNew: boolean;
  propertyId: string;
  unitId?: string;
  downloadUrl: string;
  description?: string;
  tags?: string[];
  priority: "low" | "medium" | "high";
}

class PropertyService {
  private properties: Property[] = [
    {
      id: "1",
      name: "Edifício Aurora",
      unit: "204",
      address: "Rua das Flores, 1500, Centro",
      city: "São Paulo",
      state: "SP",
      size: "72m²",
      bedrooms: 2,
      bathrooms: 2,
      deliveryDate: "15/04/2025",
      warrantyExpiration: "15/04/2030",
      status: "delivered",
      rating: 4.8,
      completionPercentage: 100,
      clientId: "client-1",
      clientName: "João Silva"
    },
    {
      id: "2", 
      name: "Residencial Bosque Verde",
      unit: "301",
      address: "Av. das Palmeiras, 2500, Zona Sul",
      city: "Rio de Janeiro",
      state: "RJ",
      size: "85m²",
      bedrooms: 3,
      bathrooms: 2,
      deliveryDate: "20/06/2025",
      warrantyExpiration: "20/06/2030",
      status: "progress",
      rating: 4.5,
      completionPercentage: 78,
      clientId: "client-2",
      clientName: "Maria Santos"
    }
  ];

  private propertyDocuments: PropertyDocument[] = [
    {
      id: "prop-doc-1",
      title: "Manual do Proprietário - Edifício Aurora",
      type: "manual",
      category: "manual",
      size: "2.4 MB",
      lastModified: "20/05/2025",
      isNew: true,
      propertyId: "1",
      unitId: "204",
      downloadUrl: "/docs/manual-aurora-204.pdf",
      description: "Manual específico para a unidade 204 do Edifício Aurora",
      tags: ["manual", "proprietário", "aurora"],
      priority: "high"
    },
    {
      id: "prop-doc-2",
      title: "Termo de Garantia - Unidade 204",
      type: "warranty",
      category: "certificado",
      size: "1.8 MB",
      lastModified: "15/04/2025",
      isNew: false,
      propertyId: "1",
      unitId: "204",
      downloadUrl: "/docs/garantia-aurora-204.pdf",
      description: "Documento de garantia específico da unidade",
      tags: ["garantia", "certificado"],
      priority: "high"
    },
    {
      id: "prop-doc-3",
      title: "Planta Baixa - Apartamento 204",
      type: "blueprint",
      category: "outros",
      size: "5.2 MB",
      lastModified: "10/04/2025",
      isNew: false,
      propertyId: "1",
      unitId: "204",
      downloadUrl: "/docs/planta-aurora-204.pdf",
      description: "Planta baixa detalhada do apartamento",
      tags: ["planta", "blueprint", "layout"],
      priority: "medium"
    },
    {
      id: "prop-doc-4",
      title: "Contrato de Compra - João Silva",
      type: "contract",
      category: "contrato",
      size: "3.1 MB",
      lastModified: "01/03/2024",
      isNew: false,
      propertyId: "1",
      unitId: "204",
      downloadUrl: "/docs/contrato-aurora-204.pdf",
      description: "Contrato de compra e venda da unidade",
      tags: ["contrato", "compra", "venda"],
      priority: "high"
    },
    {
      id: "prop-doc-5",
      title: "Relatório de Vistoria - Entrega",
      type: "inspection",
      category: "relatorio",
      size: "4.5 MB",
      lastModified: "12/04/2025",
      isNew: true,
      propertyId: "1",
      unitId: "204",
      downloadUrl: "/docs/vistoria-aurora-204.pdf",
      description: "Relatório de vistoria de entrega da unidade",
      tags: ["vistoria", "entrega", "relatório"],
      priority: "medium"
    },
    {
      id: "prop-doc-6",
      title: "Certificado de Habite-se",
      type: "certificate",
      category: "certificado",
      size: "1.2 MB",
      lastModified: "05/04/2025",
      isNew: false,
      propertyId: "1",
      downloadUrl: "/docs/habite-se-aurora.pdf",
      description: "Certificado de habite-se do empreendimento",
      tags: ["habite-se", "certificado", "legal"],
      priority: "high"
    }
  ];

  getPropertiesByClient(clientId: string): Property[] {
    return this.properties.filter(prop => prop.clientId === clientId);
  }

  getPropertyById(propertyId: string): Property | undefined {
    return this.properties.find(prop => prop.id === propertyId);
  }

  getDocumentsByProperty(propertyId: string): PropertyDocument[] {
    return this.propertyDocuments.filter(doc => doc.propertyId === propertyId);
  }

  getDocumentsByPropertyAndUnit(propertyId: string, unitId?: string): PropertyDocument[] {
    return this.propertyDocuments.filter(doc => 
      doc.propertyId === propertyId && 
      (unitId ? doc.unitId === unitId : true)
    );
  }

  getAllPropertyDocuments(): PropertyDocument[] {
    return this.propertyDocuments;
  }

  getDocumentsByClient(clientName: string): PropertyDocument[] {
    const clientProperties = this.properties.filter(prop => prop.clientName === clientName);
    const propertyIds = clientProperties.map(prop => prop.id);
    
    return this.propertyDocuments.filter(doc => propertyIds.includes(doc.propertyId));
  }

  getDocumentsByCategory(category: string): PropertyDocument[] {
    return this.propertyDocuments.filter(doc => doc.category === category);
  }

  getRecentDocuments(limit: number = 10): PropertyDocument[] {
    return this.propertyDocuments
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
      .slice(0, limit);
  }

  getNewDocuments(): PropertyDocument[] {
    return this.propertyDocuments.filter(doc => doc.isNew);
  }

  searchDocuments(query: string, filters?: {
    propertyId?: string;
    category?: string;
    type?: string;
    priority?: string;
  }): PropertyDocument[] {
    let filtered = this.propertyDocuments;

    // Text search
    if (query) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery) ||
        doc.description?.toLowerCase().includes(searchQuery) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    }

    // Apply filters
    if (filters?.propertyId) {
      filtered = filtered.filter(doc => doc.propertyId === filters.propertyId);
    }
    
    if (filters?.category) {
      filtered = filtered.filter(doc => doc.category === filters.category);
    }
    
    if (filters?.type) {
      filtered = filtered.filter(doc => doc.type === filters.type);
    }
    
    if (filters?.priority) {
      filtered = filtered.filter(doc => doc.priority === filters.priority);
    }

    return filtered;
  }

  getDocumentStats(propertyId?: string) {
    const docs = propertyId ? this.getDocumentsByProperty(propertyId) : this.propertyDocuments;
    
    return {
      total: docs.length,
      new: docs.filter(d => d.isNew).length,
      byCategory: {
        contrato: docs.filter(d => d.category === 'contrato').length,
        manual: docs.filter(d => d.category === 'manual').length,
        relatorio: docs.filter(d => d.category === 'relatorio').length,
        certificado: docs.filter(d => d.category === 'certificado').length,
        outros: docs.filter(d => d.category === 'outros').length,
      },
      byType: {
        manual: docs.filter(d => d.type === 'manual').length,
        warranty: docs.filter(d => d.type === 'warranty').length,
        blueprint: docs.filter(d => d.type === 'blueprint').length,
        contract: docs.filter(d => d.type === 'contract').length,
        inspection: docs.filter(d => d.type === 'inspection').length,
        certificate: docs.filter(d => d.type === 'certificate').length,
      },
      byPriority: {
        high: docs.filter(d => d.priority === 'high').length,
        medium: docs.filter(d => d.priority === 'medium').length,
        low: docs.filter(d => d.priority === 'low').length,
      }
    };
  }

  downloadDocument(documentId: string): void {
    const document = this.propertyDocuments.find(doc => doc.id === documentId);
    if (!document) {
      throw new Error('Documento não encontrado');
    }

    // Simulate download
    const link = window.document.createElement('a');
    link.href = document.downloadUrl;
    link.download = document.title;
    link.click();

    console.log('PropertyService: Download realizado:', document.title);
  }
}

export const propertyService = new PropertyService();
