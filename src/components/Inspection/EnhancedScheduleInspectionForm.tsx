
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, User, Building, MapPin, Clock, FileText } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { EnhancedForm } from "@/components/ui/enhanced-form";
import { FormSection } from "@/components/ui/form-section";
import { FormActions } from "@/components/ui/form-actions";
import { BaseField, FloatingLabelInput } from "@/components/ui/form-field";
import { mockProperties } from "@/services/SharedDataService";

const formSchema = z.object({
  client: z.string({ required_error: "Selecione um cliente" }),
  property: z.string({ required_error: "Selecione um empreendimento" }),
  unit: z.string().min(1, "Informe a unidade"),
  inspector: z.string({ required_error: "Selecione um inspetor" }),
  scheduledDate: z.string({ required_error: "Selecione uma data" }),
  scheduledTime: z.string({ required_error: "Selecione um horário" }),
  type: z.enum(["pre-delivery", "delivery", "maintenance"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const clients = [
  { id: "1", name: "Maria Oliveira", email: "maria@email.com", property: "Edifício Aurora" },
  { id: "2", name: "João Silva", email: "joao@email.com", property: "Residencial Bosque Verde" },
  { id: "3", name: "Carlos Santos", email: "carlos@email.com", property: "Condomínio Monte Azul" },
  { id: "4", name: "Ana Costa", email: "ana@email.com", property: "Edifício Aurora" }
];

const inspectors = [
  { id: "1", name: "João Pereira", specialty: "Estrutural" },
  { id: "2", name: "Ana Costa", specialty: "Hidráulica" },
  { id: "3", name: "Carlos Andrade", specialty: "Elétrica" },
  { id: "4", name: "Luiza Mendes", specialty: "Acabamentos" }
];

interface EnhancedScheduleInspectionFormProps {
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
}

export function EnhancedScheduleInspectionForm({ onSubmit, onCancel }: EnhancedScheduleInspectionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: "",
      property: "",
      unit: "",
      inspector: "",
      scheduledDate: "",
      scheduledTime: "",
      type: "pre-delivery",
      priority: "medium",
      description: "",
    },
  });
  
  const selectedClient = form.watch("client");
  const selectedProperty = form.watch("property");
  
  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        toast({
          title: "Vistoria agendada",
          description: "A vistoria foi agendada com sucesso.",
        });
        console.log("Form submitted:", values);
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao agendar a vistoria.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <EnhancedForm
      title="Agendar Nova Vistoria"
      description="Agende uma vistoria com todas as informações necessárias"
      variant="minimal"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormSection
            title="Informações do Cliente e Imóvel"
            description="Vincule a vistoria ao cliente e propriedade"
            icon={<User className="h-5 w-5" />}
            variant="card"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="client"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Cliente"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={fieldState.error ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{client.name}</span>
                              <span className="text-xs text-muted-foreground">{client.email}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseField>
                )}
              />
              
              <FormField
                control={form.control}
                name="property"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Empreendimento"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={fieldState.error ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione um empreendimento" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProperties.map(property => (
                          <SelectItem key={property.id} value={property.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{property.name}</span>
                              <span className="text-xs text-muted-foreground">{property.location}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseField>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="unit"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Unidade"
                  required
                  error={fieldState.error?.message}
                  success={!fieldState.error && !!field.value}
                  hint="Ex: Apto 101, Casa 15, Loja 02"
                >
                  <FloatingLabelInput
                    {...field}
                    label="Unidade"
                    placeholder="Ex: Apto 204 Bloco A"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  />
                </BaseField>
              )}
            />
          </FormSection>

          <FormSection
            title="Agendamento e Responsável"
            description="Defina data, horário e inspetor responsável"
            icon={<Calendar className="h-5 w-5" />}
            variant="card"
          >
            <FormField
              control={form.control}
              name="inspector"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Inspetor responsável"
                  required
                  error={fieldState.error?.message}
                  success={!fieldState.error && !!field.value}
                >
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={fieldState.error ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione um inspetor" />
                    </SelectTrigger>
                    <SelectContent>
                      {inspectors.map(inspector => (
                        <SelectItem key={inspector.id} value={inspector.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{inspector.name}</span>
                            <span className="text-xs text-muted-foreground">Especialidade: {inspector.specialty}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </BaseField>
              )}
            />
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Data da vistoria"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <FloatingLabelInput
                      {...field}
                      type="date"
                      label="Data da vistoria"
                      required
                      error={fieldState.error?.message}
                      success={!fieldState.error && !!field.value}
                    />
                  </BaseField>
                )}
              />
              
              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Horário"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <FloatingLabelInput
                      {...field}
                      type="time"
                      label="Horário"
                      required
                      error={fieldState.error?.message}
                      success={!fieldState.error && !!field.value}
                    />
                  </BaseField>
                )}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Tipo de vistoria"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre-delivery">Pré-entrega</SelectItem>
                        <SelectItem value="delivery">Entrega</SelectItem>
                        <SelectItem value="maintenance">Manutenção</SelectItem>
                      </SelectContent>
                    </Select>
                  </BaseField>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Prioridade"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="critical">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </BaseField>
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title="Observações"
            description="Informações adicionais sobre a vistoria"
            icon={<FileText className="h-5 w-5" />}
            variant="minimal"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Descrição ou observações"
                  error={fieldState.error?.message}
                  hint="Adicione qualquer informação relevante sobre a vistoria"
                >
                  <Textarea 
                    {...field}
                    placeholder="Ex: Verificação especial de infiltrações no banheiro..."
                    className="min-h-[100px] resize-y"
                  />
                </BaseField>
              )}
            />
          </FormSection>
          
          <FormActions
            onCancel={onCancel}
            submitText="Agendar Vistoria"
            cancelText="Cancelar"
            loading={isLoading}
            disabled={!form.formState.isValid}
            variant="floating"
          />
        </form>
      </Form>
    </EnhancedForm>
  );
}
