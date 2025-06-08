
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const assignSchema = z.object({
  technician: z.string({
    required_error: "Selecione um técnico",
  }),
  notes: z.string().optional(),
  changeStatus: z.boolean().default(true),
});

type AssignFormValues = z.infer<typeof assignSchema>;

const technicians = [
  { id: "1", name: "João Técnico", specialty: "Hidráulica", availability: "Disponível" },
  { id: "2", name: "Pedro Marceneiro", specialty: "Marcenaria", availability: "Disponível" },
  { id: "3", name: "Carlos Eletricista", specialty: "Elétrica", availability: "Ocupado" },
  { id: "4", name: "Ana Pintora", specialty: "Pintura", availability: "Disponível" },
  { id: "5", name: "Roberto Geral", specialty: "Manutenção Geral", availability: "Disponível" }
];

interface AssignTechnicianModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warranty: any;
  onUpdate?: () => void;
}

export function AssignTechnicianModal({ open, onOpenChange, warranty, onUpdate }: AssignTechnicianModalProps) {
  const { toast } = useToast();
  
  const form = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      technician: warranty?.technician || "",
      notes: "",
      changeStatus: true
    },
  });

  const onSubmit = (data: AssignFormValues) => {
    console.log("Atribuição de técnico:", data);
    
    const selectedTechnician = technicians.find(t => t.id === data.technician);
    
    toast({
      title: "Técnico atribuído",
      description: `${selectedTechnician?.name} foi atribuído à solicitação`,
    });
    
    if (data.changeStatus) {
      toast({
        title: "Status alterado",
        description: "Status da solicitação alterado para 'Em andamento'",
      });
    }
    
    if (onUpdate) {
      onUpdate();
    }
    onOpenChange(false);
  };

  const selectedTechnician = form.watch("technician");
  const technicianData = technicians.find(t => t.id === selectedTechnician);

  if (!warranty) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Atribuir Técnico
          </DialogTitle>
          <DialogDescription>
            Selecione um técnico para a solicitação: {warranty.title}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="technician"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Técnico Responsável</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um técnico" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {technicians.map(tech => (
                        <SelectItem key={tech.id} value={tech.id}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <span className="font-medium">{tech.name}</span>
                              <span className="text-sm text-muted-foreground">{tech.specialty}</span>
                            </div>
                            <Badge 
                              variant={tech.availability === "Disponível" ? "default" : "secondary"}
                              className="ml-2"
                            >
                              {tech.availability}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {technicianData && (
              <div className="bg-muted p-3 rounded-md">
                <h4 className="font-medium mb-1">{technicianData.name}</h4>
                <p className="text-sm text-muted-foreground">Especialidade: {technicianData.specialty}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant={technicianData.availability === "Disponível" ? "default" : "secondary"}
                  >
                    {technicianData.availability}
                  </Badge>
                  {technicianData.availability === "Disponível" && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      Pode iniciar imediatamente
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações para o técnico</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Instruções especiais, materiais necessários, etc."
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
              name="changeStatus"
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
                    <FormLabel>Alterar status para "Em andamento"</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Atribuir Técnico
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
