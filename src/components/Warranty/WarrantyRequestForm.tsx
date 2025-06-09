
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from 'uuid';
import { AlertTriangle, User, Building, FileText } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { EnhancedForm } from "@/components/ui/enhanced-form";
import { FormSection } from "@/components/ui/form-section";
import { FormActions } from "@/components/ui/form-actions";
import { BaseField, FloatingLabelInput } from "@/components/ui/form-field";
import { WarrantyProblemItem, WarrantyProblem } from "@/components/Warranty/WarrantyProblemItem";
import { mockProperties } from "@/services/SharedDataService";

// Form schema with validation
const formSchema = z.object({
  title: z.string().min(5, {
    message: "O título deve ter pelo menos 5 caracteres"
  }).max(100, {
    message: "O título deve ter no máximo 100 caracteres"
  }),
  category: z.string({
    required_error: "Selecione uma categoria"
  }),
  priority: z.string({
    required_error: "Selecione uma prioridade"
  }),
  description: z.string().min(20, {
    message: "A descrição deve ter pelo menos 20 caracteres"
  }).max(1000, {
    message: "A descrição deve ter no máximo 1000 caracteres"
  }),
  location: z.string().min(3, {
    message: "Informe o ambiente onde ocorre o problema"
  }),
  client: z.string({
    required_error: "Selecione um cliente"
  }),
  property: z.string({
    required_error: "Selecione um empreendimento"
  }),
  unit: z.string({
    required_error: "Informe a unidade"
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Categories for warranty claims
const warrantyCategories = [
  "Hidráulica",
  "Elétrica",
  "Estrutural", 
  "Vedação e Impermeabilização",
  "Acabamento",
  "Esquadrias",
  "Equipamentos",
  "Outros"
];

// Priority options
const priorityOptions = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Crítica" }
];

const clients = [
  { id: "1", name: "Maria Oliveira", email: "maria@email.com", phone: "(11) 99999-9999" },
  { id: "2", name: "João Silva", email: "joao@email.com", phone: "(11) 88888-8888" },
  { id: "3", name: "Carlos Santos", email: "carlos@email.com", phone: "(11) 77777-7777" },
  { id: "4", name: "Ana Costa", email: "ana@email.com", phone: "(11) 66666-6666" }
];

interface WarrantyRequestFormProps {
  onSubmit?: (data: FormValues & { problems: WarrantyProblem[] }) => void;
  onCancel?: () => void;
}

export function WarrantyRequestForm({ onSubmit, onCancel }: WarrantyRequestFormProps) {
  const [problems, setProblems] = useState<WarrantyProblem[]>([
    {
      id: uuidv4(),
      category: "",
      location: "",
      description: "",
      severity: "moderate",
      photos: []
    }
  ]);
  
  // Initialize form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      priority: "medium",
      description: "",
      location: "",
      client: "",
      property: "",
      unit: "",
    },
  });
  
  // Handle problem change
  const handleProblemChange = (index: number, field: keyof WarrantyProblem, value: any) => {
    const updatedProblems = [...problems];
    updatedProblems[index] = {
      ...updatedProblems[index],
      [field]: value
    };
    setProblems(updatedProblems);
  };
  
  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    // Find selected client and property data
    const selectedClientData = clients.find(c => c.id === values.client);
    const selectedPropertyData = mockProperties.find(p => p.id === values.property);
    
    // Combine form values with problems
    const completeData = {
      ...values,
      problems,
      clientData: selectedClientData,
      propertyData: selectedPropertyData
    };
    
    if (onSubmit) {
      onSubmit(completeData);
    } else {
      // Default behavior if no onSubmit is provided
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de garantia foi enviada com sucesso.",
      });
      console.log("Form submitted:", completeData);
      
      // Reset the form
      form.reset();
      setProblems([
        {
          id: uuidv4(),
          category: "",
          location: "",
          description: "",
          severity: "moderate",
          photos: []
        }
      ]);
    }
  };
  
  return (
    <EnhancedForm
      title="Solicitação de Garantia"
      description="Registre problemas encontrados no imóvel para análise da nossa equipe técnica"
      variant="minimal"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormSection
            title="Informações do Cliente e Imóvel"
            description="Identifique o cliente e a propriedade relacionada"
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
          </FormSection>

          <FormSection
            title="Detalhes do Problema"
            description="Informações sobre o problema reportado"
            icon={<AlertTriangle className="h-5 w-5" />}
            variant="card"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Título da solicitação"
                  required
                  error={fieldState.error?.message}
                  success={!fieldState.error && field.value?.length >= 5}
                  hint="Resumo claro do problema encontrado"
                >
                  <FloatingLabelInput
                    {...field}
                    label="Título da solicitação"
                    placeholder="Ex: Problemas de infiltração no banheiro"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && field.value?.length >= 5}
                  />
                </BaseField>
              )}
            />
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Categoria"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={fieldState.error ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {warrantyCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
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
                      <SelectTrigger className={fieldState.error ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseField>
                )}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Ambiente"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <FloatingLabelInput
                      {...field}
                      label="Ambiente"
                      placeholder="Ex: Banheiro da suíte, Cozinha"
                      required
                      error={fieldState.error?.message}
                      success={!fieldState.error && !!field.value}
                    />
                  </BaseField>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Descrição detalhada"
                  required
                  error={fieldState.error?.message}
                  success={!fieldState.error && field.value?.length >= 20}
                  hint="Descreva o problema com o máximo de detalhes possível"
                >
                  <Textarea 
                    {...field}
                    placeholder="Descreva o problema com o máximo de detalhes: quando foi percebido, local exato, sintomas, etc."
                    className="min-h-[120px] resize-y"
                  />
                </BaseField>
              )}
            />
          </FormSection>
          
          <FormActions
            onCancel={onCancel}
            submitText="Enviar Solicitação"
            cancelText="Cancelar"
            loading={false}
            disabled={!form.formState.isValid}
            variant="floating"
          />
        </form>
      </Form>
    </EnhancedForm>
  );
}
