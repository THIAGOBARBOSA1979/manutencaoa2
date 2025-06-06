
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { ClientData } from "@/services/ClientAreaBusinessRules";

// Form schema with validation
const formSchema = z.object({
  clientId: z.string({
    required_error: "Selecione um cliente"
  }),
  username: z.string().min(3, {
    message: "Nome de usuário deve ter pelo menos 3 caracteres"
  }),
  sendByEmail: z.boolean().default(true),
  temporaryPassword: z.boolean().default(true),
  customPassword: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface GenerateCredentialsFormProps {
  clients: ClientData[];
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
}

export function GenerateCredentialsForm({ 
  clients, 
  onSubmit, 
  onCancel 
}: GenerateCredentialsFormProps) {
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  
  // Initialize form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      username: "",
      sendByEmail: true,
      temporaryPassword: true,
      customPassword: "",
    },
  });
  
  // Watch form values for conditional rendering
  const temporaryPassword = form.watch("temporaryPassword");
  
  // Update client data when selection changes
  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      // Generate suggested username
      const username = client.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      form.setValue("username", username);
    }
  };
  
  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    if (onSubmit) {
      onSubmit(values);
    } else {
      // Default behavior if no onSubmit is provided
      toast({
        title: "Credenciais geradas",
        description: "As credenciais de acesso foram geradas e enviadas ao cliente.",
      });
      console.log("Form submitted:", values);
      form.reset();
      setSelectedClient(null);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente <span className="text-destructive">*</span></FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleClientChange(value);
                  }} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.property} {client.unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {selectedClient && (
            <>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Informações do Cliente</h4>
                <p className="text-sm text-muted-foreground">Email: {selectedClient.email}</p>
                <p className="text-sm text-muted-foreground">Telefone: {selectedClient.phone}</p>
                <p className="text-sm text-muted-foreground">Imóvel: {selectedClient.property} - {selectedClient.unit}</p>
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de usuário <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome de usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sendByEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Enviar credenciais por email
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        As credenciais serão enviadas automaticamente para o email do cliente
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="temporaryPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Senha temporária
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        O sistema irá gerar uma senha temporária que deve ser alterada no primeiro acesso
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {!temporaryPassword && (
                <FormField
                  control={form.control}
                  name="customPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha personalizada <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Digite uma senha" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </>
          )}
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={!selectedClient}>
            Gerar Credenciais
          </Button>
        </div>
      </form>
    </Form>
  );
}
