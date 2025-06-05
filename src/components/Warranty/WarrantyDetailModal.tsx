
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Star,
  Settings,
  Eye
} from "lucide-react";
import { WarrantyRequest } from "@/services/WarrantyBusinessRules";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { WarrantyProblemsManager } from "./WarrantyProblemsManager";

interface WarrantyDetailModalProps {
  warranty: WarrantyRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignTechnician?: (warranty: WarrantyRequest) => void;
  onUpdateStatus?: (warranty: WarrantyRequest, newStatus: string) => void;
}

export const WarrantyDetailModal = ({ 
  warranty, 
  open, 
  onOpenChange,
  onAssignTechnician,
  onUpdateStatus
}: WarrantyDetailModalProps) => {
  const [showProblemsManager, setShowProblemsManager] = useState(false);

  if (!warranty) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "progress":
        return <Settings className="h-4 w-4 text-blue-500 animate-spin" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const isOverdue = warranty.estimatedResolutionTime && warranty.status !== 'complete' && 
    new Date() > new Date(warranty.createdAt.getTime() + warranty.estimatedResolutionTime * 60 * 60 * 1000);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              {getStatusIcon(warranty.status)}
              {warranty.title}
              {isOverdue && (
                <Badge variant="destructive" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Atrasada
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Protocolo #{warranty.id.padStart(6, '0')} • Criado em {format(warranty.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="timeline">Histórico</TabsTrigger>
              <TabsTrigger value="actions">Ações</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Informações Gerais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Status:</span>
                      <StatusBadge status={warranty.status} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Prioridade:</span>
                      <Badge className={getPriorityColor(warranty.priority)}>
                        {warranty.priority === 'critical' ? 'Crítica' : 
                         warranty.priority === 'high' ? 'Alta' :
                         warranty.priority === 'medium' ? 'Média' : 'Baixa'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Categoria:</span>
                      <span className="text-sm">{warranty.category}</span>
                    </div>
                    {warranty.estimatedResolutionTime && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Tempo estimado:</span>
                        <span className="text-sm">{warranty.estimatedResolutionTime}h</span>
                      </div>
                    )}
                    {warranty.actualResolutionTime && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Tempo real:</span>
                        <span className="text-sm text-green-600">{warranty.actualResolutionTime}h</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Localização
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Empreendimento:</span>
                      <p className="text-sm mt-1">{warranty.property}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Unidade:</span>
                      <p className="text-sm mt-1">{warranty.unit}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Cliente:</span>
                      <p className="text-sm mt-1">{warranty.client}</p>
                    </div>
                    {warranty.assignedTo && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Técnico responsável:</span>
                        <p className="text-sm mt-1">{warranty.assignedTo}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Descrição do Problema</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {warranty.description}
                  </p>
                </CardContent>
              </Card>

              {warranty.satisfactionRating && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Avaliação do Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= warranty.satisfactionRating!
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({warranty.satisfactionRating}/5)
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico da Solicitação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="w-px h-8 bg-gray-200"></div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Solicitação criada</p>
                        <p className="text-xs text-muted-foreground">
                          {format(warranty.createdAt, "dd/MM/yyyy 'às' HH:mm")}
                        </p>
                      </div>
                    </div>
                    
                    {warranty.assignedTo && (
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <div className="w-px h-8 bg-gray-200"></div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Técnico atribuído</p>
                          <p className="text-xs text-muted-foreground">
                            Atribuído para {warranty.assignedTo}
                          </p>
                        </div>
                      </div>
                    )}

                    {warranty.status === 'complete' && (
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Solicitação concluída</p>
                          <p className="text-xs text-muted-foreground">
                            {format(warranty.updatedAt, "dd/MM/yyyy 'às' HH:mm")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!warranty.assignedTo && warranty.status === 'pending' && onAssignTechnician && (
                  <Button 
                    onClick={() => onAssignTechnician(warranty)}
                    className="w-full"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Atribuir Técnico
                  </Button>
                )}

                <Button 
                  variant="outline"
                  onClick={() => setShowProblemsManager(true)}
                  className="w-full"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Gerenciar Problemas
                </Button>

                {warranty.status === 'progress' && onUpdateStatus && (
                  <Button 
                    onClick={() => onUpdateStatus(warranty, 'complete')}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como Concluída
                  </Button>
                )}

                {warranty.status === 'pending' && warranty.assignedTo && onUpdateStatus && (
                  <Button 
                    onClick={() => onUpdateStatus(warranty, 'progress')}
                    className="w-full"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Iniciar Atendimento
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <WarrantyProblemsManager
        warrantyId={warranty.id}
        warrantyTitle={warranty.title}
        open={showProblemsManager}
        onOpenChange={setShowProblemsManager}
      />
    </>
  );
};
