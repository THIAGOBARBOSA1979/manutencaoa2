
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, MapPin, ClipboardList, FileText } from "lucide-react";

interface InspectionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection: any;
}

export function InspectionDetailModal({ open, onOpenChange, inspection }: InspectionDetailModalProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", className: "bg-amber-100 text-amber-800 border-amber-200" },
      progress: { label: "Em Andamento", className: "bg-blue-100 text-blue-800 border-blue-200" },
      complete: { label: "Concluída", className: "bg-green-100 text-green-800 border-green-200" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      "pre-delivery": { label: "Pré-entrega", className: "bg-purple-100 text-purple-800" },
      "delivery": { label: "Entrega", className: "bg-indigo-100 text-indigo-800" },
      "maintenance": { label: "Manutenção", className: "bg-orange-100 text-orange-800" }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
  };

  if (!inspection) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Detalhes da Vistoria
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre a vistoria agendada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Tipo */}
          <div className="flex items-center gap-4">
            {getStatusBadge(inspection.status)}
            {getTypeBadge(inspection.type)}
          </div>

          <Separator />

          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Imóvel
              </div>
              <div>
                <div className="font-medium">{inspection.property}</div>
                <div className="text-sm text-muted-foreground">Unidade {inspection.unit}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                Cliente
              </div>
              <div className="font-medium">{inspection.client}</div>
            </div>
          </div>

          <Separator />

          {/* Data e Horário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Data
              </div>
              <div className="font-medium">
                {format(inspection.scheduledDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                Horário
              </div>
              <div className="font-medium">
                {format(inspection.scheduledDate, "HH:mm")}
              </div>
            </div>
          </div>

          <Separator />

          {/* Responsável */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Responsável Técnico
            </div>
            <div className="font-medium">{inspection.inspector}</div>
          </div>

          {/* Descrição */}
          {inspection.description && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Descrição
                </div>
                <div className="text-sm leading-relaxed">{inspection.description}</div>
              </div>
            </>
          )}

          {/* Checklist */}
          {inspection.checklist && inspection.checklist.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <ClipboardList className="h-4 w-4" />
                  Checklist ({inspection.checklist.filter((item: any) => item.completed).length}/{inspection.checklist.length} concluídos)
                </div>
                <div className="space-y-2">
                  {inspection.checklist.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded border-2 flex items-center justify-center ${
                        item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`}>
                        {item.completed && (
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
