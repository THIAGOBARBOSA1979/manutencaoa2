import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building, Plus, Search } from "lucide-react";
import { PropertyCard } from "@/components/Properties/PropertyCard";
import { EnhancedPropertyForm } from "@/components/Properties/EnhancedPropertyForm";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

// Mock data
const properties = [
  {
    id: "1",
    name: "Edifício Aurora",
    location: "São Paulo, SP",
    units: 120,
    completedUnits: 85,
    status: "progress" as const,
  },
  {
    id: "2",
    name: "Residencial Bosque Verde",
    location: "Rio de Janeiro, RJ",
    units: 75,
    completedUnits: 75,
    status: "complete" as const,
  },
  {
    id: "3",
    name: "Condomínio Monte Azul",
    location: "Belo Horizonte, MG",
    units: 50,
    completedUnits: 10,
    status: "pending" as const,
  },
  {
    id: "4",
    name: "Residencial Parque das Flores",
    location: "Curitiba, PR",
    units: 60,
    completedUnits: 60,
    status: "complete" as const,
  },
  {
    id: "5",
    name: "Condomínio Vista Mar",
    location: "Salvador, BA",
    units: 40,
    completedUnits: 35,
    status: "progress" as const,
  },
  {
    id: "6",
    name: "Edifício Horizonte",
    location: "Brasília, DF",
    units: 80,
    completedUnits: 0,
    status: "pending" as const,
  },
];

const Properties = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePropertySubmit = async (data: any) => {
    console.log("New property data:", data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Sucesso!",
      description: "Empreendimento cadastrado com sucesso.",
    });
    
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building />
            Empreendimentos
          </h1>
          <p className="text-muted-foreground">
            Gerenciamento de todos os empreendimentos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
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
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar empreendimentos..."
            className="pl-8"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="progress">Em andamento</SelectItem>
            <SelectItem value="complete">Concluído</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Properties list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default Properties;
