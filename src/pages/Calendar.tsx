
import { useState } from "react";
import { CalendarIcon, FileCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

// Import our new components
import { CalendarHeader } from "@/components/Calendar/CalendarHeader";
import { CalendarView } from "@/components/Calendar/CalendarView";
import { ListView } from "@/components/Calendar/ListView";
import { CalendarFilters } from "@/components/Calendar/CalendarFilters";
import { AppointmentDetails } from "@/components/Calendar/AppointmentDetails";
import { appointments } from "@/components/Calendar/AppointmentData";
import { Appointment } from "@/components/Calendar/AppointmentItem";

const Calendar = () => {
  const [selectedView, setSelectedView] = useState("calendar");
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterProperty, setFilterProperty] = useState("all-properties");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Handle appointment view
  const handleViewAppointment = (id: string) => {
    setSelectedAppointment(id);
    setIsDetailsOpen(true);
  };

  // Handle appointment status change
  const handleStatusChange = (id: string, newStatus: string) => {
    toast({
      title: "Status atualizado",
      description: `O status do agendamento foi alterado para ${newStatus}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <CalendarHeader onChangeView={setSelectedView} />

      {/* View selection tabs */}
      <Tabs defaultValue="calendar" value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="grid grid-cols-2 w-[300px]">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendário
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Lista
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <CalendarView 
            appointments={appointments}
            onViewDetails={handleViewAppointment}
          />
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <CalendarFilters
            filterType={filterType}
            setFilterType={setFilterType}
            filterProperty={filterProperty}
            setFilterProperty={setFilterProperty}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterSheetOpen={filterSheetOpen}
            setFilterSheetOpen={setFilterSheetOpen}
          />

          {/* Appointment list */}
          <ListView 
            appointments={appointments}
            onViewDetails={handleViewAppointment}
            filterOptions={{ filterType, filterProperty, filterStatus }}
          />
        </TabsContent>
      </Tabs>

      {/* Appointment Details Dialog */}
      <AppointmentDetails
        selectedAppointment={selectedAppointment}
        appointments={appointments as Appointment[]}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default Calendar;
