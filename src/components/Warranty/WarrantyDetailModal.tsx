
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, User, MapPin, Clock, Calendar, AlertCircle, FileText } from "lucide-react";

interface WarrantyDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warranty: any;
}

export function WarrantyDetailModal({ open, onOpenChange, warranty }: WarrantyDetailModalProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", className: "bg-amber-100 text-amber-800 border-amber-200" },
      progress: { label: "Em Andamento", className: "bg-blue-100 text-blue-800 border-blue-200" },
      complete: { label: "Concluída", className: "bg-green-100 text-green-800 border-green-200" },
      canceled: { label: "Cancelada", className: "bg-gray-100 text-gray-800 border-gray-200" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "Baixa", className: "bg-green-100 text-green-800" },
      medium: { label: "Média", className: "bg-yellow-100 text-yellow-800" },
      high: { label: "Alta", className: "bg-orange-100 text-orange-800" },
      critical: { label: "Crítica", className: "bg-red-100 text-red-800" }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
  };

  if (!warranty) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Detalhes da Solicitação de Garantia
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre a solicitação
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Título e Status */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">{warranty.title}</h3>
            <div className="flex items-center gap-3">
              {getStatusBadge(warranty.status)}
              {getPriorityBadge(warranty.priority)}
              <Badge variant="outline" className="bg-slate-100 text-slate-700">
                {warranty.category}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Informações do Cliente e Imóvel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <User className="h-4 w-4" />
                  Cliente
                </div>
                <div className="font-medium">{warranty.client}</div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  Imóvel
                </div>
                <div>
                  <div className="font-medium">{warranty.property}</div>
                  <div className="text-sm text-muted-foreground">Unidade {warranty.unit}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  Data de criação
                </div>
                <div className="font-medium">
                  {format(warranty.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
                <div className="text-sm text-muted-foreground">
                  às {format(warranty.createdAt, "HH:mm")}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <User className="h-4 w-4" />
                  Técnico responsável
                </div>
                <div className="font-medium">
                  {warranty.technician || (
                    <span className="text-muted-foreground italic">Não atribuído</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Descrição */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileText className="h-4 w-4" />
              Descrição do problema
            </div>
            <div className="text-sm leading-relaxed bg-muted p-4 rounded-md">
              {warranty.description}
            </div>
          </div>

          {/* Prazo estimado */}
          {warranty.estimatedCompletion && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Prazo estimado para conclusão
                </div>
                <div className="font-medium">
                  {format(warranty.estimatedCompletion, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </div>
            </>
          )}

          {/* Observações do técnico */}
          {warranty.technicalNotes && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Observações técnicas
                </div>
                <div className="text-sm leading-relaxed bg-blue-50 p-4 rounded-md border border-blue-200">
                  {warranty.technicalNotes}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
