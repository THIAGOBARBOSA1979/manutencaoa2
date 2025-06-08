
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, MapPin, FileText, Camera, Video, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { EnhancedForm } from "@/components/ui/enhanced-form";
import { FormSection } from "@/components/ui/form-section";
import { FormActions } from "@/components/ui/form-actions";
import { BaseField, FloatingLabelInput } from "@/components/ui/form-field";

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  address: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres"),
  city: z.string().min(2, "Informe a cidade"),
  state: z.string().min(2, "Informe o estado"),
  type: z.string({ required_error: "Selecione o tipo do empreendimento" }),
  status: z.string({ required_error: "Selecione o status da obra" }),
  totalUnits: z.number().min(1, "Deve ter pelo menos 1 unidade"),
  description: z.string().optional(),
  constructionCompany: z.string().optional(),
  registrationNumber: z.string().optional(),
  priceTable: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  additionalInfo: z.string().optional(),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const typeOptions = [
  { value: "residential", label: "Residencial" },
  { value: "commercial", label: "Comercial" },
  { value: "mixed", label: "Misto" },
  { value: "industrial", label: "Industrial" },
];

const statusOptions = [
  { value: "launch", label: "Lançamento" },
  { value: "construction", label: "Em Construção" },
  { value: "finishing", label: "Acabamento" },
  { value: "ready", label: "Pronto para Morar" },
  { value: "delivered", label: "Entregue" },
];

interface EnhancedPropertyFormProps {
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
  initialData?: Partial<FormValues>;
}

export function EnhancedPropertyForm({ onSubmit, onCancel, initialData }: EnhancedPropertyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      type: "",
      status: "",
      totalUnits: 1,
      description: "",
      constructionCompany: "",
      registrationNumber: "",
      priceTable: "",
      videoUrl: "",
      additionalInfo: "",
      isActive: true,
      ...initialData,
    },
  });
  
  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        toast({
          title: "Empreendimento cadastrado",
          description: "O empreendimento foi cadastrado com sucesso.",
        });
        console.log("Form submitted:", values);
        console.log("Selected images:", selectedImages);
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o empreendimento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedImages(prev => [...prev, ...fileArray]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <EnhancedForm
      title={initialData ? "Editar Empreendimento" : "Novo Empreendimento"}
      description="Configure as informações do empreendimento no sistema"
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
                  success={!fieldState.error && field.value?.length > 2}
                >
                  <FloatingLabelInput
                    {...field}
                    label="Nome do empreendimento"
                    placeholder="Ex: Residencial Vista Verde"
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
                        {typeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseField>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Status da obra"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={fieldState.error ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
              name="totalUnits"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Número de unidades"
                  required
                  error={fieldState.error?.message}
                  success={!fieldState.error && field.value > 0}
                  hint="Total de unidades no empreendimento"
                >
                  <Input 
                    type="number" 
                    min={1} 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className={fieldState.error ? "border-destructive" : ""}
                  />
                </BaseField>
              )}
            />
          </FormSection>

          <FormSection
            title="Localização"
            description="Endereço e localização do empreendimento"
            icon={<MapPin className="h-5 w-5" />}
            variant="card"
          >
            <FormField
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Endereço completo"
                  required
                  error={fieldState.error?.message}
                  success={!fieldState.error && field.value?.length > 4}
                >
                  <FloatingLabelInput
                    {...field}
                    label="Endereço completo"
                    placeholder="Rua, número, bairro, CEP"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && field.value?.length > 4}
                  />
                </BaseField>
              )}
            />
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Cidade"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && field.value?.length > 1}
                  >
                    <FloatingLabelInput
                      {...field}
                      label="Cidade"
                      placeholder="Cidade"
                      required
                      error={fieldState.error?.message}
                      success={!fieldState.error && field.value?.length > 1}
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
                    success={!fieldState.error && field.value?.length > 1}
                  >
                    <FloatingLabelInput
                      {...field}
                      label="Estado"
                      placeholder="Estado"
                      required
                      error={fieldState.error?.message}
                      success={!fieldState.error && field.value?.length > 1}
                    />
                  </BaseField>
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title="Informações Adicionais"
            description="Dados complementares e documentação"
            icon={<FileText className="h-5 w-5" />}
            variant="card"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Descrição"
                  error={fieldState.error?.message}
                  hint="Descrição detalhada do empreendimento"
                >
                  <Textarea 
                    {...field}
                    placeholder="Descrição detalhada do empreendimento, características, diferenciais..."
                    rows={4}
                    className={fieldState.error ? "border-destructive" : ""}
                  />
                </BaseField>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="constructionCompany"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Construtora"
                    error={fieldState.error?.message}
                  >
                    <FloatingLabelInput
                      {...field}
                      label="Construtora"
                      placeholder="Nome da construtora responsável"
                      error={fieldState.error?.message}
                    />
                  </BaseField>
                )}
              />
              
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Número do registro"
                    error={fieldState.error?.message}
                    hint="Registro no cartório ou órgão competente"
                  >
                    <FloatingLabelInput
                      {...field}
                      label="Número do registro"
                      placeholder="Ex: RGI 123456"
                      error={fieldState.error?.message}
                    />
                  </BaseField>
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title="Mídias e Documentos"
            description="Galeria de imagens e documentos do empreendimento"
            icon={<Camera className="h-5 w-5" />}
            variant="card"
          >
            <div>
              <BaseField
                label="Galeria de imagens"
                hint="Selecione múltiplas imagens do empreendimento"
              >
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </BaseField>
              
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Vídeo promocional"
                  error={fieldState.error?.message}
                  hint="URL do vídeo no YouTube, Vimeo ou similar"
                >
                  <FloatingLabelInput
                    {...field}
                    label="URL do vídeo"
                    placeholder="https://www.youtube.com/watch?v=..."
                    error={fieldState.error?.message}
                  />
                </BaseField>
              )}
            />

            <FormField
              control={form.control}
              name="priceTable"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Tabela de preços"
                  error={fieldState.error?.message}
                  hint="Link para tabela de preços ou documento"
                >
                  <FloatingLabelInput
                    {...field}
                    label="Tabela de preços"
                    placeholder="Link para tabela de preços ou documento"
                    error={fieldState.error?.message}
                  />
                </BaseField>
              )}
            />
          </FormSection>

          <FormSection
            title="Configurações"
            description="Status e configurações do empreendimento"
            variant="minimal"
          >
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <div className="text-base font-medium">
                      Empreendimento ativo
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Define se o empreendimento está visível e ativo no sistema
                    </div>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
          </FormSection>
          
          <FormActions
            onCancel={onCancel}
            submitText={initialData ? "Atualizar Empreendimento" : "Cadastrar Empreendimento"}
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
