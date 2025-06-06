
import { useState } from "react";
import { Shield, Plus, Eye, Edit, User, Clock, AlertTriangle } from "lucide-react";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminFilters } from "@/components/Admin/AdminFilters";
import { AdminTable } from "@/components/Admin/AdminTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateWarrantyModal } from "@/components/Warranty/CreateWarrantyModal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

// Mock data for warranties
const warranties = [
  {
    id: "1",
    title: "Infiltração no banheiro da suíte",
    property: "Edifício Aurora",
    unit: "204",
    client: "João Silva",
    category: "Hidráulica",
    priority: "high" as const,
    status: "pending" as const,
    createdAt: new Date(2025, 4, 15, 14, 30),
    technician: null
  },
  {
    id: "2", 
    title: "Problema na fechadura da porta principal",
    property: "Residencial Bosque Verde",
    unit: "301",
    client: "Maria Santos",
    category: "Esquadrias",
    priority: "medium" as const,
    status: "progress" as const,
    createdAt: new Date(2025, 4, 10, 9, 15),
    technician: "Carlos Andrade"
  },
  {
    id: "3",
    title: "Fissura na parede da sala",
    property: "Edifício Aurora",
    unit: "507",
    client: "Ana Costa",
    category: "Estrutural",
    priority: "critical" as const,
    status: "progress" as const,
    createdAt: new Date(2025, 4, 18, 16, 45),
    technician: "João Pereira"
  },
  {
    id: "4",
    title: "Porta do armário empenada",
    property: "Condomínio Monte Azul",
    unit: "102",
    client: "Roberto Lima",
    category: "Acabamentos",
    priority: "low" as const,
    status: "complete" as const,
    createdAt: new Date(2025, 4, 5, 11, 20),
    technician: "Luiza Mendes"
  }
];

const Warranty = () => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Calculate stats
  const stats = [
    { label: "Total", value: warranties.length, color: "text-slate-700" },
    { label: "Pendentes", value: warranties.filter(w => w.status === "pending").length, color: "text-amber-600" },
    { label: "Em Andamento", value: warranties.filter(w => w.status === "progress").length, color: "text-blue-600" },
    { label: "Concluídas", value: warranties.filter(w => w.status === "complete").length, color: "text-green-600" }
  ];

  // Filter data
  const filteredWarranties = warranties.filter(warranty => {
    const matchesSearch = !searchValue || 
      warranty.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      warranty.client.toLowerCase().includes(searchValue.toLowerCase()) ||
      warranty.property.toLowerCase().includes(searchValue.toLowerCase()) ||
      warranty.unit.includes(searchValue);
    
    const matchesStatus = statusFilter === "all" || warranty.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || warranty.priority === priorityFilter;
    const matchesCategory = categoryFilter === "all" || warranty.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleCreateWarranty = (data: any) => {
    console.log("Nova solicitação de garantia:", data);
    toast({
      title: "Solicitação criada",
      description: "A solicitação de garantia foi criada com sucesso.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados serão enviados para seu e-mail.",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", className: "bg-amber-100 text-amber-800 border-amber-200" },
      progress: { label: "Em Andamento", className: "bg-blue-100 text-blue-800 border-blue-200" },
      complete: { label: "Concluída", className: "bg-green-100 text-green-800 border-green-200" },
      canceled: { label: "Cancelada", className: "bg-gray-100 text-gray-800 border-gray-200" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "Baixa", className: "bg-green-100 text-green-800" },
      medium: { label: "Média", className: "bg-yellow-100 text-yellow-800" },
      high: { label: "Alta", className: "bg-orange-100 text-orange-800" },
      critical: { label: "Crítica", className: "bg-red-100 text-red-800" }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
  };

  const columns = [
    {
      key: "title",
      label: "Solicitação",
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-slate-900">{value}</div>
          <div className="text-sm text-slate-500 flex items-center gap-1">
            <User className="h-3 w-3" />
            {row.client} - {row.property} ({row.unit})
          </div>
        </div>
      )
    },
    {
      key: "category",
      label: "Categoria",
      render: (value: string) => (
        <Badge variant="outline" className="bg-slate-100 text-slate-700">
          {value}
        </Badge>
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
      key: "createdAt",
      label: "Criada em",
      render: (value: Date) => (
        <div>
          <div className="font-medium text-slate-900">
            {format(value, "dd/MM/yyyy")}
          </div>
          <div className="text-sm text-slate-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {format(value, "HH:mm")}
          </div>
        </div>
      )
    },
    {
      key: "technician",
      label: "Técnico",
      render: (value: string | null) => (
        <div className="font-medium text-slate-700">
          {value || <span className="text-slate-400">Não atribuído</span>}
        </div>
      )
    }
  ];

  const actions = [
    {
      label: "Visualizar",
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: any) => console.log("View", row)
    },
    {
      label: "Editar",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: any) => console.log("Edit", row)
    },
    {
      label: "Atribuir Técnico",
      icon: <User className="h-4 w-4" />,
      onClick: (row: any) => console.log("Assign technician", row)
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
      onClick={() => setIsCreateModalOpen(true)}
      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
    >
      <Plus className="mr-2 h-4 w-4" />
      Nova Solicitação
    </Button>
  );

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <AdminHeader
        title="Garantias"
        description="Gerenciamento completo de solicitações de garantia"
        icon={<Shield className="h-8 w-8 text-primary" />}
        actions={headerActions}
        stats={stats}
      />

      <AdminFilters
        searchPlaceholder="Buscar garantias por título, cliente ou empreendimento..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filters}
        onExport={handleExport}
        resultCount={filteredWarranties.length}
        activeFiltersCount={[statusFilter, priorityFilter, categoryFilter].filter(f => f !== "all").length}
        onClearFilters={() => {
          setStatusFilter("all");
          setPriorityFilter("all");
          setCategoryFilter("all");
          setSearchValue("");
        }}
      />

      <AdminTable
        columns={columns}
        data={filteredWarranties}
        actions={actions}
        emptyState={{
          icon: <Shield className="h-12 w-12 text-slate-400" />,
          title: "Nenhuma solicitação encontrada",
          description: "Não há solicitações de garantia que correspondam aos filtros aplicados.",
          action: (
            <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Criar primeira solicitação
            </Button>
          )
        }}
      />

      <CreateWarrantyModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateWarranty}
      />
    </div>
  );
};

export default Warranty;
