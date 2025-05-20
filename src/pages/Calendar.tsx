
import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Filter, MapPin, User, Home, Check, X, Clock, AlertCircle, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { ScheduleInspectionDialog } from "@/components/Inspection/ScheduleInspectionDialog";

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
    status: "pending"
  },
  {
    id: "2",
    title: "Vistoria de entrega",
    property: "Edifício Aurora",
    unit: "204",
    client: "Maria Oliveira",
    date: new Date(2025, 4, 19, 14, 30),
    type: "inspection",
    status: "confirmed"
  },
  {
    id: "3",
    title: "Atendimento técnico",
    property: "Residencial Bosque Verde",
    unit: "102",
    client: "Roberto Pereira",
    date: new Date(2025, 4, 18, 9, 0),
    type: "warranty",
    status: "completed"
  },
  {
    id: "4",
    title: "Vistoria pré-entrega",
    property: "Condomínio Monte Azul",
    unit: "301",
    client: "Juliana Costa",
    date: new Date(2025, 4, 18, 15, 0),
    type: "inspection",
    status: "confirmed"
  },
  {
    id: "5",
    title: "Atendimento técnico",
    property: "Residencial Bosque Verde",
    unit: "405",
    client: "Fernando Martins",
    date: new Date(2025, 4, 20, 10, 30),
    type: "warranty",
    status: "pending"
  },
  {
    id: "6",
    title: "Entrega de chaves",
    property: "Edifício Aurora",
    unit: "602",
    client: "Luciana Santos",
    date: new Date(2025, 4, 22, 11, 0),
    type: "inspection",
    status: "cancelled"
  },
];

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedView, setSelectedView] = useState("calendar");
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterProperty, setFilterProperty] = useState("all-properties");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();
  
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

  // Get appointment status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="flex gap-1"><Clock className="h-3 w-3" />Pendente</Badge>;
      case "confirmed":
        return <Badge variant="default" className="bg-green-600 flex gap-1"><Check className="h-3 w-3" />Confirmado</Badge>;
      case "cancelled":
        return <Badge variant="destructive" className="flex gap-1"><X className="h-3 w-3" />Cancelado</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-blue-600 flex gap-1"><FileCheck className="h-3 w-3" />Concluído</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };
  
  // Get appointment type badge
  const getTypeBadge = (type: string) => {
    return type === "inspection"
      ? <Badge variant="secondary" className="bg-violet-100 text-violet-800 hover:bg-violet-200">Vistoria</Badge>
      : <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">Garantia</Badge>;
  };

  // Get appointment details
  const getAppointmentDetails = (id: string) => {
    return appointments.find(a => a.id === id);
  };

  // Handle appointment status change
  const handleStatusChange = (id: string, newStatus: string) => {
    toast({
      title: "Status atualizado",
      description: `O status do agendamento foi alterado para ${newStatus}`,
    });
  };

  // Handle appointment view
  const handleViewAppointment = (id: string) => {
    setSelectedAppointment(id);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
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
              <DropdownMenuItem onClick={() => setSelectedView("calendar")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Calendário
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedView("list")}>
                <FileCheck className="mr-2 h-4 w-4" />
                Lista
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>
                    Agendamentos para {date ? format(date, "dd/MM/yyyy") : "hoje"}
                  </CardTitle>
                  <CardDescription>
                    {filteredAppointments.length} agendamentos encontrados
                  </CardDescription>
                </div>
                {date && (
                  <ScheduleInspectionDialog
                    triggerButton={
                      <Button size="sm" variant="ghost">
                        <Plus className="h-4 w-4" />
                      </Button>
                    }
                  />
                )}
              </CardHeader>
              <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                {filteredAppointments.length === 0 ? (
                  <div className="text-center p-6 text-muted-foreground">
                    <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                    <h3 className="font-medium mb-1">Nenhum agendamento</h3>
                    <p className="text-sm">Não há agendamentos para esta data</p>
                  </div>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4 space-y-3 hover:bg-accent/5 transition-colors">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{appointment.title}</h3>
                        {getTypeBadge(appointment.type)}
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{format(appointment.date, "HH:mm")}</span>
                        <span className="mx-1">•</span>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin size={14} />
                        <span>{appointment.property} - Unidade {appointment.unit}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <User size={14} />
                        <span>{appointment.client}</span>
                      </div>
                      
                      <div className="pt-2 flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewAppointment(appointment.id)}
                        >
                          Ver detalhes
                        </Button>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select 
              defaultValue={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="inspection">Vistorias</SelectItem>
                <SelectItem value="warranty">Garantias</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              defaultValue={filterProperty}
              onValueChange={setFilterProperty}
            >
              <SelectTrigger>
                <SelectValue placeholder="Empreendimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-properties">Todos</SelectItem>
                <SelectItem value="aurora">Edifício Aurora</SelectItem>
                <SelectItem value="bosque">Residencial Bosque Verde</SelectItem>
                <SelectItem value="monte">Condomínio Monte Azul</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              defaultValue={filterStatus}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Appointment list */}
          <div className="space-y-4">
            {getFilteredAppointmentsList().length === 0 ? (
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
              getFilteredAppointmentsList().map((appointment) => (
                <Card key={appointment.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getTypeBadge(appointment.type)}
                          {getStatusBadge(appointment.status)}
                          <h3 className="font-medium">{appointment.title}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin size={14} />
                            <span>{appointment.property} - Unidade {appointment.unit}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <User size={14} />
                            <span>{appointment.client}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <CalendarIcon size={14} />
                            <span>{format(appointment.date, "dd/MM/yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock size={14} />
                            <span>{format(appointment.date, "HH:mm")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end md:self-auto">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewAppointment(appointment.id)}
                        >
                          Ver detalhes
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="default" size="sm">Status</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "Confirmado")}>
                              <Check className="mr-2 h-4 w-4 text-green-600" />
                              Confirmar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "Concluído")}>
                              <FileCheck className="mr-2 h-4 w-4 text-blue-600" />
                              Marcar como concluído
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "Cancelado")}>
                              <X className="mr-2 h-4 w-4 text-red-600" />
                              Cancelar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalhes do Agendamento</DialogTitle>
              <DialogDescription>
                Visualize e gerencie os detalhes do agendamento
              </DialogDescription>
            </DialogHeader>
            
            {(() => {
              const appointment = getAppointmentDetails(selectedAppointment);
              if (!appointment) return null;
              
              return (
                <>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{appointment.title}</h3>
                      {getTypeBadge(appointment.type)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Status</Label>
                        <div className="mt-1">{getStatusBadge(appointment.status)}</div>
                      </div>
                      <div>
                        <Label>Data e Hora</Label>
                        <div className="mt-1 text-sm">{format(appointment.date, "dd/MM/yyyy 'às' HH:mm")}</div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Cliente</Label>
                      <div className="mt-1 text-sm">{appointment.client}</div>
                    </div>
                    
                    <div>
                      <Label>Propriedade</Label>
                      <div className="mt-1 text-sm">{appointment.property} - Unidade {appointment.unit}</div>
                    </div>
                    
                    <div>
                      <Label>Observações</Label>
                      <Textarea 
                        placeholder="Adicionar observações..."
                        className="mt-1"
                      />
                    </div>
                    
                    {appointment.status !== "completed" && appointment.status !== "cancelled" && (
                      <div>
                        <Label>Atualizar Status</Label>
                        <RadioGroup defaultValue={appointment.status} className="mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pending" id="pending" />
                            <Label htmlFor="pending" className="font-normal">Pendente</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="confirmed" id="confirmed" />
                            <Label htmlFor="confirmed" className="font-normal">Confirmado</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="completed" id="completed" />
                            <Label htmlFor="completed" className="font-normal">Concluído</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cancelled" id="cancelled" />
                            <Label htmlFor="cancelled" className="font-normal">Cancelado</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    {appointment.status === "pending" && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          handleStatusChange(appointment.id, "Cancelado");
                          setIsDetailsOpen(false);
                        }}
                      >
                        <X className="mr-2 h-4 w-4" /> Cancelar Agendamento
                      </Button>
                    )}
                    <Button 
                      onClick={() => {
                        toast({
                          title: "Alterações salvas",
                          description: "As alterações no agendamento foram salvas com sucesso.",
                        });
                        setIsDetailsOpen(false);
                      }}
                    >
                      Salvar Alterações
                    </Button>
                  </DialogFooter>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Calendar;
