
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminFilters } from "@/components/Admin/AdminFilters";
import { AdminTable } from "@/components/Admin/AdminTable";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EnhancedPropertyForm } from "@/components/Properties/EnhancedPropertyForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Mock data
const properties = [
  {
    id: "1",
    name: "Edifício Aurora",
    location: "São Paulo, SP",
    units: 120,
    completedUnits: 85,
    status: "progress" as const,
    createdAt: "2024-01-15",
    manager: "Carlos Silva"
  },
  {
    id: "2",
    name: "Residencial Bosque Verde",
    location: "Rio de Janeiro, RJ",
    units: 75,
    completedUnits: 75,
    status: "complete" as const,
    createdAt: "2024-02-10",
    manager: "Maria Oliveira"
  },
  {
    id: "3",
    name: "Condomínio Monte Azul",
    location: "Belo Horizonte, MG",
    units: 50,
    completedUnits: 10,
    status: "pending" as const,
    createdAt: "2024-03-05",
    manager: "João Santos"
  },
  {
    id: "4",
    name: "Residencial Parque das Flores",
    location: "Curitiba, PR",
    units: 60,
    completedUnits: 60,
    status: "complete" as const,
    createdAt: "2024-01-20",
    manager: "Ana Costa"
  }
];

const Properties = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // Calculate stats
  const stats = [
    { label: "Total", value: properties.length, color: "text-slate-700" },
    { label: "Concluídos", value: properties.filter(p => p.status === "complete").length, color: "text-green-600" },
    { label: "Em Andamento", value: properties.filter(p => p.status === "progress").length, color: "text-blue-600" },
    { label: "Pendentes", value: properties.filter(p => p.status === "pending").length, color: "text-amber-600" }
  ];

  // Filter data
  const filteredProperties = properties.filter(property => {
    const matchesSearch = !searchValue || 
      property.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      property.location.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    const matchesLocation = locationFilter === "all" || property.location.includes(locationFilter);

    return matchesSearch && matchesStatus && matchesLocation;
  });

  const handlePropertySubmit = async (data: any) => {
    console.log("New property data:", data);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Sucesso!",
      description: "Empreendimento cadastrado com sucesso.",
    });
    
    setIsDialogOpen(false);
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
      complete: { label: "Concluído", className: "bg-green-100 text-green-800 border-green-200" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const getProgressBar = (completed: number, total: number) => {
    const percentage = (completed / total) * 100;
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>{completed}/{total} unidades</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    );
  };

  const columns = [
    {
      key: "name",
      label: "Empreendimento",
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-slate-900">{value}</div>
          <div className="text-sm text-slate-500">{row.location}</div>
        </div>
      )
    },
    {
      key: "progress",
      label: "Progresso",
      render: (_: any, row: any) => getProgressBar(row.completedUnits, row.units)
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: "manager",
      label: "Responsável",
      render: (value: string) => (
        <div className="font-medium text-slate-700">{value}</div>
      )
    },
    {
      key: "createdAt",
      label: "Criado em",
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
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
      label: "Excluir",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: any) => console.log("Delete", row),
      variant: "destructive" as const,
      separator: true
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
        { value: "complete", label: "Concluído" }
      ]
    },
    {
      key: "location",
      label: "Localização",
      value: locationFilter,
      onChange: setLocationFilter,
      options: [
        { value: "all", label: "Todas as cidades" },
        { value: "São Paulo", label: "São Paulo" },
        { value: "Rio de Janeiro", label: "Rio de Janeiro" },
        { value: "Belo Horizonte", label: "Belo Horizonte" },
        { value: "Curitiba", label: "Curitiba" }
      ]
    }
  ];

  const headerActions = (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            <Plus className="mr-2 h-4 w-4" />
            Novo Empreendimento
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Empreendimento</DialogTitle>
            <DialogDescription>
              Preencha todas as informações do novo empreendimento abaixo.
            </DialogDescription>
          </DialogHeader>
          <EnhancedPropertyForm 
            onSubmit={handlePropertySubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <AdminHeader
        title="Empreendimentos"
        description="Gerenciamento completo de todos os empreendimentos"
        icon={<Building className="h-8 w-8 text-primary" />}
        actions={headerActions}
        stats={stats}
      />

      <AdminFilters
        searchPlaceholder="Buscar empreendimentos..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filters}
        onExport={handleExport}
        resultCount={filteredProperties.length}
        activeFiltersCount={[statusFilter, locationFilter].filter(f => f !== "all").length}
        onClearFilters={() => {
          setStatusFilter("all");
          setLocationFilter("all");
          setSearchValue("");
        }}
      />

      <AdminTable
        columns={columns}
        data={filteredProperties}
        actions={actions}
        emptyState={{
          icon: <Building className="h-12 w-12 text-slate-400" />,
          title: "Nenhum empreendimento encontrado",
          description: "Não há empreendimentos que correspondam aos filtros aplicados.",
          action: (
            <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar primeiro empreendimento
            </Button>
          )
        }}
      />
    </div>
  );
};

export default Properties;
