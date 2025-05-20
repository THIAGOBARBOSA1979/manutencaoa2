
import { Card, CardContent } from "@/components/ui/card";
import { AppointmentItem, Appointment } from "./AppointmentItem";
import { CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListViewProps {
  appointments: Appointment[];
  onViewDetails: (id: string) => void;
  filterOptions: {
    filterType: string;
    filterProperty: string;
    filterStatus: string;
  };
}

export function ListView({ appointments, onViewDetails, filterOptions }: ListViewProps) {
  const { filterType, filterProperty, filterStatus } = filterOptions;
  
  // Filter appointments for list view
  const getFilteredAppointmentsList = () => {
    let filtered = [...appointments];
    
    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(a => a.type === filterType);
    }
    
    // Filter by property
    if (filterProperty !== "all-properties") {
      filtered = filtered.filter(a => a.property.toLowerCase().includes(filterProperty.toLowerCase()));
    }
    
    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(a => a.status === filterStatus);
    }
    
    return filtered;
  };

  const filteredAppointments = getFilteredAppointmentsList();

  return (
    <div className="space-y-4">
      {filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <h3 className="font-medium mb-1">Nenhum agendamento encontrado</h3>
            <p className="text-sm text-muted-foreground">Tente ajustar os filtros ou adicionar um novo agendamento</p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        filteredAppointments.map((appointment) => (
          <Card key={appointment.id} className="overflow-hidden">
            <CardContent className="p-0">
              <AppointmentItem 
                appointment={appointment} 
                onViewDetails={onViewDetails}
              />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
