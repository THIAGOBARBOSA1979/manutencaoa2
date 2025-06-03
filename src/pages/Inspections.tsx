
import { useState } from "react";
import { ClipboardCheck, Plus, Eye, Edit, Calendar, User, MapPin } from "lucide-react";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminFilters } from "@/components/Admin/AdminFilters";
import { AdminTable } from "@/components/Admin/AdminTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

// Enhanced mock data
const inspections = [
  {
    id: "1",
    property: "Edifício Aurora",
    unit: "507",
    client: "Carlos Silva",
    inspector: "João Pereira",
    scheduledDate: new Date(2025, 4, 19, 10, 0),
    status: "pending" as const,
    type: "pre-delivery",
    priority: "normal"
  },
  {
    id: "2",
    property: "Edifício Aurora", 
    unit: "204",
    client: "Maria Oliveira",
    inspector: "Ana Costa",
    scheduledDate: new Date(2025, 4, 19, 14, 30),
    status: "progress" as const,
    type: "delivery",
    priority: "high"
  },
  {
    id: "3",
    property: "Residencial Bosque Verde",
    unit: "102",
    client: "Roberto Santos",
    inspector: "Carlos Andrade",
    scheduledDate: new Date(2025, 4, 18, 9, 0),
    status: "complete" as const,
    type: "maintenance",
    priority: "normal"
  },
  {
    id: "4",
    property: "Condomínio Monte Azul",
    unit: "305",
    client: "Fernanda Lima",
    inspector: "Luiza Mendes",
    scheduledDate: new Date(2025, 4, 20, 16, 0),
    status: "pending" as const,
    type: "pre-delivery",
    priority: "low"
  }
];

const Inspections = () => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Calculate stats
  const stats = [
    { label: "Total", value: inspections.length, color: "text-slate-700" },
    { label: "Pendentes", value: inspections.filter(i => i.status === "pending").length, color: "text-amber-600" },
    { label: "Em Andamento", value: inspections.filter(i => i.status === "progress").length, color: "text-blue-600" },
    { label: "Concluídas", value: inspections.filter(i => i.status === "complete").length, color: "text-green-600" }
  ];

  // Filter data
  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = !searchValue || 
      inspection.client.toLowerCase().includes(searchValue.toLowerCase()) ||
      inspection.property.toLowerCase().includes(searchValue.toLowerCase()) ||
      inspection.unit.includes(searchValue);
    
    const matchesStatus = statusFilter === "all" || inspection.status === statusFilter;
    const matchesProperty = propertyFilter === "all" || inspection.property === propertyFilter;
    const matchesType = typeFilter === "all" || inspection.type === typeFilter;

    return matchesSearch && matchesStatus && matchesProperty && matchesType;
  });

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
      complete: { label: "Concluída", className: "bg-green-100 text-green-800 border-green-200" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      "pre-delivery": { label: "Pré-entrega", className: "bg-purple-100 text-purple-800" },
      "delivery": { label: "Entrega", className: "bg-indigo-100 text-indigo-800" },
      "maintenance": { label: "Manutenção", className: "bg-orange-100 text-orange-800" }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
  };

  const columns = [
    {
      key: "property",
      label: "Imóvel",
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-slate-900 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            {value}
          </div>
          <div className="text-sm text-slate-500">Unidade {row.unit}</div>
        </div>
      )
    },
    {
      key: "client",
      label: "Cliente",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-400" />
          <span className="font-medium text-slate-700">{value}</span>
        </div>
      )
    },
    {
      key: "scheduledDate",
      label: "Data/Hora",
      render: (value: Date) => (
        <div>
          <div className="font-medium text-slate-900">
            {format(value, "dd 'de' MMMM", { locale: ptBR })}
          </div>
          <div className="text-sm text-slate-500 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(value, "HH:mm")}
          </div>
        </div>
      )
    },
    {
      key: "type",
      label: "Tipo",
      render: (value: string) => getTypeBadge(value)
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: "inspector",
      label: "Inspetor",
      render: (value: string) => (
        <div className="font-medium text-slate-700">{value}</div>
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
      label: "Reagendar",
      icon: <Calendar className="h-4 w-4" />,
      onClick: (row: any) => console.log("Reschedule", row)
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
        { value: "complete", label: "Concluída" }
      ]
    },
    {
      key: "property",
      label: "Empreendimento",
      value: propertyFilter,
      onChange: setPropertyFilter,
      options: [
        { value: "all", label: "Todos os empreendimentos" },
        { value: "Edifício Aurora", label: "Edifício Aurora" },
        { value: "Residencial Bosque Verde", label: "Residencial Bosque Verde" },
        { value: "Condomínio Monte Azul", label: "Condomínio Monte Azul" }
      ]
    },
    {
      key: "type",
      label: "Tipo",
      value: typeFilter,
      onChange: setTypeFilter,
      options: [
        { value: "all", label: "Todos os tipos" },
        { value: "pre-delivery", label: "Pré-entrega" },
        { value: "delivery", label: "Entrega" },
        { value: "maintenance", label: "Manutenção" }
      ]
    }
  ];

  const headerActions = (
    <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
      <Plus className="mr-2 h-4 w-4" />
      Nova Vistoria
    </Button>
  );

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <AdminHeader
        title="Vistorias"
        description="Gerenciamento completo de vistorias e inspeções"
        icon={<ClipboardCheck className="h-8 w-8 text-primary" />}
        actions={headerActions}
        stats={stats}
      />

      <AdminFilters
        searchPlaceholder="Buscar vistorias por cliente, empreendimento ou unidade..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filters}
        onExport={handleExport}
        resultCount={filteredInspections.length}
        activeFiltersCount={[statusFilter, propertyFilter, typeFilter].filter(f => f !== "all").length}
        onClearFilters={() => {
          setStatusFilter("all");
          setPropertyFilter("all");
          setTypeFilter("all");
          setSearchValue("");
        }}
      />

      <AdminTable
        columns={columns}
        data={filteredInspections}
        actions={actions}
        emptyState={{
          icon: <ClipboardCheck className="h-12 w-12 text-slate-400" />,
          title: "Nenhuma vistoria encontrada",
          description: "Não há vistorias que correspondam aos filtros aplicados.",
          action: (
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Agendar primeira vistoria
            </Button>
          )
        }}
      />
    </div>
  );
};

export default Inspections;
