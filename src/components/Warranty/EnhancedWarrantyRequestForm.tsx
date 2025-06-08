
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from 'uuid';
import { Plus, AlertTriangle, User, Building, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { EnhancedForm } from "@/components/ui/enhanced-form";
import { FormSection } from "@/components/ui/form-section";
import { FormActions } from "@/components/ui/form-actions";
import { BaseField, FloatingLabelInput } from "@/components/ui/form-field";
import { WarrantyProblemItem, WarrantyProblem } from "@/components/Warranty/WarrantyProblemItem";
import { mockProperties } from "@/services/SharedDataService";

// Form schema with validation
const formSchema = z.object({
  client: z.string({
    required_error: "Selecione um cliente",
  }),
  property: z.string({
    required_error: "Selecione um empreendimento",
  }),
  unit: z.string({
    required_error: "Informe a unidade",
  }),
  title: z.string().min(5, {
    message: "O título deve ter pelo menos 5 caracteres"
  }).max(100, {
    message: "O título deve ter no máximo 100 caracteres"
  }),
  contactPreference: z.enum(["email", "phone", "any"]).optional(),
  additionalInfo: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const clients = [
  { id: "1", name: "Maria Oliveira", email: "maria@email.com", phone: "(11) 99999-9999" },
  { id: "2", name: "João Silva", email: "joao@email.com", phone: "(11) 88888-8888" },
  { id: "3", name: "Carlos Santos", email: "carlos@email.com", phone: "(11) 77777-7777" },
  { id: "4", name: "Ana Costa", email: "ana@email.com", phone: "(11) 66666-6666" }
];

interface EnhancedWarrantyRequestFormProps {
  onSubmit?: (data: FormValues & { problems: WarrantyProblem[] }) => void;
  onCancel?: () => void;
}

export function EnhancedWarrantyRequestForm({ onSubmit, onCancel }: EnhancedWarrantyRequestFormProps) {
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
      client: "",
      property: "",
      unit: "",
      title: "",
      contactPreference: "any",
      additionalInfo: ""
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
  
  // Add a new problem
  const addProblem = () => {
    setProblems([
      ...problems,
      {
        id: uuidv4(),
        category: "",
        location: "",
        description: "",
        severity: "moderate",
        photos: []
      }
    ]);
  };
  
  // Remove a problem
  const removeProblem = (index: number) => {
    if (problems.length <= 1) {
      toast({
        title: "Atenção",
        description: "É necessário pelo menos um problema na solicitação",
        variant: "destructive"
      });
      return;
    }
    
    const updatedProblems = [...problems];
    updatedProblems.splice(index, 1);
    setProblems(updatedProblems);
  };
  
  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    // Validate problems
    const invalidProblems = problems.filter(
      problem => !problem.category || !problem.location || !problem.description
    );
    
    if (invalidProblems.length > 0) {
      toast({
        title: "Dados incompletos",
        description: `Por favor, preencha todos os campos obrigatórios dos problemas.`,
        variant: "destructive"
      });
      return;
    }
    
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
      title="Nova Solicitação de Garantia"
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
            
            <div className="grid gap-4 md:grid-cols-2">
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
              
              <FormField
                control={form.control}
                name="contactPreference"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Preferência de contato"
                    error={fieldState.error?.message}
                  >
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Como prefere ser contatado?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">E-mail</SelectItem>
                        <SelectItem value="phone">Telefone</SelectItem>
                        <SelectItem value="any">Qualquer um</SelectItem>
                      </SelectContent>
                    </Select>
                  </BaseField>
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title="Detalhes da Solicitação"
            description="Informações sobre o problema reportado"
            icon={<FileText className="h-5 w-5" />}
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
          </FormSection>
          
          {/* Problems Section */}
          <FormSection
            title="Problemas Reportados"
            description="Adicione todos os problemas que deseja reportar"
            icon={<AlertTriangle className="h-5 w-5" />}
            variant="card"
          >
            {problems.length > 2 && (
              <Alert variant="default" className="bg-amber-50 text-amber-900 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription>
                  Você está reportando múltiplos problemas. Considere agrupar problemas similares ou do mesmo ambiente.
                </AlertDescription>
              </Alert>
            )}
            
            {problems.map((problem, index) => (
              <WarrantyProblemItem
                key={problem.id}
                index={index}
                problem={problem}
                onChange={handleProblemChange}
                onRemove={removeProblem}
              />
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addProblem}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar outro problema
            </Button>
          </FormSection>
          
          <FormSection
            title="Informações Adicionais"
            description="Qualquer informação complementar (opcional)"
            icon={<FileText className="h-5 w-5" />}
            variant="minimal"
          >
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Informações adicionais"
                  error={fieldState.error?.message}
                  hint="Forneça qualquer informação adicional que possa ajudar nossa equipe técnica"
                >
                  <Textarea 
                    {...field}
                    placeholder="Ex: O problema ocorre apenas quando chove, já tentei contatar o zelador..."
                    className="min-h-[100px] resize-y"
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
