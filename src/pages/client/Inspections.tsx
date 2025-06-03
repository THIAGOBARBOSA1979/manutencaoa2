
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Plus, Filter, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { StartInspectionDialog } from "@/components/Inspection/StartInspectionDialog";
import { InspectionCard } from "@/components/Inspection/InspectionCard";
import { InspectionSummary } from "@/components/Inspection/InspectionSummary";
import { useToast } from "@/hooks/use-toast";

// Mock data - enhanced with more realistic information
const inspections = [
  {
    id: "1",
    title: "Vistoria de Pré-entrega",
    property: "Edifício Aurora",
    unit: "204",
    scheduledDate: new Date(2025, 4, 15, 10, 0),
    status: "pending" as const,
    inspector: "Carlos Andrade",
    description: "Vistoria para verificação das condições da unidade antes da entrega oficial.",
    checklist: [
      { id: "1", name: "Verificação de paredes e pinturas", completed: false },
      { id: "2", name: "Teste de instalações elétricas", completed: false },
      { id: "3", name: "Teste de instalações hidráulicas", completed: false },
      { id: "4", name: "Verificação de esquadrias e vidros", completed: false },
      { id: "5", name: "Verificação de pisos e revestimentos", completed: false },
    ],
    canStart: true
  },
  {
    id: "2",
    title: "Entrega de Chaves",
    property: "Edifício Aurora",
    unit: "204",
    scheduledDate: new Date(2025, 4, 20, 14, 30),
    status: "pending" as const,
    inspector: "Luiza Mendes",
    description: "Vistoria final e entrega oficial das chaves do imóvel.",
    checklist: [
      { id: "1", name: "Verificação final de acabamentos", completed: false },
      { id: "2", name: "Conferência de documentação", completed: false },
      { id: "3", name: "Demonstração de funcionamento de equipamentos", completed: false },
      { id: "4", name: "Entrega de manuais e garantias", completed: false },
      { id: "5", name: "Assinatura de termo de recebimento", completed: false },
    ],
    canStart: false
  },
  {
    id: "3",
    title: "Vistoria de Reparo",
    property: "Edifício Aurora",
    unit: "204",
    scheduledDate: new Date(2025, 3, 10, 9, 0),
    status: "complete" as const,
    inspector: "Roberto Santos",
    description: "Vistoria para verificar a correção dos itens identificados na vistoria anterior.",
    checklist: [
      { id: "1", name: "Verificação do reparo da infiltração no banheiro", completed: true },
      { id: "2", name: "Verificação do reparo da maçaneta da porta", completed: true },
    ],
    canStart: false,
    report: "https://example.com/report.pdf"
  }
];

const ClientInspections = () => {
  const [selectedInspection, setSelectedInspection] = useState<string | null>(null);
  const [startInspectionOpen, setStartInspectionOpen] = useState(false);
  const [activeInspection, setActiveInspection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  
  const inspection = selectedInspection 
    ? inspections.find(i => i.id === selectedInspection) 
    : null;

  // Calculate statistics
  const stats = {
    total: inspections.length,
    pending: inspections.filter(i => i.status === "pending").length,
    inProgress: inspections.filter(i => i.status === "progress").length,
    completed: inspections.filter(i => i.status === "complete").length,
    upcoming: inspections.filter(i => i.scheduledDate > new Date()).length
  };

  // Filter inspections based on active tab
  const getFilteredInspections = () => {
    switch (activeTab) {
      case "pending":
        return inspections.filter(i => i.status === "pending");
      case "completed":
        return inspections.filter(i => i.status === "complete");
      case "upcoming":
        return inspections.filter(i => i.scheduledDate > new Date());
      default:
        return inspections;
    }
  };

  const handleStartInspection = (inspectionId: string) => {
    setActiveInspection(inspectionId);
    setStartInspectionOpen(true);
  };

  const handleInspectionComplete = (data: any) => {
    console.log("Inspection completed:", data);
    
    toast({
      title: "Vistoria concluída com sucesso",
      description: "O relatório será processado e estará disponível em breve.",
    });
    
    setStartInspectionOpen(false);
  };

  const handleConfirmPresence = () => {
    toast({
      title: "Presença confirmada",
      description: "Obrigado por confirmar sua presença na vistoria.",
    });
  };

  const handleRequestReschedule = () => {
    toast({
      title: "Solicitação de remarcação enviada",
      description: "Em breve entraremos em contato para agendar uma nova data.",
    });
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
                  <ClipboardCheck className="h-8 w-8 text-primary" />
                </div>
                Minhas Vistorias
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Acompanhe e gerencie suas vistorias agendadas
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Solicitar Vistoria
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Summary */}
        <InspectionSummary
          totalInspections={stats.total}
          pendingInspections={stats.pending}
          inProgressInspections={stats.inProgress}
          completedInspections={stats.completed}
          upcomingInspections={stats.upcoming}
        />

        {/* Enhanced Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inspections List */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Vistorias</CardTitle>
                <CardDescription>
                  Selecione uma vistoria para ver detalhes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="pending">Pendentes</TabsTrigger>
                    <TabsTrigger value="completed">Concluídas</TabsTrigger>
                  </TabsList>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getFilteredInspections().map((item) => (
                      <InspectionCard
                        key={item.id}
                        inspection={item}
                        variant="compact"
                        isSelected={selectedInspection === item.id}
                        onSelect={() => setSelectedInspection(item.id)}
                      />
                    ))}
                    
                    {getFilteredInspections().length === 0 && (
                      <div className="text-center py-8">
                        <ClipboardCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Nenhuma vistoria encontrada
                        </p>
                      </div>
                    )}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Help Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Precisa de ajuda?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-blue-800">
                  Se você precisar remarcar uma vistoria ou tiver dúvidas sobre o processo, nossa equipe está aqui para ajudar.
                </p>
                <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-100">
                  Falar com a equipe
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Inspection Details */}
          <div className="lg:col-span-2">
            {inspection ? (
              <InspectionCard
                inspection={inspection}
                variant="detailed"
                onStartInspection={() => handleStartInspection(inspection.id)}
                onConfirmPresence={handleConfirmPresence}
                onRequestReschedule={handleRequestReschedule}
              />
            ) : (
              <Card className="h-full flex flex-col justify-center items-center py-16 bg-white shadow-sm">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full mx-auto w-fit">
                    <ClipboardCheck className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Selecione uma vistoria</h3>
                  <p className="text-muted-foreground max-w-md">
                    Escolha uma vistoria na lista ao lado para ver os detalhes completos, checklist e opções disponíveis.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Start Inspection Dialog */}
      {activeInspection && (
        <StartInspectionDialog
          open={startInspectionOpen}
          onOpenChange={setStartInspectionOpen}
          inspectionId={activeInspection}
          inspectionTitle={inspections.find(i => i.id === activeInspection)?.title || "Vistoria"}
          onComplete={handleInspectionComplete}
        />
      )}
    </div>
  );
};

export default ClientInspections;
