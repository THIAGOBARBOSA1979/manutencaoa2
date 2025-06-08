
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { History, Calendar, Clock, User, Edit, MessageSquare } from "lucide-react";

interface InspectionHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection: any;
}

// Mock histórico
const mockHistory = [
  {
    id: "1",
    action: "created",
    description: "Vistoria agendada",
    user: "Admin",
    timestamp: new Date(2025, 4, 10, 14, 30),
    details: "Vistoria de pré-entrega agendada para 15/05/2025 às 10:00"
  },
  {
    id: "2",
    action: "updated",
    description: "Responsável técnico alterado",
    user: "Carlos Silva",
    timestamp: new Date(2025, 4, 12, 9, 15),
    details: "Responsável alterado de 'João Pereira' para 'Carlos Andrade'"
  },
  {
    id: "3",
    action: "rescheduled",
    description: "Vistoria reagendada",
    user: "Ana Costa",
    timestamp: new Date(2025, 4, 13, 16, 45),
    details: "Data alterada de 15/05/2025 10:00 para 19/05/2025 10:00. Motivo: Solicitação do cliente"
  }
];

export function InspectionHistoryModal({ open, onOpenChange, inspection }: InspectionHistoryModalProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "created":
        return <Calendar className="h-4 w-4 text-green-600" />;
      case "updated":
        return <Edit className="h-4 w-4 text-blue-600" />;
      case "rescheduled":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      default:
        return <History className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionBadge = (action: string) => {
    const actionConfig = {
      created: { label: "Criada", className: "bg-green-100 text-green-800" },
      updated: { label: "Atualizada", className: "bg-blue-100 text-blue-800" },
      rescheduled: { label: "Reagendada", className: "bg-orange-100 text-orange-800" },
      comment: { label: "Comentário", className: "bg-purple-100 text-purple-800" },
      completed: { label: "Concluída", className: "bg-gray-100 text-gray-800" }
    };
    
    const config = actionConfig[action as keyof typeof actionConfig] || { label: action, className: "bg-gray-100 text-gray-800" };
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
  };

  if (!inspection) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico da Vistoria
          </DialogTitle>
          <DialogDescription>
            Registro completo de todas as alterações e ações realizadas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da vistoria */}
          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-medium mb-2">Vistoria: {inspection.property} - Unidade {inspection.unit}</h4>
            <p className="text-sm text-muted-foreground">Cliente: {inspection.client}</p>
          </div>

          <Separator />

          {/* Histórico */}
          <div className="space-y-4">
            <h4 className="font-medium">Histórico de Alterações</h4>
            
            <div className="space-y-4">
              {mockHistory.map((entry, index) => (
                <div key={entry.id} className="relative">
                  {index < mockHistory.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-px bg-border" />
                  )}
                  
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border-2 border-border">
                      {getActionIcon(entry.action)}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{entry.description}</span>
                        {getActionBadge(entry.action)}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {entry.details}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {entry.user}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(entry.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
