
import { Card, CardContent } from "@/components/ui/card";
import { InspectionItem } from "./InspectionItem";
import { Button } from "@/components/ui/button";
import { ClipboardCheck } from "lucide-react";

interface Inspection {
  id: string;
  property: string;
  unit: string;
  client: string;
  scheduledDate: Date;
  status: "pending" | "progress" | "complete";
}

interface InspectionListProps {
  inspections: Inspection[];
  isLoading?: boolean;
}

export function InspectionList({ inspections, isLoading = false }: InspectionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (inspections.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma vistoria encontrada</h3>
          <p className="text-muted-foreground mb-4">
            Não há vistorias que correspondam aos filtros selecionados.
          </p>
          <Button variant="outline">Limpar filtros</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {inspections.map((inspection) => (
        <Card 
          key={inspection.id} 
          className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/30"
        >
          <CardContent className="p-0">
            <InspectionItem inspection={inspection} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
