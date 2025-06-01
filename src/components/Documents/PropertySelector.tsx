
import { useState } from "react";
import { Building, Home, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { propertyService, Property } from "@/services/PropertyService";

interface PropertySelectorProps {
  selectedPropertyId?: string;
  onPropertyChange: (propertyId: string | undefined) => void;
  clientName?: string;
  showLabel?: boolean;
  className?: string;
}

export function PropertySelector({
  selectedPropertyId,
  onPropertyChange,
  clientName = "João Silva",
  showLabel = true,
  className = ""
}: PropertySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get client properties (simulate by client name)
  const clientProperties = propertyService.getPropertiesByClient("client-1"); // João Silva
  const selectedProperty = selectedPropertyId 
    ? propertyService.getPropertyById(selectedPropertyId)
    : undefined;

  const handlePropertySelect = (propertyId: string) => {
    onPropertyChange(propertyId === "all" ? undefined : propertyId);
    setIsOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      delivered: { label: "Entregue", variant: "default" as const },
      progress: { label: "Em Andamento", variant: "secondary" as const },
      pending: { label: "Pendente", variant: "outline" as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>;
  };

  return (
    <div className={className}>
      {showLabel && (
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Filtrar por Imóvel
        </label>
      )}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-auto p-3"
            aria-expanded={isOpen}
          >
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-medium">
                  {selectedProperty ? selectedProperty.name : "Todos os imóveis"}
                </div>
                {selectedProperty && (
                  <div className="text-xs text-muted-foreground">
                    {selectedProperty.unit ? `Unidade ${selectedProperty.unit}` : selectedProperty.address}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedProperty && getStatusBadge(selectedProperty.status)}
              <span className="text-xs text-muted-foreground">
                ▼
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-96 p-0" align="start">
          <div className="p-2">
            {/* All properties option */}
            <Card 
              className={`cursor-pointer transition-colors hover:bg-muted/50 mb-2 ${
                !selectedPropertyId ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handlePropertySelect("all")}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Building className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Todos os imóveis</div>
                    <div className="text-xs text-muted-foreground">
                      Ver documentos de todas as propriedades
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {clientProperties.length} imóveis
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Individual properties */}
            <div className="space-y-1">
              {clientProperties.map((property) => (
                <Card 
                  key={property.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedPropertyId === property.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handlePropertySelect(property.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {property.name}
                        </div>
                        {property.unit && (
                          <div className="text-xs text-muted-foreground">
                            Unidade {property.unit}
                          </div>
                        )}
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{property.city}-{property.state}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getStatusBadge(property.status)}
                        <div className="text-xs text-muted-foreground">
                          {property.size}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
