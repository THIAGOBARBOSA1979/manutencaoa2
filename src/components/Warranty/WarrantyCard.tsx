
import { format } from "date-fns";
import { Calendar, AlertTriangle, Clock, CheckCircle, FileText, User, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ClientWarrantyDisplay } from "./types";

interface WarrantyCardProps {
  warranty: ClientWarrantyDisplay;
  onSelect?: () => void;
  onViewDetails?: () => void;
  onRate?: (warrantyId: string, rating: number) => Promise<void>;
  isSelected?: boolean;
  variant?: "compact" | "detailed";
}

export const WarrantyCard = ({ 
  warranty, 
  onSelect, 
  onViewDetails,
  onRate,
  isSelected = false,
  variant = "compact"
}: WarrantyCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "progress":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const getPriorityColor = (status: string) => {
    switch (status) {
      case "critical":
        return "border-l-red-500 bg-red-50/50";
      case "progress":
        return "border-l-blue-500 bg-blue-50/50";
      case "complete":
        return "border-l-green-500 bg-green-50/50";
      default:
        return "border-l-amber-500 bg-amber-50/50";
    }
  };

  const getPriorityBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive" className="text-xs">Crítico</Badge>;
      case "progress":
        return <Badge variant="default" className="text-xs">Em Andamento</Badge>;
      case "complete":
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">Concluído</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Pendente</Badge>;
    }
  };

  const handleRating = (rating: number) => {
    if (onRate) {
      onRate(warranty.id, rating);
    }
  };

  if (variant === "compact") {
    return (
      <Card 
        className={`transition-all duration-200 hover:shadow-lg cursor-pointer border-l-4 ${getPriorityColor(warranty.status)} ${
          isSelected ? "ring-2 ring-primary ring-offset-2" : ""
        }`}
        onClick={onSelect}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(warranty.status)}
              <h3 className="font-semibold text-sm line-clamp-1">{warranty.title}</h3>
            </div>
            {getPriorityBadge(warranty.status)}
          </div>
          
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3" />
              <span className="line-clamp-1">{warranty.property} - Unidade {warranty.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>{format(warranty.createdAt, "dd/MM/yyyy")}</span>
            </div>
            {warranty.category && (
              <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span>{warranty.category}</span>
              </div>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
            {warranty.description}
          </p>
          
          {warranty.status === "complete" && !warranty.satisfactionRating && onRate && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground mb-2">Avalie o atendimento:</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRating(rating);
                    }}
                  >
                    <Star className="h-3 w-3 text-yellow-400" />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-xl border-l-4 ${getPriorityColor(warranty.status)}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {getStatusIcon(warranty.status)}
              {warranty.title}
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              Protocolo #{warranty.id.padStart(6, '0')} • {format(warranty.createdAt, "dd 'de' MMMM 'de' yyyy")}
            </p>
          </div>
          <StatusBadge status={warranty.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Imóvel:</span>
              <p className="text-sm">{warranty.property} - Unidade {warranty.unit}</p>
            </div>
            {warranty.category && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Categoria:</span>
                <p className="text-sm">{warranty.category}</p>
              </div>
            )}
          </div>
          
          <div>
            <span className="text-sm font-medium text-muted-foreground">Descrição:</span>
            <p className="text-sm text-muted-foreground">{warranty.description}</p>
          </div>
        </div>
        
        {warranty.satisfactionRating && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Avaliação:</span>
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
          </div>
        )}
        
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            Ver Detalhes
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80">
            Acompanhar
          </Button>
          {warranty.status === "complete" && !warranty.satisfactionRating && onRate && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Simular uma avaliação de 5 estrelas para demonstração
                handleRating(5);
              }}
            >
              <Star className="h-4 w-4 mr-1" />
              Avaliar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
