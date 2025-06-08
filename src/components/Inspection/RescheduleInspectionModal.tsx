
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const rescheduleSchema = z.object({
  newDate: z.date({
    required_error: "Selecione a nova data",
  }),
  newTime: z.string({
    required_error: "Selecione o novo horário",
  }),
  reason: z.string().min(10, {
    message: "Informe o motivo do reagendamento (mínimo 10 caracteres)"
  }),
  notifyClient: z.boolean().default(true),
});

type RescheduleFormValues = z.infer<typeof rescheduleSchema>;

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

interface RescheduleInspectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection: any;
  onUpdate?: () => void;
}

export function RescheduleInspectionModal({ open, onOpenChange, inspection, onUpdate }: RescheduleInspectionModalProps) {
  const { toast } = useToast();
  
  const form = useForm<RescheduleFormValues>({
    resolver: zodResolver(rescheduleSchema),
    defaultValues: {
      reason: "",
      notifyClient: true
    },
  });

  const onSubmit = (data: RescheduleFormValues) => {
    console.log("Reagendamento:", data);
    
    toast({
      title: "Vistoria reagendada",
      description: `Nova data: ${format(data.newDate, "dd/MM/yyyy")} às ${data.newTime}`,
    });
    
    if (data.notifyClient) {
      toast({
        title: "Cliente notificado",
        description: "E-mail de reagendamento enviado ao cliente",
      });
    }
    
    if (onUpdate) {
      onUpdate();
    }
    onOpenChange(false);
  };

  if (!inspection) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Reagendar Vistoria
          </DialogTitle>
          <DialogDescription>
            Altere a data e horário da vistoria para {inspection.client}
          </DialogDescription>
        </DialogHeader>

        {/* Informações atuais */}
        <div className="bg-muted p-4 rounded-md">
          <h4 className="font-medium mb-2">Agendamento atual</h4>
          <p className="text-sm">
            <strong>Data:</strong> {format(inspection.scheduledDate, "dd/MM/yyyy", { locale: ptBR })} às {format(inspection.scheduledDate, "HH:mm")}
          </p>
          <p className="text-sm">
            <strong>Local:</strong> {inspection.property} - Unidade {inspection.unit}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="newDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Nova Data</FormLabel>
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
                              <span>Selecionar data</span>
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
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="newTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Novo Horário</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Horário" />
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
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo do reagendamento</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explique o motivo do reagendamento..."
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notifyClient"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Notificar cliente sobre o reagendamento</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Reagendar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
