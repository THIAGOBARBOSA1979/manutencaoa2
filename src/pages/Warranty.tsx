import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter,
  ListTodo,
  Calendar,
  Download,
  InfoIcon,
  ChevronDown,
  PieChart
} from "lucide-react";
import { WarrantyClaim } from "@/components/Warranty/WarrantyClaim";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WarrantyService from "@/components/Warranty/WarrantyService";
import { WarrantyProblemsManager } from "@/components/Warranty/WarrantyProblemsManager";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScheduleInspectionDialog } from "@/components/Inspection/ScheduleInspectionDialog";

// Mock data
const warrantyClaims = [
  {
    id: "1",
    title: "Infiltração no banheiro",
    property: "Residencial Bosque Verde",
    unit: "305",
    client: "Ana Santos",
    description: "Identificada infiltração na parede do box do banheiro social. Já está causando mofo e descascamento da pintura.",
    createdAt: new Date(2025, 4, 15),
    status: "critical" as const,
  },
  {
    id: "2",
    title: "Porta empenada",
    property: "Edifício Aurora",
    unit: "108",
    client: "João Mendes",
    description: "A porta do quarto principal está empenada e não fecha corretamente.",
    createdAt: new Date(2025, 4, 16),
    status: "progress" as const,
  },
  {
    id: "3",
    title: "Rachaduras na parede",
    property: "Condomínio Monte Azul",
    unit: "205",
    client: "Paulo Soares",
    description: "Surgiram rachaduras na parede da sala próximo à janela principal.",
    createdAt: new Date(2025, 4, 14),
    status: "pending" as const,
  },
  {
    id: "4",
    title: "Vazamento em tubulação",
    property: "Edifício Aurora",
    unit: "302",
    client: "Carla Ferreira",
    description: "Vazamento na tubulação embaixo da pia da cozinha, causando acúmulo de água no armário.",
    createdAt: new Date(2025, 4, 17),
    status: "critical" as const,
  },
  {
    id: "5",
    title: "Problema no piso laminado",
    property: "Residencial Bosque Verde",
    unit: "107",
    client: "Marcos Oliveira",
    description: "O piso laminado da sala está descolando em alguns pontos próximos à varanda.",
    createdAt: new Date(2025, 4, 13),
    status: "complete" as const,
  },
  {
    id: "6",
    title: "Maçaneta quebrada",
    property: "Edifício Aurora",
    unit: "504",
    client: "Laura Costa",
    description: "A maçaneta da porta do banheiro social quebrou e não é possível fechar a porta.",
    createdAt: new Date(2025, 4, 18),
    status: "progress" as const,
  },
];

// Status statistics
const statusStats = {
  critical: 2,
  pending: 1,
  progress: 2,
  complete: 1,
};

// Status distribution by property
const propertyStats = [
  { property: "Edifício Aurora", critical: 1, pending: 1, progress: 1, complete: 0 },
  { property: "Residencial Bosque Verde", critical: 1, pending: 0, progress: 1, complete: 1 },
  { property: "Condomínio Monte Azul", critical: 0, pending: 0, progress: 0, complete: 0 },
];

