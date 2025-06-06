import { useState, useEffect } from "react";
import { ShieldCheck, Plus, Eye, Settings, AlertTriangle, Clock, CheckCircle, FileText } from "lucide-react";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminFilters } from "@/components/Admin/AdminFilters";
import { AdminTable } from "@/components/Admin/AdminTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { warrantyService } from "@/services/WarrantyService";
import { warrantyBusinessRules, WarrantyRequest, UserRole } from "@/services/WarrantyBusinessRules";
import { WarrantyDetailModal } from "@/components/Warranty/WarrantyDetailModal";
import { TechnicianAssignmentModal } from "@/components/Warranty/TechnicianAssignmentModal";
import { CreateWarrantyModal } from "@/components/Warranty/CreateWarrantyModal";

const Warranty = () => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [warranties, setWarranties] = useState<WarrantyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [warrantyToAssign, setWarrantyToAssign] = useState<WarrantyRequest | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Simulando usuário admin
  const currentUserId = "admin-001";
  const currentUserRole: UserRole = "admin";

  useEffect(() => {
    loadWarranties();
  }, []);

  const loadWarranties = async () => {
    try {
      setLoading(true);
      const userWarranties = warrantyService.getWarrantiesByUser(currentUserId, currentUserRole);
      setWarranties(userWarranties);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as garantias.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas usando as regras de negócio
  const metrics = warrantyService.getWarrantyMetrics(currentUserId, currentUserRole);
  const overdueWarranties = warrantyService.getOverdueWarranties(currentUserId, currentUserRole);

  const stats = [
    { label: "Total", value: metrics.totalRequests, color: "text-slate-700" },
    { label: "Críticas", value: metrics.byStatus.critical, color: "text-red-600" },
    { label: "Em Andamento", value: metrics.byStatus.progress, color: "text-blue-600" },
    { label: "Concluídas", value: metrics.byStatus.complete, color: "text-green-600" },
    { label: "Em Atraso", value: overdueWarranties.length, color: "text-orange-600" }
  ];

  // Filtrar dados
  const filteredWarranties = warranties.filter(warranty => {
    const matchesSearch = !searchValue || 
      warranty.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      warranty.client.toLowerCase().includes(searchValue.toLowerCase()) ||
      warranty.property.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || warranty.status === statusFilter;
    const matchesProperty = propertyFilter === "all" || warranty.property === propertyFilter;
    const matchesCategory = categoryFilter === "all" || warranty.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || warranty.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesProperty && matchesCategory && matchesPriority;
  });

  const handleExport = async () => {
    try {
      const result = await warrantyService.exportWarranties(currentUserId, currentUserRole, {
        status: statusFilter !== "all" ? statusFilter as any : undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined
      });

      if (result.success) {
        toast({
          title: "Exportação concluída",
          description: `${result.data?.length} registros exportados com sucesso.`,
        });
        console.log("Dados exportados:", result.data);
      } else {
        throw new Error(result.errors?.[0] || "Erro na exportação");
      }
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleViewWarranty = (warranty: WarrantyRequest) => {
    const permissions = warrantyBusinessRules.getWarrantyPermissions(currentUserRole, warranty.createdBy === currentUserId);
    
    if (!permissions.canView) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para visualizar esta garantia.",
        variant: "destructive",
      });
      return;
    }

    setSelectedWarranty(warranty);
    setShowDetailModal(true);
  };

  const handleAssignTechnician = async (warranty: WarrantyRequest) => {
    setWarrantyToAssign(warranty);
    setShowAssignmentModal(true);
  };

  const handleTechnicianAssignment = async (warrantyId: string, technicianId: string, notes?: string) => {
    try {
      const result = await warrantyService.assignTechnician(
        warrantyId,
        technicianId,
        currentUserId,
        currentUserRole
      );

      if (result.success) {
        toast({
          title: "Técnico atribuído",
          description: `Garantia atribuída ao técnico com sucesso.`,
        });
        loadWarranties();
        setShowAssignmentModal(false);
        setWarrantyToAssign(null);
      } else {
        throw new Error(result.errors?.[0] || "Erro na atribuição");
      }
    } catch (error) {
      toast({
        title: "Erro na atribuição",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (warranty: WarrantyRequest, newStatus: string) => {
    try {
      const result = await warrantyService.updateWarranty(
        warranty.id,
        { status: newStatus as any },
        currentUserId,
        currentUserRole
      );

      if (result.success) {
        toast({
          title: "Status atualizado",
          description: `Status da garantia atualizado para ${
            newStatus === 'complete' ? 'concluída' :
            newStatus === 'progress' ? 'em andamento' : newStatus
          }.`,
        });
        loadWarranties();
        setShowDetailModal(false);
      } else {
        throw new Error(result.errors?.[0] || "Erro na atualização");
      }
    } catch (error) {
      toast({
        title: "Erro na atualização",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleCreateWarranty = (data: any) => {
    console.log("Criando nova garantia:", data);
    // Aqui seria chamado o serviço para criar a garantia
    toast({
      title: "Garantia criada",
      description: "Nova solicitação de garantia criada com sucesso.",
    });
    loadWarranties();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { 
        label: "Pendente", 
        className: "bg-amber-100 text-amber-800 border-amber-200",
        icon: <Clock className="h-3 w-3" />
      },
      progress: { 
        label: "Em Andamento", 
        className: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <Settings className="h-3 w-3 animate-spin" />
      },
      critical: { 
        label: "Crítica", 
        className: "bg-red-100 text-red-800 border-red-200",
        icon: <AlertTriangle className="h-3 w-3" />
      },
      complete: { 
        label: "Concluída", 
        className: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="h-3 w-3" />
      },
      canceled: { 
        label: "Cancelada", 
        className: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <CheckCircle className="h-3 w-3" />
      }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={config.className}>
        <span className="flex items-center gap-1">
          {config.icon}
          {config.label}
        </span>
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "Baixa", className: "bg-gray-100 text-gray-800" },
      medium: { label: "Média", className: "bg-yellow-100 text-yellow-800" },
      high: { label: "Alta", className: "bg-orange-100 text-orange-800" },
      critical: { label: "Crítica", className: "bg-red-100 text-red-800" }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
  };

  const isOverdue = (warranty: WarrantyRequest): boolean => {
    return overdueWarranties.some(overdue => overdue.id === warranty.id);
  };

  const columns = [
    {
      key: "title",
      label: "Solicitação",
      render: (value: string, row: WarrantyRequest) => (
        <div>
          <div className="font-medium text-slate-900 flex items-center gap-2">
            {value}
            {isOverdue(row) && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <Clock className="h-3 w-3 mr-1" />
                Atrasada
              </Badge>
            )}
          </div>
          <div className="text-sm text-slate-500">{row.property} - Unidade {row.unit}</div>
          <div className="text-sm text-slate-400 mt-1">{row.category}</div>
          {row.estimatedResolutionTime && (
            <div className="text-xs text-slate-400">
              Prazo estimado: {row.estimatedResolutionTime}h
            </div>
          )}
        </div>
      )
    },
    {
      key: "client",
      label: "Cliente",
      render: (value: string) => (
        <div className="font-medium text-slate-700">{value}</div>
      )
    },
    {
      key: "priority",
      label: "Prioridade",
      render: (value: string) => getPriorityBadge(value)
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: "assignedTo",
      label: "Técnico",
      render: (value: string | undefined) => (
        <div className="font-medium text-slate-700">
          {value || <span className="text-slate-400">Não atribuído</span>}
        </div>
      )
    },
    {
      key: "createdAt",
      label: "Criado em",
      render: (value: Date, row: WarrantyRequest) => (
        <div className="text-sm">
          <div className="text-slate-600">
            {format(value, "dd/MM/yyyy", { locale: ptBR })}
          </div>
          {row.actualResolutionTime && (
            <div className="text-xs text-green-600">
              Resolvido em {row.actualResolutionTime}h
            </div>
          )}
          {row.satisfactionRating && (
            <div className="text-xs text-yellow-600">
              ★ {row.satisfactionRating}/5
            </div>
          )}
        </div>
      )
    }
  ];

  const actions = [
    {
      label: "Visualizar",
      icon: <Eye className="h-4 w-4" />,
      onClick: handleViewWarranty
    },
    {
      label: "Atribuir",
      icon: <Settings className="h-4 w-4" />,
      onClick: handleAssignTechnician,
      condition: (row: WarrantyRequest) => !row.assignedTo && row.status === 'pending'
    }
  ];

  const filters = [
    {
      key: "status",
      label: "Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "all", label: "Todos os status" },
        { value: "pending", label: "Pendente" },
        { value: "progress", label: "Em andamento" },
        { value: "critical", label: "Crítica" },
        { value: "complete", label: "Concluída" },
        { value: "canceled", label: "Cancelada" }
      ]
    },
    {
      key: "priority",
      label: "Prioridade",
      value: priorityFilter,
      onChange: setPriorityFilter,
      options: [
        { value: "all", label: "Todas as prioridades" },
        { value: "low", label: "Baixa" },
        { value: "medium", label: "Média" },
        { value: "high", label: "Alta" },
        { value: "critical", label: "Crítica" }
      ]
    },
    {
      key: "category",
      label: "Categoria",
      value: categoryFilter,
      onChange: setCategoryFilter,
      options: [
        { value: "all", label: "Todas as categorias" },
        { value: "Hidráulica", label: "Hidráulica" },
        { value: "Elétrica", label: "Elétrica" },
        { value: "Estrutural", label: "Estrutural" },
        { value: "Esquadrias", label: "Esquadrias" },
        { value: "Acabamentos", label: "Acabamentos" }
      ]
    }
  ];

  const headerActions = (
    <Button 
      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
      onClick={() => setShowCreateModal(true)}
    >
      <Plus className="mr-2 h-4 w-4" />
      Nova Solicitação
    </Button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ShieldCheck className="h-12 w-12 mx-auto text-primary animate-pulse" />
          <p className="mt-2 text-muted-foreground">Carregando garantias...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 p-8 max-w-7xl mx-auto">
        <AdminHeader
          title="Garantias"
          description="Gerenciamento de solicitações de garantia e assistência técnica com regras de negócio otimizadas"
          icon={<ShieldCheck className="h-8 w-8 text-primary" />}
          actions={headerActions}
          stats={stats}
        />

        {/* Métricas adicionais */}
        {metrics.averageResolutionTime > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Indicadores de Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(metrics.averageResolutionTime)}h
                </div>
                <div className="text-sm text-muted-foreground">Tempo médio de resolução</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {metrics.satisfactionAverage > 0 ? metrics.satisfactionAverage.toFixed(1) : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Satisfação média</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {metrics.overdueRequests}
                </div>
                <div className="text-sm text-muted-foreground">Solicitações em atraso</div>
              </div>
            </div>
          </div>
        )}

        <AdminFilters
          searchPlaceholder="Buscar garantias por título, cliente ou empreendimento..."
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filters}
          onExport={handleExport}
          resultCount={filteredWarranties.length}
          activeFiltersCount={[statusFilter, propertyFilter, categoryFilter, priorityFilter].filter(f => f !== "all").length}
          onClearFilters={() => {
            setStatusFilter("all");
            setPropertyFilter("all");
            setCategoryFilter("all");
            setPriorityFilter("all");
            setSearchValue("");
          }}
        />

        <AdminTable
          columns={columns}
          data={filteredWarranties}
          actions={actions}
          emptyState={{
            icon: <ShieldCheck className="h-12 w-12 text-slate-400" />,
            title: "Nenhuma garantia encontrada",
            description: "Não há solicitações de garantia que correspondam aos filtros aplicados.",
            action: (
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Criar primeira solicitação
              </Button>
            )
          }}
        />
      </div>

      <WarrantyDetailModal
        warranty={selectedWarranty}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        onAssignTechnician={handleAssignTechnician}
        onUpdateStatus={handleUpdateStatus}
      />

      <TechnicianAssignmentModal
        warranty={warrantyToAssign}
        open={showAssignmentModal}
        onOpenChange={setShowAssignmentModal}
        onAssign={handleTechnicianAssignment}
      />

      <CreateWarrantyModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreateWarranty}
      />
    </>
  );
};

export default Warranty;
