
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, MapPin, FileText } from "lucide-react";
import { Form, FormField } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { EnhancedForm } from "@/components/ui/enhanced-form";
import { FormSection } from "@/components/ui/form-section";
import { FormActions } from "@/components/ui/form-actions";
import { BaseField, FloatingLabelInput } from "@/components/ui/form-field";
import { MaskedInput } from "@/components/ui/enhanced-input";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  type: z.enum(["residential", "commercial", "mixed"]),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  state: z.string().min(2, "Estado deve ter pelo menos 2 caracteres"),
  zipCode: z.string().min(8, "CEP deve ter 8 dígitos"),
  totalUnits: z.number().min(1, "Deve ter pelo menos 1 unidade"),
  description: z.string().optional(),
  constructionCompany: z.string().min(2, "Construtora deve ter pelo menos 2 caracteres"),
  deliveryDate: z.string().min(1, "Data de entrega é obrigatória"),
});

type FormValues = z.infer<typeof formSchema>;

const propertyTypes = [
  { value: "residential", label: "Residencial" },
  { value: "commercial", label: "Comercial" },
  { value: "mixed", label: "Misto" },
];

interface PropertyFormProps {
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
  initialData?: Partial<FormValues>;
  isEditing?: boolean;
}

export function PropertyForm({ onSubmit, onCancel, initialData, isEditing = false }: PropertyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "residential",
      address: initialData?.address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zipCode: initialData?.zipCode || "",
      totalUnits: initialData?.totalUnits || 1,
      description: initialData?.description || "",
      constructionCompany: initialData?.constructionCompany || "",
      deliveryDate: initialData?.deliveryDate || "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        onSubmit(values);
      } else {
        toast({
          title: isEditing ? "Empreendimento atualizado" : "Empreendimento criado",
          description: isEditing 
            ? "Empreendimento atualizado com sucesso!"
            : "Novo empreendimento criado com sucesso!",
        });
        
        if (!isEditing) {
          form.reset();
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o empreendimento.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EnhancedForm
      title={isEditing ? "Editar Empreendimento" : "Novo Empreendimento"}
      description={isEditing 
        ? "Atualize as informações do empreendimento"
        : "Cadastre um novo empreendimento no sistema"
      }
      variant="minimal"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormSection
            title="Informações Básicas"
            description="Dados principais do empreendimento"
            icon={<Building className="h-5 w-5" />}
            variant="card"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Nome do empreendimento"
                  required
                  error={fieldState.error?.message}
                  success={!fieldState.error && !!field.value}
                >
                  <FloatingLabelInput
                    {...field}
                    label="Nome do empreendimento"
                    placeholder="Ex: Residencial Village"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  />
                </BaseField>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Tipo"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={fieldState.error ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map(type => (
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
                name="totalUnits"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Total de unidades"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <FloatingLabelInput
                      {...field}
                      type="number"
                      label="Total de unidades"
                      placeholder="100"
                      required
                      error={fieldState.error?.message}
                      success={!fieldState.error && !!field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </BaseField>
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title="Localização"
            description="Endereço completo do empreendimento"
            icon={<MapPin className="h-5 w-5" />}
            variant="card"
          >
            <FormField
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Endereço"
                  required
                  error={fieldState.error?.message}
                  success={!fieldState.error && !!field.value}
                >
                  <FloatingLabelInput
                    {...field}
                    label="Endereço"
                    placeholder="Rua, número, bairro"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  />
                </BaseField>
              )}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="city"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Cidade"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <FloatingLabelInput
                      {...field}
                      label="Cidade"
                      placeholder="São Paulo"
                      required
                      error={fieldState.error?.message}
                      success={!fieldState.error && !!field.value}
                    />
                  </BaseField>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Estado"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <FloatingLabelInput
                      {...field}
                      label="Estado"
                      placeholder="SP"
                      required
                      error={fieldState.error?.message}
                      success={!fieldState.error && !!field.value}
                    />
                  </BaseField>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="CEP"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <MaskedInput
                      {...field}
                      mask="cep"
                      placeholder="00000-000"
                      className={`transition-all duration-200 ${
                        fieldState.error ? "border-destructive" : ""
                      } ${!fieldState.error && field.value ? "border-emerald-500" : ""}`}
                    />
                  </BaseField>
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title="Informações Adicionais"
            description="Dados complementares do empreendimento"
            icon={<FileText className="h-5 w-5" />}
            variant="card"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="constructionCompany"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Construtora"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <FloatingLabelInput
                      {...field}
                      label="Construtora"
                      placeholder="Nome da construtora"
                      required
                      error={fieldState.error?.message}
                      success={!fieldState.error && !!field.value}
                    />
                  </BaseField>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Data de entrega"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <FloatingLabelInput
                      {...field}
                      type="date"
                      label="Data de entrega"
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
                  label="Descrição"
                  error={fieldState.error?.message}
                  hint="Informações adicionais sobre o empreendimento"
                >
                  <Textarea
                    {...field}
                    placeholder="Descreva características, diferenciais ou informações relevantes..."
                    className="min-h-[100px] resize-y"
                  />
                </BaseField>
              )}
            />
          </FormSection>

          <FormActions
            onCancel={onCancel}
            submitText={isEditing ? "Atualizar Empreendimento" : "Criar Empreendimento"}
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
