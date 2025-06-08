
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Check, Info, Search, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { ChecklistSelector } from "./ChecklistSelector";
import { mockProperties, getClientProperty } from "@/services/SharedDataService";

// Schema for form validation
const formSchema = z.object({
  client: z.string({
    required_error: "Selecione um cliente",
  }),
  property: z.string({
    required_error: "Selecione um imóvel",
  }),
  unit: z.string({
    required_error: "Informe a unidade",
  }),
  inspectionType: z.string({
    required_error: "Selecione o tipo de vistoria",
  }),
  date: z.date({
    required_error: "Selecione uma data",
  }),
  time: z.string({
    required_error: "Selecione um horário",
  }),
  technician: z.string({
    required_error: "Selecione um responsável técnico",
  }),
  checklist: z.string({
    required_error: "Selecione um checklist",
  }),
  notes: z.string().optional(),
  notifyClient: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

// Example data - in a real app, these would come from your database
const inspectionTypes = [
  { id: "pre-delivery", name: "Vistoria de Pré-entrega" },
  { id: "delivery", name: "Entrega de chaves" },
  { id: "maintenance", name: "Vistoria de manutenção" },
  { id: "warranty", name: "Vistoria de garantia" }
];

const technicians = [
  { id: "1", name: "Carlos Andrade" },
  { id: "2", name: "Luiza Mendes" },
  { id: "3", name: "Roberto Santos" },
  { id: "4", name: "Ana Costa" },
  { id: "5", name: "João Pereira" }
];

const clients = [
  { id: "1", name: "Maria Oliveira", email: "maria@email.com" },
  { id: "2", name: "João Silva", email: "joao@email.com" },
  { id: "3", name: "Carlos Santos", email: "carlos@email.com" },
  { id: "4", name: "Ana Costa", email: "ana@email.com" }
];

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

export const ScheduleInspectionForm = ({ 
  onSuccess, 
  clientId,
  propertyInfo
}: { 
  onSuccess?: () => void,
  clientId?: string,
  propertyInfo?: {
    property: string;
    unit: string;
    client: string;
  }
}) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: clientId || "",
      property: propertyInfo?.property || "",
      unit: propertyInfo?.unit || "",
      notes: "",
      notifyClient: true
    },
  });

  const selectedClient = form.watch("client");
  const selectedProperty = form.watch("property");

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    
    const selectedClientData = clients.find(c => c.id === data.client);
    const selectedPropertyData = mockProperties.find(p => p.name === data.property);
    
    toast({
      title: "Vistoria agendada com sucesso",
      description: `Vistoria agendada para ${selectedClientData?.name} em ${data.property} - Unidade ${data.unit} no dia ${format(data.date, "dd/MM/yyyy")} às ${data.time}`,
    });
    
    if (data.notifyClient) {
      toast({
        title: "Cliente notificado",
        description: `E-mail de confirmação enviado para ${selectedClientData?.email}`,
      });
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Cliente <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{client.name}</span>
                          <span className="text-sm text-muted-foreground">{client.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="property"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Empreendimento <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um empreendimento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockProperties.map(property => (
                      <SelectItem key={property.id} value={property.name}>
                        <div className="flex flex-col">
                          <span className="font-medium">{property.name}</span>
                          <span className="text-sm text-muted-foreground">{property.location}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidade <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 204, 507, 101A" {...field} />
                </FormControl>
                <FormDescription>
                  Número da unidade no empreendimento
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="inspectionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Vistoria <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {inspectionTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="technician"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável Técnico <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {technicians.map(tech => (
                      <SelectItem key={tech.id} value={tech.id}>{tech.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data da Vistoria <span className="text-destructive">*</span></FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="checklist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Checklist de Verificação <span className="text-destructive">*</span></FormLabel>
              <ChecklistSelector onSelect={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações Gerais</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Informações adicionais sobre a vistoria"
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Instruções especiais, pontos de atenção ou informações relevantes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notifyClient"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Notificar cliente</FormLabel>
                <FormDescription>
                  Enviar e-mail de confirmação para o cliente
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline">Cancelar</Button>
          <Button type="submit">Agendar Vistoria</Button>
        </div>
      </form>
    </Form>
  );
};
