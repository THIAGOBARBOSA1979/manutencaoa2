
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Building, User, Calendar, Lock } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { EnhancedForm } from "@/components/ui/enhanced-form";
import { FormSection } from "@/components/ui/form-section";
import { FormActions } from "@/components/ui/form-actions";
import { BaseField, FloatingLabelInput } from "@/components/ui/form-field";
import { mockProperties } from "@/services/SharedDataService";

const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres").max(100, "Título muito longo"),
  description: z.string().optional(),
  category: z.enum(["contract", "invoice", "report", "certificate", "other"]),
  property: z.string({ required_error: "Selecione um empreendimento" }),
  client: z.string().optional(),
  expirationDate: z.string().optional(),
  isPublic: z.boolean().default(false),
  isRequired: z.boolean().default(false),
  tags: z.string().optional(),
  accessLevel: z.enum(["public", "restricted", "confidential"]),
});

type FormValues = z.infer<typeof formSchema>;

const categories = [
  { id: "contract", name: "Contrato", description: "Contratos e acordos" },
  { id: "invoice", name: "Fatura", description: "Faturas e recibos" },
  { id: "report", name: "Relatório", description: "Relatórios técnicos" },
  { id: "certificate", name: "Certificado", description: "Certificados e atestados" },
  { id: "other", name: "Outros", description: "Outros documentos" }
];

const clients = [
  { id: "1", name: "Maria Oliveira", email: "maria@email.com" },
  { id: "2", name: "João Silva", email: "joao@email.com" },
  { id: "3", name: "Carlos Santos", email: "carlos@email.com" },
  { id: "4", name: "Ana Costa", email: "ana@email.com" }
];

interface EnhancedDocumentFormProps {
  document?: Partial<FormValues>;
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function EnhancedDocumentForm({ document, onSubmit, onCancel, isEditing = false }: EnhancedDocumentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: document?.title || "",
      description: document?.description || "",
      category: document?.category || "other",
      property: document?.property || "",
      client: document?.client || "",
      expirationDate: document?.expirationDate || "",
      isPublic: document?.isPublic || false,
      isRequired: document?.isRequired || false,
      tags: document?.tags || "",
      accessLevel: document?.accessLevel || "restricted",
    },
  });
  
  const selectedCategory = form.watch("category");
  
  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        toast({
          title: isEditing ? "Documento atualizado" : "Documento criado",
          description: isEditing ? "O documento foi atualizado com sucesso." : "O documento foi criado com sucesso.",
        });
        console.log("Form submitted:", values);
        if (!isEditing) {
          form.reset();
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: isEditing ? "Ocorreu um erro ao atualizar o documento." : "Ocorreu um erro ao criar o documento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <EnhancedForm
      title={isEditing ? "Editar Documento" : "Novo Documento"}
      description={isEditing ? "Atualize as informações do documento" : "Cadastre um novo documento no sistema"}
      variant="minimal"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormSection
            title="Informações Básicas"
            description="Dados principais do documento"
            icon={<FileText className="h-5 w-5" />}
            variant="card"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Título do documento"
                  required
                  error={fieldState.error?.message}
                  success={!fieldState.error && field.value?.length > 2}
                  hint="Nome descritivo para identificação do documento"
                >
                  <FloatingLabelInput
                    {...field}
                    label="Título do documento"
                    placeholder="Ex: Contrato de Compra e Venda - Apto 204"
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
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{category.name}</span>
                              <span className="text-xs text-muted-foreground">{category.description}</span>
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
                name="accessLevel"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Nível de acesso"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                    hint="Define quem pode visualizar o documento"
                  >
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível de acesso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Público - Todos podem ver</SelectItem>
                        <SelectItem value="restricted">Restrito - Apenas usuários autorizados</SelectItem>
                        <SelectItem value="confidential">Confidencial - Apenas administradores</SelectItem>
                      </SelectContent>
                    </Select>
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
                  hint="Descrição detalhada do conteúdo do documento"
                >
                  <Textarea 
                    {...field}
                    placeholder="Ex: Contrato de compra e venda da unidade 204 do Edifício Aurora..."
                    className="min-h-[100px] resize-y"
                  />
                </BaseField>
              )}
            />
          </FormSection>

          <FormSection
            title="Vinculação"
            description="Associe o documento a empreendimentos e clientes"
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
                name="client"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Cliente (opcional)"
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                    hint="Deixe em branco se for um documento geral"
                  >
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
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
            </div>
          </FormSection>

          <FormSection
            title="Configurações Adicionais"
            description="Opções avançadas do documento"
            icon={<Calendar className="h-5 w-5" />}
            variant="card"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Data de expiração"
                    error={fieldState.error?.message}
                    hint="Quando o documento perde validade (opcional)"
                  >
                    <FloatingLabelInput
                      {...field}
                      type="date"
                      label="Data de expiração"
                      error={fieldState.error?.message}
                    />
                  </BaseField>
                )}
              />
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Tags"
                    error={fieldState.error?.message}
                    hint="Palavras-chave separadas por vírgula"
                  >
                    <FloatingLabelInput
                      {...field}
                      label="Tags"
                      placeholder="Ex: contrato, venda, apartamento"
                      error={fieldState.error?.message}
                    />
                  </BaseField>
                )}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm">Configurações de Acesso</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <span className="text-sm font-medium">Documento público</span>
                        <p className="text-xs text-muted-foreground">Visível no portal do cliente</p>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isRequired"
                  render={({ field }) => (
                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <span className="text-sm font-medium">Documento obrigatório</span>
                        <p className="text-xs text-muted-foreground">Necessário para conclusão do processo</p>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </FormSection>
          
          <FormActions
            onCancel={onCancel}
            submitText={isEditing ? "Atualizar Documento" : "Criar Documento"}
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
