
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Plus, 
  Calendar,
  ChevronDown,
  Download,
  InfoIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScheduleInspectionDialog } from "@/components/Inspection/ScheduleInspectionDialog";

interface WarrantyHeaderProps {
  onExportData: () => void;
}

export const WarrantyHeader = ({ onExportData }: WarrantyHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Garantias
        </h1>
        <p className="text-muted-foreground">
          Gerenciamento de solicitações de garantia e assistência técnica
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <ScheduleInspectionDialog 
          triggerButton={
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Agendar Vistoria
            </Button>
          }
        />
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Solicitação
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportData}>
              <Download className="mr-2 h-4 w-4" />
              Exportar dados
            </DropdownMenuItem>
            <DropdownMenuItem>
              <InfoIcon className="mr-2 h-4 w-4" />
              Ver relatório
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
