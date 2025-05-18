
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter
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
import { WarrantyService } from "@/components/Warranty/WarrantyService";
import { useToast } from "@/components/ui/use-toast";

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

const Warranty = () => {
  const { toast } = useToast();
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleAtendimento = (warrantyId: string, warrantyTitle: string) => {
    setSelectedWarranty({ id: warrantyId, title: warrantyTitle });
    setServiceDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck />
            Garantias
          </h1>
          <p className="text-muted-foreground">
            Gerenciamento de solicitações de garantia e assistência técnica
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Solicitação
        </Button>
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
              />
            </div>
            <Select defaultValue="all-properties">
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
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>

          {/* Warranty claims list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {warrantyClaims.map((claim) => (
              <WarrantyClaim 
                key={claim.id} 
                claim={claim} 
                onAtender={() => handleAtendimento(claim.id, claim.title)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="critical" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {warrantyClaims
              .filter(claim => claim.status === "critical")
              .map((claim) => (
                <WarrantyClaim 
                  key={claim.id} 
                  claim={claim} 
                  onAtender={() => handleAtendimento(claim.id, claim.title)}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {warrantyClaims
              .filter(claim => claim.status === "pending")
              .map((claim) => (
                <WarrantyClaim 
                  key={claim.id} 
                  claim={claim} 
                  onAtender={() => handleAtendimento(claim.id, claim.title)}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="in-progress" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {warrantyClaims
              .filter(claim => claim.status === "progress")
              .map((claim) => (
                <WarrantyClaim 
                  key={claim.id} 
                  claim={claim} 
                  onAtender={() => handleAtendimento(claim.id, claim.title)}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {warrantyClaims
              .filter(claim => claim.status === "complete")
              .map((claim) => (
                <WarrantyClaim 
                  key={claim.id} 
                  claim={claim} 
                  onAtender={() => handleAtendimento(claim.id, claim.title)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Warranty Service Dialog */}
      {selectedWarranty && (
        <WarrantyService
          open={serviceDialogOpen}
          onOpenChange={setServiceDialogOpen}
          warrantyId={selectedWarranty.id}
          warrantyTitle={selectedWarranty.title}
        />
      )}
    </div>
  );
};

export default Warranty;
