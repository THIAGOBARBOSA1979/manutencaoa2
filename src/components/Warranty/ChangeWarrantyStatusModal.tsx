
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const statusSchema = z.object({
  newStatus: z.string({
    required_error: "Selecione o novo status",
  }),
  reason: z.string().min(10, {
    message: "Informe o motivo da alteração (mínimo 10 caracteres)"
  }),
  notifyClient: z.boolean().default(true),
});

type StatusFormValues = z.infer<typeof statusSchema>;

const statusOptions = [
  { value: "pending", label: "Pendente", description: "Aguardando atendimento" },
  { value: "progress", label: "Em Andamento", description: "Técnico trabalhando na solução" },
  { value: "complete", label: "Concluída", description: "Problema resolvido" },
  { value: "canceled", label: "Cancelada", description: "Solicitação cancelada" }
];

interface ChangeWarrantyStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warranty: any;
  onUpdate?: () => void;
}

export function ChangeWarrantyStatusModal({ open, onOpenChange, warranty, onUpdate }: ChangeWarrantyStatusModalProps) {
  const { toast } = useToast();
  
  const form = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      newStatus: warranty?.status || "",
      reason: "",
      notifyClient: true
    },
  });

  const currentStatus = warranty?.status;
  const selectedStatus = form.watch("newStatus");

  const onSubmit = (data: StatusFormValues) => {
    console.log("Alteração de status:", data);
    
    const newStatusLabel = statusOptions.find(s => s.value === data.newStatus)?.label;
    
    toast({
      title: "Status alterado",
      description: `Status alterado para "${newStatusLabel}"`,
    });
    
    if (data.notifyClient) {
      toast({
        title: "Cliente notificado",
        description: "Cliente foi notificado sobre a alteração",
      });
    }
    
    if (onUpdate) {
      onUpdate();
    }
    onOpenChange(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", className: "bg-amber-100 text-amber-800" },
      progress: { label: "Em Andamento", className: "bg-blue-100 text-blue-800" },
      complete: { label: "Concluída", className: "bg-green-100 text-green-800" },
      canceled: { label: "Cancelada", className: "bg-gray-100 text-gray-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (!warranty) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Alterar Status
          </DialogTitle>
          <DialogDescription>
            Altere o status da solicitação: {warranty.title}
          </DialogDescription>
        </DialogHeader>

        {/* Status atual */}
        <div className="bg-muted p-3 rounded-md">
          <h4 className="font-medium mb-2">Status atual</h4>
          <div className="flex items-center gap-2">
            {getStatusBadge(currentStatus)}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Novo Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o novo status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem 
                          key={status.value} 
                          value={status.value}
                          disabled={status.value === currentStatus}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{status.label}</span>
                            <span className="text-sm text-muted-foreground">{status.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedStatus && selectedStatus !== currentStatus && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  O status será alterado de "{statusOptions.find(s => s.value === currentStatus)?.label}" 
                  para "{statusOptions.find(s => s.value === selectedStatus)?.label}".
                </AlertDescription>
              </Alert>
            )}
            
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo da alteração</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explique o motivo da alteração de status..."
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
                    <FormLabel>Notificar cliente sobre a alteração</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={selectedStatus === currentStatus}
              >
                Alterar Status
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
