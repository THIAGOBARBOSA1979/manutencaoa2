
import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Filter, MapPin, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Mock data for appointments
const appointments = [
  {
    id: "1",
    title: "Vistoria de entrega",
    property: "Edifício Aurora",
    unit: "507",
    client: "Carlos Silva",
    date: new Date(2025, 4, 19, 10, 0),
    type: "inspection",
  },
  {
    id: "2",
    title: "Vistoria de entrega",
    property: "Edifício Aurora",
    unit: "204",
    client: "Maria Oliveira",
    date: new Date(2025, 4, 19, 14, 30),
    type: "inspection",
  },
  {
    id: "3",
    title: "Atendimento técnico",
    property: "Residencial Bosque Verde",
    unit: "102",
    client: "Roberto Pereira",
    date: new Date(2025, 4, 18, 9, 0),
    type: "warranty",
  },
  {
    id: "4",
    title: "Vistoria pré-entrega",
    property: "Condomínio Monte Azul",
    unit: "301",
    client: "Juliana Costa",
    date: new Date(2025, 4, 18, 15, 0),
    type: "inspection",
  },
  {
    id: "5",
    title: "Atendimento técnico",
    property: "Residencial Bosque Verde",
    unit: "405",
    client: "Fernando Martins",
    date: new Date(2025, 4, 20, 10, 30),
    type: "warranty",
  },
  {
    id: "6",
    title: "Entrega de chaves",
    property: "Edifício Aurora",
    unit: "602",
    client: "Luciana Santos",
    date: new Date(2025, 4, 22, 11, 0),
    type: "inspection",
  },
];

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedView, setSelectedView] = useState("calendar");

  // Filter appointments for the selected date
  const filteredAppointments = date 
    ? appointments.filter(appointment => 
        appointment.date.getDate() === date.getDate() &&
        appointment.date.getMonth() === date.getMonth() &&
        appointment.date.getFullYear() === date.getFullYear()
      )
    : [];

  // Function to get appointments for a specific date (for highlighting days with appointments)
  const getAppointmentsForDate = (day: Date) => {
    return appointments.filter(appointment => 
      appointment.date.getDate() === day.getDate() &&
      appointment.date.getMonth() === day.getMonth() &&
      appointment.date.getFullYear() === day.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarIcon />
            Agendamentos
          </h1>
          <p className="text-muted-foreground">
            Gestão de agendamentos de vistorias e atendimentos técnicos
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* View selection tabs */}
      <Tabs defaultValue="calendar" value={selectedView} onValueChange={setSelectedView}>
        <TabsList>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Calendário de Agendamentos</CardTitle>
                <CardDescription>
                  Selecione uma data para ver os agendamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  modifiers={{
                    hasAppointment: (day) => getAppointmentsForDate(day).length > 0,
                  }}
                  modifiersClassNames={{
                    hasAppointment: "bg-primary/20 font-bold",
                  }}
                />
              </CardContent>
            </Card>

            {/* Appointments for selected date */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Agendamentos para {date ? format(date, "dd/MM/yyyy") : "hoje"}
                </CardTitle>
                <CardDescription>
                  {filteredAppointments.length} agendamentos encontrados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredAppointments.length === 0 ? (
                  <div className="text-center p-6 text-muted-foreground">
                    Nenhum agendamento para esta data
                  </div>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{appointment.title}</h3>
                        <Badge variant={appointment.type === "inspection" ? "default" : "secondary"}>
                          {appointment.type === "inspection" ? "Vistoria" : "Garantia"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin size={14} />
                        <span>{appointment.property} - Unidade {appointment.unit}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <User size={14} />
                        <span>{appointment.client}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarIcon size={14} />
                        <span>{format(appointment.date, "HH:mm")}</span>
                      </div>
                      <div className="pt-2 flex justify-end">
                        <Button variant="outline" size="sm">Ver detalhes</Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="inspection">Vistorias</SelectItem>
                <SelectItem value="warranty">Garantias</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-properties">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Empreendimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-properties">Todos</SelectItem>
                <SelectItem value="aurora">Edifício Aurora</SelectItem>
                <SelectItem value="bosque">Residencial Bosque Verde</SelectItem>
                <SelectItem value="monte">Condomínio Monte Azul</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>

          {/* Appointment list */}
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={appointment.type === "inspection" ? "default" : "secondary"}>
                        {appointment.type === "inspection" ? "Vistoria" : "Garantia"}
                      </Badge>
                      <h3 className="font-medium">{appointment.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin size={14} />
                      <span>{appointment.property} - Unidade {appointment.unit}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User size={14} />
                      <span>{appointment.client}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <CalendarIcon size={14} />
                      <span>{format(appointment.date, "dd/MM/yyyy 'às' HH:mm")}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Ver detalhes</Button>
                    <Button variant="default" size="sm">Editar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calendar;