const Warranty = () => {
  const { toast } = useToast();
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [problemsDialogOpen, setProblemDialogOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string>("all-properties");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Calculate filtered claims
  const getFilteredClaims = (status: string) => {
    let filteredClaims = [...warrantyClaims];
    
    // Filter by status if not "all"
    if (status !== "all") {
      filteredClaims = filteredClaims.filter(claim => claim.status === status);
    }
    
    // Filter by property if not "all-properties"
    if (selectedProperty !== "all-properties") {
      filteredClaims = filteredClaims.filter(claim => 
        claim.property.toLowerCase().includes(selectedProperty.toLowerCase())
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      filteredClaims = filteredClaims.filter(claim => 
        claim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by date
    if (dateFilter === "today") {
      const today = new Date();
      filteredClaims = filteredClaims.filter(claim => 
        claim.createdAt.getDate() === today.getDate() &&
        claim.createdAt.getMonth() === today.getMonth() &&
        claim.createdAt.getFullYear() === today.getFullYear()
      );
    } else if (dateFilter === "week") {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      filteredClaims = filteredClaims.filter(claim => claim.createdAt >= lastWeek);
    } else if (dateFilter === "month") {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      filteredClaims = filteredClaims.filter(claim => claim.createdAt >= lastMonth);
    }
    
    return filteredClaims;
  };

  const handleAtendimento = (warrantyId: string, warrantyTitle: string) => {
    setSelectedWarranty({ id: warrantyId, title: warrantyTitle });
    setServiceDialogOpen(true);
  };
  
  const handleGerenciarProblemas = (warrantyId: string, warrantyTitle: string) => {
    setSelectedWarranty({ id: warrantyId, title: warrantyTitle });
    setProblemDialogOpen(true);
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados serão enviados para seu e-mail quando estiverem prontos.",
    });
  };

  const clearFilters = () => {
    setSelectedProperty("all-properties");
    setSearchQuery("");
    setDateFilter("all");
    setFilterSheetOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Garantias
          </h1>
          <p className="text-muted-foreground">
            Gerenciamento de solicitações de garantia e assistência técnica
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ScheduleInspectionDialog 
            triggerButton={
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Vistoria
              </Button>
            }
          />
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Solicitação
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Exportar dados
              </DropdownMenuItem>
              <DropdownMenuItem>
                <InfoIcon className="mr-2 h-4 w-4" />
                Ver relatório
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Solicitações críticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="destructive" className="h-8 w-8 rounded-full p-1.5 flex items-center justify-center">
                {statusStats.critical}
              </Badge>
              <div className="text-2xl font-bold">{statusStats.critical}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-amber-500 h-8 w-8 rounded-full p-1.5 flex items-center justify-center">
                {statusStats.pending}
              </Badge>
              <div className="text-2xl font-bold">{statusStats.pending}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Em andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-blue-500 h-8 w-8 rounded-full p-1.5 flex items-center justify-center">
                {statusStats.progress}
              </Badge>
              <div className="text-2xl font-bold">{statusStats.progress}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Concluídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-500 h-8 w-8 rounded-full p-1.5 flex items-center justify-center">
                {statusStats.complete}
              </Badge>
              <div className="text-2xl font-bold">{statusStats.complete}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="critical">Críticas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="in-progress">Em andamento</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 pt-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar solicitações..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select 
              value={selectedProperty} 
              onValueChange={setSelectedProperty}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Empreendimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-properties">Todos</SelectItem>
                <SelectItem value="aurora">Edifício Aurora</SelectItem>
                <SelectItem value="bosque">Residencial Bosque Verde</SelectItem>
                <SelectItem value="monte">Condomínio Monte Azul</SelectItem>
              </SelectContent>
            </Select>
            <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Período</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={dateFilter === "all" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setDateFilter("all")}
                      >
                        Todos
                      </Button>
                      <Button 
                        variant={dateFilter === "today" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setDateFilter("today")}
                      >
                        Hoje
                      </Button>
                      <Button 
                        variant={dateFilter === "week" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setDateFilter("week")}
                      >
                        Última semana
                      </Button>
                      <Button 
                        variant={dateFilter === "month" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setDateFilter("month")}
                      >
                        Último mês
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Empreendimento</h3>
                    <Select 
                      value={selectedProperty} 
                      onValueChange={setSelectedProperty}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-properties">Todos</SelectItem>
                        <SelectItem value="aurora">Edifício Aurora</SelectItem>
                        <SelectItem value="bosque">Residencial Bosque Verde</SelectItem>
                        <SelectItem value="monte">Condomínio Monte Azul</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={clearFilters}>
                      Limpar filtros
                    </Button>
                    <Button onClick={() => setFilterSheetOpen(false)}>
                      Aplicar filtros
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Warranty claims list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {getFilteredClaims("all").map((claim) => (
              <WarrantyClaim 
                key={claim.id} 
                claim={claim} 
                onAtender={() => handleAtendimento(claim.id, claim.title)}
                onGerenciarProblemas={() => handleGerenciarProblemas(claim.id, claim.title)}
              />
            ))}
            {getFilteredClaims("all").length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/10">
                <ListTodo className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium">Nenhuma solicitação encontrada</h3>
                <p className="text-muted-foreground text-sm">Tente mudar seus filtros ou adicionar uma nova solicitação.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="critical" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {getFilteredClaims("critical").map((claim) => (
              <WarrantyClaim 
                key={claim.id} 
                claim={claim} 
                onAtender={() => handleAtendimento(claim.id, claim.title)}
                onGerenciarProblemas={() => handleGerenciarProblemas(claim.id, claim.title)}
              />
            ))}
            {getFilteredClaims("critical").length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/10">
                <ListTodo className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium">Nenhuma solicitação crítica encontrada</h3>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {getFilteredClaims("pending").map((claim) => (
              <WarrantyClaim 
                key={claim.id} 
                claim={claim} 
                onAtender={() => handleAtendimento(claim.id, claim.title)}
                onGerenciarProblemas={() => handleGerenciarProblemas(claim.id, claim.title)}
              />
            ))}
            {getFilteredClaims("pending").length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/10">
                <ListTodo className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium">Nenhuma solicitação pendente encontrada</h3>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="in-progress" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {getFilteredClaims("progress").map((claim) => (
              <WarrantyClaim 
                key={claim.id} 
                claim={claim} 
                onAtender={() => handleAtendimento(claim.id, claim.title)}
                onGerenciarProblemas={() => handleGerenciarProblemas(claim.id, claim.title)}
              />
            ))}
            {getFilteredClaims("progress").length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/10">
                <ListTodo className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium">Nenhuma solicitação em andamento encontrada</h3>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {getFilteredClaims("complete").map((claim) => (
              <WarrantyClaim 
                key={claim.id} 
                claim={claim} 
                onAtender={() => handleAtendimento(claim.id, claim.title)}
                onGerenciarProblemas={() => handleGerenciarProblemas(claim.id, claim.title)}
              />
            ))}
            {getFilteredClaims("complete").length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/10">
                <ListTodo className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium">Nenhuma solicitação concluída encontrada</h3>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Warranty Service Dialog */}
      {selectedWarranty && (
        <>
          <WarrantyService
            open={serviceDialogOpen}
            onOpenChange={setServiceDialogOpen}
            warrantyId={selectedWarranty.id}
            warrantyTitle={selectedWarranty.title}
          />
          
          <WarrantyProblemsManager
            open={problemsDialogOpen}
            onOpenChange={setProblemDialogOpen}
            warrantyId={selectedWarranty.id}
            warrantyTitle={selectedWarranty.title}
          />
        </>
      )}
    </div>
  );
};

export default Warranty;
