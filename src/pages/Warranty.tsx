import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WarrantyCard } from "@/components/Warranty/WarrantyCard";
import { WarrantyStats } from "@/components/Warranty/WarrantyStats";
import { WarrantyFilters } from "@/components/Warranty/WarrantyFilters";
import { CreateWarrantyModal } from "@/components/Warranty/CreateWarrantyModal";
import { WarrantyProblemsManager } from "@/components/Warranty/WarrantyProblemsManager";
import { ServiceExecutionProof, ServiceExecution } from "@/components/Warranty/ServiceExecutionProof";
import { 
  Plus, 
  Search, 
  Filter,
  FileText,
  Settings
} from "lucide-react";

interface WarrantyRequest {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'progress' | 'resolved' | 'canceled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  property: string;
  unit: string;
  client: string;
  createdAt: Date;
  updatedAt: Date;
}

const mockWarranties: WarrantyRequest[] = [
  {
    id: "1",
    title: "Vazamento na torneira do banheiro",
    description: "Torneira da pia do banheiro social está vazando constantemente",
    status: "pending",
    priority: "medium",
    category: "Hidráulica",
    property: "Residencial Vista Bela",
    unit: "Apt 301",
    client: "João Silva",
    createdAt: new Date(2024, 11, 1),
    updatedAt: new Date(2024, 11, 1)
  },
  {
    id: "2", 
    title: "Tomada sem energia na cozinha",
    description: "Tomada próxima à pia da cozinha não está funcionando",
    status: "progress",
    priority: "high",
    category: "Elétrica",
    property: "Residencial Vista Bela",
    unit: "Apt 205",
    client: "Maria Santos",
    createdAt: new Date(2024, 11, 3),
    updatedAt: new Date(2024, 11, 5)
  }
];

export default function Warranty() {
  const [warranties, setWarranties] = useState<WarrantyRequest[]>(mockWarranties);
  const [filteredWarranties, setFilteredWarranties] = useState<WarrantyRequest[]>(mockWarranties);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWarrantyId, setSelectedWarrantyId] = useState<string | null>(null);
  const [showProblemsManager, setShowProblemsManager] = useState(false);
  const [showExecutionProof, setShowExecutionProof] = useState(false);
  const [executions, setExecutions] = useState<ServiceExecution[]>([]);

  const selectedWarranty = warranties.find(w => w.id === selectedWarrantyId);

  // Calculate stats from warranties
  const stats = {
    critical: warranties.filter(w => w.priority === 'critical').length,
    pending: warranties.filter(w => w.status === 'pending').length,
    progress: warranties.filter(w => w.status === 'progress').length,
    complete: warranties.filter(w => w.status === 'resolved').length,
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterWarranties(query, statusFilter, priorityFilter);
  };

  const filterWarranties = (search: string, status: string, priority: string) => {
    let filtered = warranties;

    if (search) {
      filtered = filtered.filter(w => 
        w.title.toLowerCase().includes(search.toLowerCase()) ||
        w.description.toLowerCase().includes(search.toLowerCase()) ||
        w.client.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      filtered = filtered.filter(w => w.status === status);
    }

    if (priority !== "all") {
      filtered = filtered.filter(w => w.priority === priority);
    }

    setFilteredWarranties(filtered);
  };

  const handleCreateWarranty = (warrantyData: any) => {
    const newWarranty: WarrantyRequest = {
      id: Date.now().toString(),
      ...warrantyData,
      status: 'pending' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setWarranties(prev => [...prev, newWarranty]);
    setFilteredWarranties(prev => [...prev, newWarranty]);
    setShowCreateModal(false);
  };

  const handleManageProblems = (warrantyId: string) => {
    setSelectedWarrantyId(warrantyId);
    setShowProblemsManager(true);
  };

  const handleManageExecution = (warrantyId: string) => {
    setSelectedWarrantyId(warrantyId);
    setShowExecutionProof(true);
  };

  const handleAddExecution = (execution: Omit<ServiceExecution, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExecution: ServiceExecution = {
      ...execution,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setExecutions(prev => [...prev, newExecution]);
  };

  const handleUpdateExecution = (executionId: string, updates: Partial<ServiceExecution>) => {
    setExecutions(prev => prev.map(exec => 
      exec.id === executionId 
        ? { ...exec, ...updates, updatedAt: new Date() }
        : exec
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Garantias</h1>
          <p className="text-muted-foreground">
            Gerencie solicitações de garantia e comprovações de execução
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Solicitação
        </Button>
      </div>

      <WarrantyStats stats={stats} />

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, descrição ou cliente..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              filterWarranties(searchQuery, value, priorityFilter);
            }}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="progress">Em andamento</SelectItem>
                <SelectItem value="resolved">Resolvido</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(value) => {
              setPriorityFilter(value);
              filterWarranties(searchQuery, statusFilter, value);
            }}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prioridades</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Garantias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWarranties.map((warranty) => (
          <Card key={warranty.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{warranty.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {warranty.property} - {warranty.unit}
                  </p>
                </div>
                <Badge variant={
                  warranty.status === 'pending' ? 'secondary' :
                  warranty.status === 'progress' ? 'default' :
                  warranty.status === 'resolved' ? 'default' : 'destructive'
                }>
                  {warranty.status === 'pending' ? 'Pendente' :
                   warranty.status === 'progress' ? 'Em andamento' :
                   warranty.status === 'resolved' ? 'Resolvido' : 'Cancelado'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{warranty.description}</p>
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Cliente: {warranty.client}</span>
                <span>Categoria: {warranty.category}</span>
              </div>
              
              <Badge variant="outline" className={
                warranty.priority === 'critical' ? 'border-red-500 text-red-700' :
                warranty.priority === 'high' ? 'border-orange-500 text-orange-700' :
                warranty.priority === 'medium' ? 'border-yellow-500 text-yellow-700' :
                'border-green-500 text-green-700'
              }>
                Prioridade: {warranty.priority === 'critical' ? 'Crítica' :
                           warranty.priority === 'high' ? 'Alta' :
                           warranty.priority === 'medium' ? 'Média' : 'Baixa'}
              </Badge>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleManageProblems(warranty.id)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Gerenciar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleManageExecution(warranty.id)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Execução
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWarranties.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma garantia encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all" || priorityFilter !== "all" 
                ? "Tente ajustar os filtros de busca"
                : "Crie a primeira solicitação de garantia"
              }
            </p>
            {!searchQuery && statusFilter === "all" && priorityFilter === "all" && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar primeira garantia
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modais */}
      <CreateWarrantyModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreateWarranty}
      />

      {selectedWarranty && (
        <>
          <WarrantyProblemsManager
            warrantyId={selectedWarranty.id}
            warrantyTitle={selectedWarranty.title}
            open={showProblemsManager}
            onOpenChange={setShowProblemsManager}
          />

          {showExecutionProof && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                      Comprovação de Execução - {selectedWarranty.title}
                    </h2>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowExecutionProof(false)}
                    >
                      Fechar
                    </Button>
                  </div>
                  
                  <ServiceExecutionProof
                    warrantyId={selectedWarranty.id}
                    executions={executions.filter(e => e.warrantyId === selectedWarranty.id)}
                    onAddExecution={handleAddExecution}
                    onUpdateExecution={handleUpdateExecution}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
