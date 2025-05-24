
import { format } from "date-fns";
import { Calendar, User, MapPin, Eye, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../shared/StatusBadge";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ScheduleInspectionDialog } from "./ScheduleInspectionDialog";

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
  const navigate = useNavigate();
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  
  const handleViewDetails = () => {
    // In a real application, this would navigate to a details page
    console.log(`View details for inspection ${inspection.id}`);
    // navigate(`/inspections/${inspection.id}`);
  };
  
  const propertyInfo = {
    property: inspection.property,
    unit: inspection.unit,
    client: inspection.client
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg flex flex-col md:flex-row gap-6 md:items-center justify-between transition-all duration-200 hover:bg-accent/5">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <MapPin size={16} className="text-primary" />
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
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleViewDetails}
        >
          <Eye className="h-4 w-4 mr-2" /> 
          Detalhes
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setRescheduleDialogOpen(true)}>
              Reagendar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Cancel inspection")}>
              Cancelar vistoria
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Send reminder")}>
              Enviar lembrete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Reschedule Dialog */}
      {rescheduleDialogOpen && (
        <ScheduleInspectionDialog
          triggerButton={<div style={{ display: 'none' }}></div>}
          propertyInfo={propertyInfo}
        />
      )}
    </div>
  );
};
