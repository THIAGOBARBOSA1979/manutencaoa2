
import { useState } from "react";
import { ShieldCheck, Plus, Eye, Settings, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminFilters } from "@/components/Admin/AdminFilters";
import { AdminTable } from "@/components/Admin/AdminTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

// Enhanced mock data
const warrantyClaims = [
  {
    id: "1",
    title: "Infiltração no banheiro",
    property: "Residencial Bosque Verde",
    unit: "305",
    client: "Ana Santos",
    category: "Hidráulica",
    priority: "high",
    description: "Identificada infiltração na parede do box do banheiro social.",
    createdAt: new Date(2025, 4, 15),
    status: "critical" as const,
    technician: "Roberto Silva"
  },
  {
    id: "2",
    title: "Porta empenada",
    property: "Edifício Aurora",
    unit: "108",
    client: "João Mendes",
    category: "Esquadrias",
    priority: "medium",
    description: "A porta do quarto principal está empenada.",
    createdAt: new Date(2025, 4, 16),
    status: "progress" as const,
    technician: "Carlos Andrade"
  },
  {
    id: "3",
    title: "Rachaduras na parede",
    property: "Condomínio Monte Azul",
    unit: "205",
    client: "Paulo Soares",
    category: "Estrutural",
    priority: "low",
    description: "Surgiram rachaduras na parede da sala.",
    createdAt: new Date(2025, 4, 14),
    status: "pending" as const,
    technician: null
  },
  {
    id: "4",
    title: "Vazamento em tubulação",
    property: "Edifício Aurora",
    unit: "302",
    client: "Carla Ferreira",
    category: "Hidráulica",
    priority: "high",
    description: "Vazamento na tubulação embaixo da pia da cozinha.",
    createdAt: new Date(2025, 4, 17),
    status: "critical" as const,
    technician: "Luiza Mendes"
  },
  {
    id: "5",
    title: "Problema no piso laminado",
    property: "Residencial Bosque Verde",
    unit: "107",
    client: "Marcos Oliveira",
    category: "Acabamentos",
    priority: "low",
    description: "O piso laminado da sala está descolando.",
    createdAt: new Date(2025, 4, 13),
    status: "complete" as const,
    technician: "Ana Costa"
  }
];

const Warranty = () => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Calculate stats
  const stats = [
    { label: "Total", value: warrantyClaims.length, color: "text-slate-700" },
    { label: "Críticas", value: warrantyClaims.filter(w => w.status === "critical").length, color: "text-red-600" },
    { label: "Em Andamento", value: warrantyClaims.filter(w => w.status === "progress").length, color: "text-blue-600" },
    { label: "Concluídas", value: warrantyClaims.filter(w => w.status === "complete").length, color: "text-green-600" }
  ];

  // Filter data
  const filteredClaims = warrantyClaims.filter(claim => {
    const matchesSearch = !searchValue || 
      claim.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      claim.client.toLowerCase().includes(searchValue.toLowerCase()) ||
      claim.property.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
    const matchesProperty = propertyFilter === "all" || claim.property === propertyFilter;
    const matchesCategory = categoryFilter === "all" || claim.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || claim.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesProperty && matchesCategory && matchesPriority;
  });

  const handleExport = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados serão enviados para seu e-mail.",
    });
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
      high: { label: "Alta", className: "bg-orange-100 text-orange-800" }
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
          <div className="text-sm text-slate-500">{row.property} - Unidade {row.unit}</div>
          <div className="text-sm text-slate-400 mt-1">{row.category}</div>
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
      key: "technician",
      label: "Técnico",
      render: (value: string) => (
        <div className="font-medium text-slate-700">
          {value || <span className="text-slate-400">Não atribuído</span>}
        </div>
      )
    },
    {
      key: "createdAt",
      label: "Criado em",
      render: (value: Date) => (
        <div className="text-sm text-slate-600">
          {format(value, "dd/MM/yyyy", { locale: ptBR })}
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
      label: "Atender",
      icon: <Settings className="h-4 w-4" />,
      onClick: (row: any) => console.log("Service", row)
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
        { value: "complete", label: "Concluída" }
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
        { value: "high", label: "Alta" }
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
    <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
      <Plus className="mr-2 h-4 w-4" />
      Nova Solicitação
    </Button>
  );

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <AdminHeader
        title="Garantias"
        description="Gerenciamento de solicitações de garantia e assistência técnica"
        icon={<ShieldCheck className="h-8 w-8 text-primary" />}
        actions={headerActions}
        stats={stats}
      />

      <AdminFilters
        searchPlaceholder="Buscar garantias por título, cliente ou empreendimento..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filters}
        onExport={handleExport}
        resultCount={filteredClaims.length}
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
        data={filteredClaims}
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
  );
};

export default Warranty;
