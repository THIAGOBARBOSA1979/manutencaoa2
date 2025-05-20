
import { CalendarIcon, Plus, Filter, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScheduleInspectionDialog } from "@/components/Inspection/ScheduleInspectionDialog";

interface CalendarHeaderProps {
  onChangeView: (view: string) => void;
}

export function CalendarHeader({ onChangeView }: CalendarHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <CalendarIcon className="h-8 w-8 text-primary" />
          Agendamentos
        </h1>
        <p className="text-muted-foreground">
          Gestão de agendamentos de vistorias e atendimentos técnicos
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <ScheduleInspectionDialog />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Visualizar por
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onChangeView("calendar")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendário
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeView("list")}>
              <FileCheck className="mr-2 h-4 w-4" />
              Lista
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
