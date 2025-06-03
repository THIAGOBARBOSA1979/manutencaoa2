
import { format } from "date-fns";
import { Calendar, User, MapPin, Clock, CheckCircle, AlertCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface InspectionCardProps {
  inspection: {
    id: string;
    title: string;
    property: string;
    unit: string;
    scheduledDate: Date;
    status: "pending" | "progress" | "complete";
    inspector?: string;
    description?: string;
    canStart?: boolean;
  };
  onSelect?: () => void;
  onStartInspection?: () => void;
  onConfirmPresence?: () => void;
  onRequestReschedule?: () => void;
  isSelected?: boolean;
  variant?: "compact" | "detailed";
}

export const InspectionCard = ({ 
  inspection, 
  onSelect, 
  onStartInspection,
  onConfirmPresence,
  onRequestReschedule,
  isSelected = false,
  variant = "compact"
}: InspectionCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "progress":
        return <Play className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const getPriorityColor = (date: Date) => {
    const today = new Date();
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return "border-l-red-500 bg-red-50/50";
    if (diffDays <= 3) return "border-l-amber-500 bg-amber-50/50";
    return "border-l-blue-500 bg-blue-50/50";
  };

  if (variant === "compact") {
    return (
      <Card 
        className={`transition-all duration-200 hover:shadow-lg cursor-pointer border-l-4 ${getPriorityColor(inspection.scheduledDate)} ${
          isSelected ? "ring-2 ring-primary ring-offset-2" : ""
        }`}
        onClick={onSelect}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(inspection.status)}
              <h3 className="font-semibold text-sm">{inspection.title}</h3>
            </div>
            <StatusBadge status={inspection.status} />
          </div>
          
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>{inspection.property} - Unidade {inspection.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>{format(inspection.scheduledDate, "dd/MM/yyyy 'às' HH:mm")}</span>
            </div>
            {inspection.inspector && (
              <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span>{inspection.inspector}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-xl border-l-4 ${getPriorityColor(inspection.scheduledDate)}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {getStatusIcon(inspection.status)}
              {inspection.title}
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              {format(inspection.scheduledDate, "dd 'de' MMMM 'de' yyyy 'às' HH:mm")}
            </p>
          </div>
          <StatusBadge status={inspection.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{inspection.property} - Unidade {inspection.unit}</span>
            </div>
            {inspection.inspector && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Vistoriador: {inspection.inspector}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Duração estimada: 1 hora</span>
            </div>
          </div>
          
          {inspection.description && (
            <div>
              <h4 className="font-medium text-sm mb-2">Descrição:</h4>
              <p className="text-sm text-muted-foreground">{inspection.description}</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {onRequestReschedule && (
            <Button variant="outline" size="sm" onClick={onRequestReschedule}>
              Remarcar
            </Button>
          )}
          
          {inspection.canStart && onStartInspection ? (
            <Button size="sm" onClick={onStartInspection} className="bg-gradient-to-r from-primary to-primary/80">
              <Play className="h-4 w-4 mr-2" />
              Iniciar Vistoria
            </Button>
          ) : onConfirmPresence && inspection.status !== "complete" && (
            <Button size="sm" onClick={onConfirmPresence}>
              Confirmar Presença
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
