
// Serviço para compartilhar dados entre painel admin e cliente
export interface Property {
  id: string;
  name: string;
  location: string;
  units: number;
  completedUnits: number;
  status: 'pending' | 'progress' | 'complete';
  createdAt: string;
  manager: string;
}

export interface Inspection {
  id: string;
  title: string;
  property: string;
  unit: string;
  client: string;
  inspector: string;
  scheduledDate: Date;
  status: 'pending' | 'progress' | 'complete';
  type: 'pre-delivery' | 'delivery' | 'maintenance';
  priority: 'low' | 'normal' | 'high';
  description?: string;
  checklist?: Array<{ id: string; name: string; completed: boolean }>;
  canStart?: boolean;
  report?: string;
}

export interface WarrantyRequest {
  id: string;
  title: string;
  description: string;
  property: string;
  unit: string;
  client: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: Date;
  technician?: string;
  estimatedCompletion?: Date;
}

export interface Document {
  id: string;
  title: string;
  type: string;
  property: string;
  unit?: string;
  client: string;
  uploadDate: Date;
  status: 'available' | 'pending' | 'expired';
  size: string;
  url?: string;
}

// Mock data compartilhado
export const mockProperties: Property[] = [
  {
    id: "1",
    name: "Edifício Aurora",
    location: "São Paulo, SP",
    units: 120,
    completedUnits: 85,
    status: "progress",
    createdAt: "2024-01-15",
    manager: "Carlos Silva"
  },
  {
    id: "2",
    name: "Residencial Bosque Verde",
    location: "Rio de Janeiro, RJ",
    units: 75,
    completedUnits: 75,
    status: "complete",
    createdAt: "2024-02-10",
    manager: "Maria Oliveira"
  }
];

export const mockInspections: Inspection[] = [
  {
    id: "1",
    title: "Vistoria de Pré-entrega",
    property: "Edifício Aurora",
    unit: "204",
    client: "Maria Oliveira",
    inspector: "Carlos Andrade",
    scheduledDate: new Date(2025, 4, 15, 10, 0),
    status: "pending",
    type: "pre-delivery",
    priority: "normal",
    description: "Vistoria para verificação das condições da unidade antes da entrega oficial.",
    checklist: [
      { id: "1", name: "Verificação de paredes e pinturas", completed: false },
      { id: "2", name: "Teste de instalações elétricas", completed: false },
      { id: "3", name: "Teste de instalações hidráulicas", completed: false },
      { id: "4", name: "Verificação de esquadrias e vidros", completed: false },
      { id: "5", name: "Verificação de pisos e revestimentos", completed: false },
    ],
    canStart: true
  },
  {
    id: "2",
    title: "Entrega de Chaves",
    property: "Edifício Aurora",
    unit: "204",
    client: "Maria Oliveira",
    inspector: "Luiza Mendes",
    scheduledDate: new Date(2025, 4, 20, 14, 30),
    status: "pending",
    type: "delivery",
    priority: "high",
    description: "Vistoria final e entrega oficial das chaves do imóvel.",
    checklist: [
      { id: "1", name: "Verificação final de acabamentos", completed: false },
      { id: "2", name: "Conferência de documentação", completed: false },
      { id: "3", name: "Demonstração de funcionamento de equipamentos", completed: false },
      { id: "4", name: "Entrega de manuais e garantias", completed: false },
      { id: "5", name: "Assinatura de termo de recebimento", completed: false },
    ],
    canStart: false
  }
];

export const mockWarrantyRequests: WarrantyRequest[] = [
  {
    id: "1",
    title: "Reparo na torneira do banheiro",
    description: "Torneira do banheiro social apresenta vazamento constante",
    property: "Edifício Aurora",
    unit: "204",
    client: "Maria Oliveira",
    status: "in_progress",
    priority: "medium",
    category: "Hidráulica",
    createdAt: new Date(2025, 3, 10),
    technician: "João Técnico",
    estimatedCompletion: new Date(2025, 4, 25)
  },
  {
    id: "2",
    title: "Ajuste na porta da cozinha",
    description: "Porta da cozinha não fecha corretamente",
    property: "Edifício Aurora",
    unit: "204",
    client: "Maria Oliveira",
    status: "resolved",
    priority: "low",
    category: "Marcenaria",
    createdAt: new Date(2025, 3, 5),
    technician: "Pedro Marceneiro"
  }
];

export const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Contrato de Compra e Venda",
    type: "Contrato",
    property: "Edifício Aurora",
    unit: "204",
    client: "Maria Oliveira",
    uploadDate: new Date(2025, 3, 15),
    status: "available",
    size: "2.5 MB",
    url: "/documents/contrato.pdf"
  },
  {
    id: "2",
    title: "Manual do Proprietário",
    type: "Manual",
    property: "Edifício Aurora",
    unit: "204",
    client: "Maria Oliveira",
    uploadDate: new Date(2025, 3, 20),
    status: "available",
    size: "5.2 MB",
    url: "/documents/manual.pdf"
  },
  {
    id: "3",
    title: "Relatório de Vistoria",
    type: "Relatório",
    property: "Edifício Aurora",
    unit: "204",
    client: "Maria Oliveira",
    uploadDate: new Date(2025, 4, 10),
    status: "available",
    size: "1.8 MB",
    url: "/documents/vistoria.pdf"
  }
];

// Funções para filtrar dados por cliente
export const getClientInspections = (clientName: string): Inspection[] => {
  return mockInspections.filter(inspection => inspection.client === clientName);
};

export const getClientWarrantyRequests = (clientName: string): WarrantyRequest[] => {
  return mockWarrantyRequests.filter(request => request.client === clientName);
};

export const getClientDocuments = (clientName: string): Document[] => {
  return mockDocuments.filter(document => document.client === clientName);
};

export const getClientProperty = (clientName: string): Property | null => {
  // Por simplicidade, assumindo que o cliente tem uma propriedade principal
  if (clientName === "Maria Oliveira") {
    return mockProperties.find(p => p.name === "Edifício Aurora") || null;
  }
  return mockProperties[0] || null;
};

console.log('SharedDataService: Serviço de dados compartilhados inicializado');
