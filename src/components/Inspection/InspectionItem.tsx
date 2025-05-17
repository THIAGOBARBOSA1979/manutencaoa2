
import { format } from "date-fns";
import { Calendar, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../shared/StatusBadge";

interface InspectionItemProps {
  inspection: {
    id: string;
    property: string;
    unit: string;
    client: string;
    scheduledDate: Date;
    status: "pending" | "progress" | "complete";
  };
}

export const InspectionItem = ({ inspection }: InspectionItemProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-slate-100 flex flex-col md:flex-row gap-4 md:items-center justify-between card-hover">
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin size={14} />
          <span>{inspection.property} - Unidade {inspection.unit}</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <User size={14} />
          <span>{inspection.client}</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Calendar size={14} />
          <span>{format(inspection.scheduledDate, "dd/MM/yyyy 'às' HH:mm")}</span>
        </div>
      </div>
      
      <div className="flex gap-3 items-center">
        <StatusBadge status={inspection.status} />
        <Button variant="outline" size="sm">Ver detalhes</Button>
      </div>
    </div>
  );
};
