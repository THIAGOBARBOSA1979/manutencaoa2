
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Phone, Shield, Building } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { EnhancedForm } from "@/components/ui/enhanced-form";
import { FormSection } from "@/components/ui/form-section";
import { FormActions } from "@/components/ui/form-actions";
import { BaseField, FloatingLabelInput } from "@/components/ui/form-field";
import { MaskedInput, PasswordInput } from "@/components/ui/enhanced-input";
import { mockProperties } from "@/services/SharedDataService";

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").max(100, "Nome muito longo"),
  email: z.string().email("Digite um email válido"),
  phone: z.string().min(10, "Digite um telefone válido"),
  document: z.string().min(11, "Digite um CPF válido"),
  role: z.enum(["admin", "manager", "inspector", "client"]),
  department: z.string().optional(),
  properties: z.array(z.string()).optional(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional(),
  confirmPassword: z.string().optional(),
  isActive: z.boolean().default(true),
  canManageUsers: z.boolean().default(false),
  canManageProperties: z.boolean().default(false),
  canManageInspections: z.boolean().default(false),
  canManageWarranties: z.boolean().default(false),
}).refine((data) => {
  if (data.password && data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const departments = [
  { id: "technical", name: "Técnico" },
  { id: "commercial", name: "Comercial" },
  { id: "administrative", name: "Administrativo" },
  { id: "inspection", name: "Vistoria" },
  { id: "warranty", name: "Garantia" }
];

interface EnhancedUserFormProps {
  user?: Partial<FormValues>;
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function EnhancedUserForm({ user, onSubmit, onCancel, isEditing = false }: EnhancedUserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      document: user?.document || "",
      role: user?.role || "client",
      department: user?.department || "",
      properties: user?.properties || [],
      password: "",
      confirmPassword: "",
      isActive: user?.isActive ?? true,
      canManageUsers: user?.canManageUsers || false,
      canManageProperties: user?.canManageProperties || false,
      canManageInspections: user?.canManageInspections || false,
      canManageWarranties: user?.canManageWarranties || false,
    },
  });
  
  const selectedRole = form.watch("role");
  
  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        toast({
          title: isEditing ? "Usuário atualizado" : "Usuário criado",
          description: isEditing ? "O usuário foi atualizado com sucesso." : "O usuário foi criado com sucesso.",
        });
        console.log("Form submitted:", values);
        if (!isEditing) {
          form.reset();
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: isEditing ? "Ocorreu um erro ao atualizar o usuário." : "Ocorreu um erro ao criar o usuário.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <EnhancedForm
      title={isEditing ? "Editar Usuário" : "Novo Usuário"}
      description={isEditing ? "Atualize as informações do usuário" : "Cadastre um novo usuário no sistema"}
      variant="minimal"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormSection
            title="Informações Pessoais"
            description="Dados básicos do usuário"
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
                    placeholder="Ex: João Silva Santos"
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
                    hint="Email para login e comunicação"
                  >
                    <FloatingLabelInput
                      {...field}
                      type="email"
                      label="Email"
                      placeholder="usuario@empresa.com"
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
                  label="CPF"
                  required
                  error={fieldState.error?.message}
                  success={!fieldState.error && field.value?.length >= 11}
                  hint="Apenas números, sem pontos ou traços"
                >
                  <MaskedInput
                    {...field}
                    mask="cpf"
                    placeholder="000.000.000-00"
                    className={fieldState.error ? "border-destructive" : ""}
                  />
                </BaseField>
              )}
            />
          </FormSection>

          <FormSection
            title="Função e Acesso"
            description="Defina o papel e permissões do usuário"
            icon={<Shield className="h-5 w-5" />}
            variant="card"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Função"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={fieldState.error ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione uma função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="manager">Gerente</SelectItem>
                        <SelectItem value="inspector">Inspetor</SelectItem>
                        <SelectItem value="client">Cliente</SelectItem>
                      </SelectContent>
                    </Select>
                  </BaseField>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Departamento"
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                  >
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BaseField>
                )}
              />
            </div>

            {selectedRole === "inspector" && (
              <FormField
                control={form.control}
                name="properties"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="Empreendimentos vinculados"
                    error={fieldState.error?.message}
                    hint="Selecione os empreendimentos que este inspetor pode atender"
                  >
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione os empreendimentos" />
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
            )}

            <div className="space-y-4">
              <h4 className="font-medium text-sm">Permissões do Sistema</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="canManageUsers"
                  render={({ field }) => (
                    <div className="flex items-center justify-between space-x-2">
                      <span className="text-sm font-medium">Gerenciar Usuários</span>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="canManageProperties"
                  render={({ field }) => (
                    <div className="flex items-center justify-between space-x-2">
                      <span className="text-sm font-medium">Gerenciar Empreendimentos</span>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="canManageInspections"
                  render={({ field }) => (
                    <div className="flex items-center justify-between space-x-2">
                      <span className="text-sm font-medium">Gerenciar Vistorias</span>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="canManageWarranties"
                  render={({ field }) => (
                    <div className="flex items-center justify-between space-x-2">
                      <span className="text-sm font-medium">Gerenciar Garantias</span>
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

          {!isEditing && (
            <FormSection
              title="Senha de Acesso"
              description="Defina a senha inicial do usuário"
              icon={<Shield className="h-5 w-5" />}
              variant="card"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <BaseField
                      label="Senha"
                      required={!isEditing}
                      error={fieldState.error?.message}
                      success={!fieldState.error && field.value?.length >= 6}
                      hint="Mínimo de 6 caracteres"
                    >
                      <PasswordInput
                        {...field}
                        placeholder="Digite a senha"
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                    </BaseField>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <BaseField
                      label="Confirmar senha"
                      required={!isEditing}
                      error={fieldState.error?.message}
                      success={!fieldState.error && field.value === form.watch("password") && field.value?.length >= 6}
                    >
                      <PasswordInput
                        {...field}
                        placeholder="Confirme a senha"
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                    </BaseField>
                  )}
                />
              </div>
            </FormSection>
          )}

          <FormSection
            title="Status"
            description="Define se o usuário está ativo no sistema"
            icon={<User className="h-5 w-5" />}
            variant="minimal"
          >
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <span className="text-sm font-medium">Usuário ativo</span>
                    <p className="text-xs text-muted-foreground">Usuários inativos não podem fazer login</p>
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
            submitText={isEditing ? "Atualizar Usuário" : "Criar Usuário"}
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
