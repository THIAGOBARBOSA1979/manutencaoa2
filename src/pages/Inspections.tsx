
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ClipboardCheck, 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon
} from "lucide-react";
import { InspectionItem } from "@/components/Inspection/InspectionItem";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const inspections = [
  {
    id: "1",
    property: "Edifício Aurora",
    unit: "507",
    client: "Carlos Silva",
    scheduledDate: new Date(2025, 4, 19, 10, 0),
    status: "pending" as const,
  },
  {
    id: "2",
    property: "Edifício Aurora",
    unit: "204",
    client: "Maria Oliveira",
    scheduledDate: new Date(2025, 4, 19, 14, 30),
    status: "pending" as const,
  },
  {
    id: "3",
    property: "Residencial Bosque Verde",
    unit: "102",
    client: "Roberto Pereira",
    scheduledDate: new Date(2025, 4, 18, 9, 0),
    status: "complete" as const,
  },
  {
    id: "4",
    property: "Condomínio Monte Azul",
    unit: "301",
    client: "Juliana Costa",
    scheduledDate: new Date(2025, 4, 18, 15, 0),
    status: "progress" as const,
  },
  {
    id: "5",
    property: "Residencial Bosque Verde",
    unit: "405",
    client: "Fernando Martins",
    scheduledDate: new Date(2025, 4, 20, 10, 30),
    status: "pending" as const,
  },
  {
    id: "6",
    property: "Edifício Aurora",
    unit: "602",
    client: "Luciana Santos",
    scheduledDate: new Date(2025, 4, 17, 11, 0),
    status: "complete" as const,
  },
];

const Inspections = () => {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardCheck />
            Vistorias
          </h1>
          <p className="text-muted-foreground">
            Gerenciamento de vistorias e entregas de unidades
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Ver Calendário
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Agendar Vistoria
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Próximas</TabsTrigger>
          <TabsTrigger value="in-progress">Em andamento</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4 pt-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar vistorias..."
                className="pl-8"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Empreendimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="aurora">Edifício Aurora</SelectItem>
                <SelectItem value="bosque">Residencial Bosque Verde</SelectItem>
                <SelectItem value="monte">Condomínio Monte Azul</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>

          {/* Inspections list */}
          <div className="space-y-4">
            {inspections
              .filter(i => i.status === "pending")
              .map((inspection) => (
                <InspectionItem key={inspection.id} inspection={inspection} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="in-progress" className="space-y-4 pt-4">
          <div className="space-y-4">
            {inspections
              .filter(i => i.status === "progress")
              .map((inspection) => (
                <InspectionItem key={inspection.id} inspection={inspection} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 pt-4">
          <div className="space-y-4">
            {inspections
              .filter(i => i.status === "complete")
              .map((inspection) => (
                <InspectionItem key={inspection.id} inspection={inspection} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4 pt-4">
          <div className="space-y-4">
            {inspections.map((inspection) => (
              <InspectionItem key={inspection.id} inspection={inspection} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inspections;
