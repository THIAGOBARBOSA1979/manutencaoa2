
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Plus, Download, Filter, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { EnhancedWarrantyRequestForm } from "@/components/Warranty/EnhancedWarrantyRequestForm";
import { WarrantyCard } from "@/components/Warranty/WarrantyCard";
import { WarrantySummary } from "@/components/Warranty/WarrantySummary";
import { useToast } from "@/hooks/use-toast";

// Enhanced mock data
const warrantyClaims = [
  {
    id: "1",
    title: "Infiltração no banheiro",
    description: "Identificada infiltração na parede do box do banheiro social. Já está causando mofo e descascamento da pintura.",
    property: "Edifício Aurora",
    unit: "204",
    createdAt: new Date(2025, 4, 5),
    status: "critical" as const,
    category: "Hidráulica",
    priority: "high",
    updates: [
      {
        id: "1",
        date: new Date(2025, 4, 5),
        author: "Sistema",
        text: "Solicitação registrada com sucesso.",
      },
      {
        id: "2",
        date: new Date(2025, 4, 6),
        author: "Técnico Especialista",
        text: "Solicitação em análise pela equipe técnica. Vistoria agendada para amanhã.",
      }
    ]
  },
  {
    id: "2",
    title: "Porta empenada",
    description: "A porta do quarto principal está empenada e não fecha corretamente.",
    property: "Edifício Aurora",
    unit: "204",
    createdAt: new Date(2025, 4, 10),
    status: "progress" as const,
    category: "Esquadrias",
    priority: "medium",
    updates: [
      {
        id: "1",
        date: new Date(2025, 4, 10),
        author: "Sistema",
        text: "Solicitação registrada com sucesso.",
      }
    ]
  },
  {
    id: "3",
    title: "Rachaduras na parede",
    description: "Surgiram rachaduras na parede da sala próximo à janela principal.",
    property: "Edifício Aurora",
    unit: "204",
    createdAt: new Date(2025, 4, 1),
    status: "complete" as const,
    category: "Estrutural",
    priority: "low",
    updates: [
      {
        id: "1",
        date: new Date(2025, 4, 1),
        author: "Sistema",
        text: "Solicitação registrada com sucesso.",
      },
      {
        id: "2",
        date: new Date(2025, 4, 15),
        author: "Técnico",
        text: "Reparo concluído com sucesso.",
      }
    ]
  }
];

const WarrantyGuide = () => (
  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
        <ShieldCheck className="h-5 w-5 text-primary" />
        Guia de Garantias
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <h3 className="font-medium text-blue-900">Garantias Cobertas:</h3>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="flex gap-2">
            <span className="font-medium text-blue-800">5 anos:</span> 
            <span className="text-blue-700">Problemas estruturais</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium text-blue-800">3 anos:</span> 
            <span className="text-blue-700">Impermeabilização</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium text-blue-800">2 anos:</span> 
            <span className="text-blue-700">Instalações hidráulicas e elétricas</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium text-blue-800">1 ano:</span> 
            <span className="text-blue-700">Acabamentos</span>
          </li>
        </ul>
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-100">
        <FileText className="mr-2 h-4 w-4" />
        Ver manual completo
      </Button>
    </CardFooter>
  </Card>
);

const ClientWarranty = () => {
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  
  const claim = selectedClaim 
    ? warrantyClaims.find(c => c.id === selectedClaim) 
    : null;

  // Calculate statistics
  const stats = {
    total: warrantyClaims.length,
    pending: warrantyClaims.filter(c => c.status === "pending").length,
    inProgress: warrantyClaims.filter(c => c.status === "progress").length,
    completed: warrantyClaims.filter(c => c.status === "complete").length,
    critical: warrantyClaims.filter(c => c.status === "critical").length
  };

  // Filter claims based on active tab
  const getFilteredClaims = () => {
    switch (activeTab) {
      case "pending":
        return warrantyClaims.filter(c => c.status === "pending");
      case "progress":
        return warrantyClaims.filter(c => c.status === "progress");
      case "critical":
        return warrantyClaims.filter(c => c.status === "critical");
      case "completed":
        return warrantyClaims.filter(c => c.status === "complete");
      default:
        return warrantyClaims;
    }
  };

  const handleSubmit = (data: any) => {
    toast({
      title: "Solicitação enviada com sucesso",
      description: "Sua solicitação de garantia foi registrada e será analisada em breve."
    });
    console.log("Form data:", data);
    setIsDialogOpen(false);
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados serão enviados para seu e-mail quando estiverem prontos.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                Garantias
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Gerencie suas solicitações de garantia e assistência técnica
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-primary/80">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Solicitação
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Nova Solicitação de Garantia</DialogTitle>
                    <DialogDescription>
                      Preencha os detalhes da sua solicitação para que possamos analisar e atender da melhor forma.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <EnhancedWarrantyRequestForm 
                    onSubmit={handleSubmit} 
                    onCancel={() => setIsDialogOpen(false)} 
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Statistics Summary */}
        <WarrantySummary
          totalClaims={stats.total}
          pendingClaims={stats.pending}
          inProgressClaims={stats.inProgress}
          completedClaims={stats.completed}
          criticalClaims={stats.critical}
        />

        {/* Enhanced Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Claims List */}
          <div className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Minhas Solicitações</CardTitle>
                <CardDescription>
                  Selecione uma solicitação para ver detalhes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="critical">Críticas</TabsTrigger>
                  </TabsList>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getFilteredClaims().map((item) => (
                      <WarrantyCard
                        key={item.id}
                        warranty={item}
                        variant="compact"
                        isSelected={selectedClaim === item.id}
                        onSelect={() => setSelectedClaim(item.id)}
                      />
                    ))}
                    
                    {getFilteredClaims().length === 0 && (
                      <div className="text-center py-8">
                        <ShieldCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Nenhuma solicitação encontrada
                        </p>
                      </div>
                    )}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
            
            <WarrantyGuide />
          </div>
          
          {/* Right column - Claim Details */}
          <div className="lg:col-span-2">
            {claim ? (
              <WarrantyCard
                warranty={claim}
                variant="detailed"
                onViewDetails={() => console.log("View details")}
              />
            ) : (
              <Card className="h-full flex flex-col justify-center items-center py-16 bg-white shadow-sm">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full mx-auto w-fit">
                    <ShieldCheck className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Selecione uma solicitação</h3>
                  <p className="text-muted-foreground max-w-md">
                    Escolha uma solicitação na lista ao lado para ver os detalhes completos, atualizações e opções disponíveis.
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Solicitação
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientWarranty;
