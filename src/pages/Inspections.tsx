import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ClipboardCheck, 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  ListFilter
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
import { ScheduleInspectionDialog } from "@/components/Inspection/ScheduleInspectionDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

// Mock data para exemplo
const inspections = [
  {
    id: "1",
    property: "Edifício Aurora",
    unit: "101",
    client: "João Silva",
    scheduledDate: new Date(),
    status: "pending" as const
  },
  {
    id: "2",
    property: "Residencial Bosque",
    unit: "302",
    client: "Maria Santos",
    scheduledDate: new Date(),
    status: "progress" as const
  }
];

export default function Inspections() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Cabeçalho da página */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardCheck className="h-8 w-8 text-primary" />
            Agendamentos
          </h1>
          <p className="text-muted-foreground">
            Gerenciamento de vistorias e entregas de unidades
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setView("calendar")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendário
          </Button>
          <ScheduleInspectionDialog />
        </div>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar agendamentos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="progress">Em andamento</SelectItem>
                <SelectItem value="complete">Concluídos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full md:w-auto">
              <ListFilter className="mr-2 h-4 w-4" />
              Mais filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Agendamentos */}
      <div className="grid gap-4">
        {inspections.map((inspection) => (
          <Card 
            key={inspection.id} 
            className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/30"
          >
            <CardContent className="p-0">
              <InspectionItem inspection={inspection} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center mt-6">
        <Button variant="outline" className="mx-2">Anterior</Button>
        <Button variant="outline" className="mx-2">Próxima</Button>
      </div>
    </div>
  );
}