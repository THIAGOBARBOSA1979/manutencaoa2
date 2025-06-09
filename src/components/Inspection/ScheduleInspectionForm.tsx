
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Clock, User, Building, FileText } from "lucide-react";
import { Form, FormField } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { EnhancedForm } from "@/components/ui/enhanced-form";
import { FormSection } from "@/components/ui/form-section";
import { FormActions } from "@/components/ui/form-actions";
import { BaseField, FloatingLabelInput } from "@/components/ui/form-field";
import { mockProperties } from "@/services/SharedDataService";

const formSchema = z.object({
  property: z.string({ required_error: "Selecione um empreendimento" }),
  unit: z.string().min(1, "Unidade é obrigatória"),
  type: z.enum(["delivery", "warranty", "periodic", "maintenance"]),
  inspector: z.string({ required_error: "Selecione um vistoriador" }),
  date: z.string({ required_error: "Data é obrigatória" }),
  time: z.string({ required_error: "Horário é obrigatório" }),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  observations: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const inspectionTypes = [
  { value: "delivery", label: "Entrega" },
  { value: "warranty", label: "Garantia" },
  { value: "periodic", label: "Periódica" },
  { value: "maintenance", label: "Manutenção" },
];

const priorities = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
];

const inspectors = [
  { id: "1", name: "João Silva", specialty: "Estrutural" },
  { id: "2", name: "Maria Santos", specialty: "Elétrica/Hidráulica" },
  { id: "3", name: "Carlos Oliveira", specialty: "Acabamentos" },
];

interface ScheduleInspectionFormProps {
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
  initialData?: Partial<FormValues>;
}

export function ScheduleInspectionForm({ onSubmit, onCancel, initialData }: ScheduleInspectionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      property: initialData?.property || "",
      unit: initialData?.unit || "",
      type: initialData?.type || "delivery",
      inspector: initialData?.inspector || "",
      date: initialData?.date || "",
      time: initialData?.time || "09:00",
      priority: initialData?.priority || "medium",
      observations: initialData?.observations || "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        onSubmit(values);
      } else {
        toast({
          title: "Vistoria agendada",
          description: "A vistoria foi agendada com sucesso!",
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao agendar a vistoria.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EnhancedForm
      title="Agendar Vistoria"
      description="Agende uma nova vistoria no sistema"
      variant="minimal"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormSection
            title="Local da Vistoria"
            description="Selecione o empreendimento e unidade"
            icon={<Building className="h-5 w-5" />}
            variant="card"
          >
            <div className="grid gap-4 md:grid-cols-2">
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

              <FormField
                control={form.control}
                name="unit"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Unidade"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                    hint="Ex: 204, 507, 101A"
                  >
                    <FloatingLabelInput
                      {...field}
                      label="Unidade"
                      placeholder="Ex: 204, 507, 101A"
                      required
                      error={fieldState.error?.message}
                      success={!fieldState.error && !!field.value}
                    />
                  </BaseField>
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title="Tipo e Responsável"
            description="Defina o tipo de vistoria e vistoriador"
            icon={<User className="h-5 w-5" />}
            variant="card"
          >
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
                      <SelectTrigger className={fieldState.error ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {inspectionTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseField>
                )}
              />

              <FormField
                control={form.control}
                name="inspector"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Vistoriador"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={fieldState.error ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione um vistoriador" />
                      </SelectTrigger>
                      <SelectContent>
                        {inspectors.map(inspector => (
                          <SelectItem key={inspector.id} value={inspector.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{inspector.name}</span>
                              <span className="text-xs text-muted-foreground">{inspector.specialty}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseField>
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title="Agendamento"
            description="Data, horário e prioridade"
            icon={<Calendar className="h-5 w-5" />}
            variant="card"
          >
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="date"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Data"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <FloatingLabelInput
                      {...field}
                      type="date"
                      label="Data"
                      required
                      error={fieldState.error?.message}
                      success={!fieldState.error && !!field.value}
                    />
                  </BaseField>
                )}
              />

              <FormField
                control={form.control}
                name="time"
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
                      <SelectTrigger className={fieldState.error ? "border-destructive" : ""}>
                        <SelectValue placeholder="Prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map(priority => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseField>
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title="Observações"
            description="Informações adicionais (opcional)"
            icon={<FileText className="h-5 w-5" />}
            variant="minimal"
          >
            <FormField
              control={form.control}
              name="observations"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Observações"
                  error={fieldState.error?.message}
                  hint="Informações adicionais sobre a vistoria"
                >
                  <Textarea
                    {...field}
                    placeholder="Descreva informações relevantes para a vistoria..."
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
            loading={isSubmitting}
            disabled={!form.formState.isValid}
            variant="floating"
          />
        </form>
      </Form>
    </EnhancedForm>
  );
}
