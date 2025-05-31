
import { ClipboardCheck, Calendar as CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleInspectionDialog } from "./ScheduleInspectionDialog";

interface InspectionHeaderProps {
  onViewChange?: (view: "list" | "calendar") => void;
  currentView?: "list" | "calendar";
}

export function InspectionHeader({ onViewChange, currentView = "list" }: InspectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-border/40">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardCheck className="h-8 w-8 text-primary" />
          Agendamentos
        </h1>
        <p className="text-muted-foreground">
          Gerenciamento de vistorias e entregas de unidades
        </p>
      </div>
      <div className="flex gap-2">
        {onViewChange && (
          <Button 
            variant={currentView === "calendar" ? "default" : "outline"} 
            onClick={() => onViewChange("calendar")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendário
          </Button>
        )}
        <ScheduleInspectionDialog />
      </div>
    </div>
  );
}
