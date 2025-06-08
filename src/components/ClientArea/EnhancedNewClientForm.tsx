
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Building, Mail, Phone, MapPin, FileText } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { EnhancedForm } from "@/components/ui/enhanced-form";
import { FormSection } from "@/components/ui/form-section";
import { FormActions } from "@/components/ui/form-actions";
import { BaseField, FloatingLabelInput } from "@/components/ui/form-field";
import { MaskedInput } from "@/components/ui/enhanced-input";

// Form schema with enhanced validation
const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").max(100, "Nome muito longo"),
  email: z.string().email("Digite um email válido"),
  phone: z.string().min(10, "Digite um telefone válido"),
  document: z.string().min(11, "Digite um CPF/CNPJ válido"),
  property: z.string({ required_error: "Selecione um empreendimento" }),
  unit: z.string({ required_error: "Informe a unidade" }),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const mockProperties = [
  { id: "1", name: "Edifício Aurora", location: "Centro - São Paulo" },
  { id: "2", name: "Residencial Verde Vida", location: "Vila Madalena - São Paulo" },
  { id: "3", name: "Condomínio Monte Alto", location: "Morumbi - São Paulo" },
];

interface EnhancedNewClientFormProps {
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
}

export function EnhancedNewClientForm({ onSubmit, onCancel }: EnhancedNewClientFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      document: "",
      property: "",
      unit: "",
      address: "",
    },
  });
  
  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        toast({
          title: "Cliente cadastrado",
          description: "O cliente foi cadastrado com sucesso.",
        });
        console.log("Form submitted:", values);
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar o cliente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <EnhancedForm
      title="Cadastro de Cliente"
      description="Preencha as informações do cliente para criar um novo registro no sistema"
      variant="minimal"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormSection
            title="Informações Pessoais"
            description="Dados básicos do cliente"
            icon={<User className="h-5 w-5" />}
            variant="card"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Nome completo"
                  required
                  error={fieldState.error?.message}
                  success={!fieldState.error && field.value?.length > 2}
                  hint="Nome completo como no documento de identidade"
                >
                  <FloatingLabelInput
                    {...field}
                    label="Nome completo"
                    placeholder="Ex: Maria Oliveira Santos"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && field.value?.length > 2}
                  />
                </BaseField>
              )}
            />
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Email"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && field.value?.includes('@')}
                    hint="Email principal para comunicação"
                  >
                    <FloatingLabelInput
                      {...field}
                      type="email"
                      label="Email"
                      placeholder="cliente@email.com"
                      required
                      error={fieldState.error?.message}
                      success={!fieldState.error && field.value?.includes('@')}
                    />
                  </BaseField>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Telefone"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && field.value?.length >= 10}
                    hint="Incluir DDD e número completo"
                  >
                    <MaskedInput
                      {...field}
                      mask="phone"
                      placeholder="(11) 99999-9999"
                      className={fieldState.error ? "border-destructive" : ""}
                    />
                  </BaseField>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="document"
              render={({ field, fieldState }) => (
                <BaseField
                  label="CPF/CNPJ"
                  required
                  error={fieldState.error?.message}
                  success={!fieldState.error && field.value?.length >= 11}
                  hint="Apenas números, sem pontos ou traços"
                >
                  <MaskedInput
                    {...field}
                    mask={field.value?.length > 11 ? "cnpj" : "cpf"}
                    placeholder="000.000.000-00"
                    className={fieldState.error ? "border-destructive" : ""}
                  />
                </BaseField>
              )}
            />
          </FormSection>

          <FormSection
            title="Informações do Imóvel"
            description="Vínculo com empreendimento e unidade"
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
                    hint="Ex: Apto 101, Casa 15, Loja 02"
                  >
                    <FloatingLabelInput
                      {...field}
                      label="Unidade"
                      placeholder="Ex: Apto 101 Bloco A"
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
            title="Informações Adicionais"
            description="Dados complementares (opcional)"
            icon={<MapPin className="h-5 w-5" />}
            variant="minimal"
          >
            <FormField
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Endereço complementar"
                  error={fieldState.error?.message}
                  hint="Endereço completo para correspondência, se diferente do imóvel"
                >
                  <FloatingLabelInput
                    {...field}
                    label="Endereço complementar"
                    placeholder="Rua, número, bairro, cidade - estado"
                    error={fieldState.error?.message}
                  />
                </BaseField>
              )}
            />
          </FormSection>
          
          <FormActions
            onCancel={onCancel}
            submitText="Cadastrar Cliente"
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
