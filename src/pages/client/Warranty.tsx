import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Plus, Download, AlertTriangle } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EnhancedWarrantyRequestForm } from "@/components/Warranty/EnhancedWarrantyRequestForm";
import { WarrantyCard } from "@/components/Warranty/WarrantyCard";
import { WarrantySummary } from "@/components/Warranty/WarrantySummary";
import { ClientWarrantyDisplay } from "@/components/Warranty/types";
import { useToast } from "@/hooks/use-toast";
import { warrantyService, CreateWarrantyData } from "@/services/WarrantyService";
import { warrantyBusinessRules, WarrantyRequest, UserRole } from "@/services/WarrantyBusinessRules";

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
            <span className="text-blue-700">Impermeabilização e instalações</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium text-blue-800">2 anos:</span> 
            <span className="text-blue-700">Esquadrias</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium text-blue-800">1 ano:</span> 
            <span className="text-blue-700">Acabamentos</span>
          </li>
        </ul>
      </div>
    </CardContent>
  </Card>
);

const ClientWarranty = () => {
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [warranties, setWarranties] = useState<WarrantyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Simulando usuário cliente
  const currentUserId = "client-001";
  const currentUserRole: UserRole = "client";
  const propertyDeliveryDate = new Date('2023-06-01'); // Data de entrega do imóvel

  useEffect(() => {
    loadWarranties();
  }, []);

  const loadWarranties = async () => {
    try {
      setLoading(true);
      const userWarranties = warrantyService.getWarrantiesByUser(currentUserId, currentUserRole);
      setWarranties(userWarranties);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas garantias.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Convert WarrantyRequest to ClientWarrantyDisplay for the component
  const convertToDisplayWarranty = (warranty: WarrantyRequest): ClientWarrantyDisplay => {
    // Map canceled status to complete for display purposes
    const displayStatus = warranty.status === 'canceled' ? 'complete' : warranty.status;
    
    return {
      id: warranty.id,
      title: warranty.title,
      description: warranty.description,
      property: warranty.property,
      unit: warranty.unit,
      createdAt: warranty.createdAt,
      status: displayStatus as ClientWarrantyDisplay['status'],
      category: warranty.category,
      priority: warranty.priority,
      estimatedResolutionTime: warranty.estimatedResolutionTime,
      satisfactionRating: warranty.satisfactionRating,
      isUrgent: warranty.isUrgent,
      client: warranty.client
    };
  };

  const claim = selectedClaim 
    ? warranties.find(c => c.id === selectedClaim) 
    : null;

  // Calcular estatísticas usando as regras de negócio
  const metrics = warrantyService.getWarrantyMetrics(currentUserId, currentUserRole);
  const overdueWarranties = warrantyService.getOverdueWarranties(currentUserId, currentUserRole);
  
  const stats = {
    total: metrics.totalRequests,
    pending: metrics.byStatus.pending,
    inProgress: metrics.byStatus.progress,
    completed: metrics.byStatus.complete,
    critical: metrics.byStatus.critical
  };

  // Filtrar solicitações baseado na aba ativa
  const getFilteredClaims = (): ClientWarrantyDisplay[] => {
    const filteredWarranties = (() => {
      switch (activeTab) {
        case "pending":
          return warranties.filter(c => c.status === "pending");
        case "progress":
          return warranties.filter(c => c.status === "progress");
        case "critical":
          return warranties.filter(c => c.status === "critical");
        case "completed":
          return warranties.filter(c => c.status === "complete" || c.status === "canceled");
        default:
          return warranties;
      }
    })();

    return filteredWarranties.map(convertToDisplayWarranty);
  };

  const handleSubmit = async (data: any) => {
    try {
      // Preparar dados para criação
      const warrantyData: CreateWarrantyData = {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        property: "Edifício Aurora", // Seria obtido do contexto do usuário
        unit: "204", // Seria obtido do contexto do usuário
        client: "Cliente Teste", // Seria obtido do contexto do usuário
        evidences: data.photos || [],
        isUrgent: data.priority === 'critical',
        requiresInspection: data.requiresInspection || false
      };

      // Verificar período de garantia antes de criar
      const warrantyPeriodCheck = warrantyBusinessRules.validateWarrantyPeriod(
        warrantyData.category,
        new Date(),
        propertyDeliveryDate
      );

      if (!warrantyPeriodCheck.isValid) {
        toast({
          title: "Garantia expirada",
          description: warrantyPeriodCheck.errors[0],
          variant: "destructive",
        });
        return;
      }

      if (warrantyPeriodCheck.remainingDays <= 30) {
        toast({
          title: "Atenção",
          description: `Sua garantia expira em ${warrantyPeriodCheck.remainingDays} dias.`,
          variant: "default",
        });
      }

      const result = await warrantyService.createWarranty(
        warrantyData,
        currentUserId,
        currentUserRole,
        propertyDeliveryDate
      );

      if (result.success) {
        toast({
          title: "Solicitação criada com sucesso",
          description: `Sua solicitação foi registrada e será analisada em breve. Tempo estimado de resolução: ${result.warranty?.estimatedResolutionTime}h`,
        });
        setIsDialogOpen(false);
        loadWarranties(); // Recarregar dados
      } else {
        toast({
          title: "Erro ao criar solicitação",
          description: result.errors?.join(", ") || "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleExportData = async () => {
    try {
      const result = await warrantyService.exportWarranties(currentUserId, currentUserRole);
      
      if (result.success) {
        toast({
          title: "Exportação concluída",
          description: `${result.data?.length} registros exportados com sucesso.`,
        });
        // Aqui seria feito o download do arquivo
        console.log("Dados exportados:", result.data);
      } else {
        toast({
          title: "Erro na exportação",
          description: result.errors?.[0] || "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleRateWarranty = async (warrantyId: string, rating: number) => {
    try {
      const result = await warrantyService.updateWarranty(
        warrantyId,
        { satisfactionRating: rating },
        currentUserId,
        currentUserRole
      );

      if (result.success) {
        toast({
          title: "Avaliação registrada",
          description: "Obrigado pelo seu feedback!",
        });
        loadWarranties();
      } else {
        toast({
          title: "Erro na avaliação",
          description: result.errors?.[0] || "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na avaliação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ShieldCheck className="h-12 w-12 mx-auto text-primary animate-pulse" />
          <p className="mt-2 text-muted-foreground">Carregando suas garantias...</p>
        </div>
      </div>
    );
  }

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
                Gerencie suas solicitações de garantia com segurança e rastreabilidade
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
                      Preencha os detalhes da sua solicitação. O sistema calculará automaticamente a prioridade e o tempo estimado de resolução.
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

        {/* Alertas de garantias em atraso */}
        {overdueWarranties.length > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Você tem {overdueWarranties.length} solicitação(ões) de garantia em atraso. 
              Entre em contato conosco para mais informações.
            </AlertDescription>
          </Alert>
        )}

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
                  {warranties.length > 0 
                    ? "Selecione uma solicitação para ver detalhes"
                    : "Você ainda não possui solicitações de garantia"
                  }
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
                        onRate={handleRateWarranty}
                      />
                    ))}
                    
                    {getFilteredClaims().length === 0 && (
                      <div className="text-center py-8">
                        <ShieldCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          {activeTab === "all" 
                            ? "Nenhuma solicitação encontrada"
                            : `Nenhuma solicitação ${activeTab === "critical" ? "crítica" : activeTab} encontrada`
                          }
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
                onRate={handleRateWarranty}
              />
            ) : (
              <Card className="h-full flex flex-col justify-center items-center py-16 bg-white shadow-sm">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full mx-auto w-fit">
                    <ShieldCheck className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {warranties.length === 0 ? "Bem-vindo às Garantias" : "Selecione uma solicitação"}
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    {warranties.length === 0 
                      ? "Aqui você pode criar e acompanhar suas solicitações de garantia com total transparência e segurança."
                      : "Escolha uma solicitação na lista ao lado para ver os detalhes completos, atualizações e opções disponíveis."
                    }
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {warranties.length === 0 ? "Criar primeira solicitação" : "Nova Solicitação"}
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
