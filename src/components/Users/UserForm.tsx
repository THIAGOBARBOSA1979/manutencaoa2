
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Shield, Mail, Phone } from "lucide-react";
import { Form, FormField } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { EnhancedForm } from "@/components/ui/enhanced-form";
import { FormSection } from "@/components/ui/form-section";
import { FormActions } from "@/components/ui/form-actions";
import { BaseField, FloatingLabelInput } from "@/components/ui/form-field";
import { MaskedInput, PasswordInput } from "@/components/ui/enhanced-input";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  role: z.enum(["admin", "inspector", "manager", "client"]),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string(),
  isActive: z.boolean().default(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const roleOptions = [
  { value: "admin", label: "Administrador" },
  { value: "manager", label: "Gerente" },
  { value: "inspector", label: "Vistoriador" },
  { value: "client", label: "Cliente" },
];

interface UserFormProps {
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
  initialData?: Partial<FormValues>;
  isEditing?: boolean;
}

export function UserForm({ onSubmit, onCancel, initialData, isEditing = false }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      role: initialData?.role || "client",
      password: "",
      confirmPassword: "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        onSubmit(values);
      } else {
        toast({
          title: isEditing ? "Usuário atualizado" : "Usuário criado",
          description: isEditing 
            ? "Usuário atualizado com sucesso!"
            : "Novo usuário criado com sucesso!",
        });
        
        if (!isEditing) {
          form.reset();
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o usuário.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EnhancedForm
      title={isEditing ? "Editar Usuário" : "Novo Usuário"}
      description={isEditing 
        ? "Atualize as informações do usuário"
        : "Cadastre um novo usuário no sistema"
      }
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
                  success={!fieldState.error && !!field.value}
                >
                  <FloatingLabelInput
                    {...field}
                    label="Nome completo"
                    placeholder="Digite o nome completo"
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
                name="email"
                render={({ field, fieldState }) => (
                  <BaseField
                    label="E-mail"
                    required
                    error={fieldState.error?.message}
                    success={!fieldState.error && !!field.value}
                    hint="Será usado para login no sistema"
                  >
                    <FloatingLabelInput
                      {...field}
                      type="email"
                      label="E-mail"
                      placeholder="usuario@email.com"
                      required
                      error={fieldState.error?.message}
                      success={!fieldState.error && !!field.value}
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
                    success={!fieldState.error && !!field.value}
                  >
                    <MaskedInput
                      {...field}
                      mask="phone"
                      placeholder="(11) 99999-9999"
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
            title="Permissões e Acesso"
            description="Defina o nível de acesso do usuário"
            icon={<Shield className="h-5 w-5" />}
            variant="card"
          >
            <FormField
              control={form.control}
              name="role"
              render={({ field, fieldState }) => (
                <BaseField
                  label="Perfil de usuário"
                  required
                  error={fieldState.error?.message}
                  success={!fieldState.error && !!field.value}
                  hint="Define as permissões do usuário no sistema"
                >
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={fieldState.error ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
                name="password"
                render={({ field, fieldState }) => (
                  <BaseField
                    label={isEditing ? "Nova senha (opcional)" : "Senha"}
                    required={!isEditing}
                    error={fieldState.error?.message}
                    success={!fieldState.error && field.value?.length >= 8}
                    hint={isEditing ? "Deixe em branco para manter a senha atual" : "Mínimo de 8 caracteres"}
                  >
                    <PasswordInput
                      {...field}
                      placeholder={isEditing ? "Nova senha (opcional)" : "Digite a senha"}
                      className={`transition-all duration-200 ${
                        fieldState.error ? "border-destructive" : ""
                      } ${!fieldState.error && field.value?.length >= 8 ? "border-emerald-500" : ""}`}
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
                    success={!fieldState.error && field.value === form.watch("password") && !!field.value}
                  >
                    <PasswordInput
                      {...field}
                      placeholder="Confirme a senha"
                      className={`transition-all duration-200 ${
                        fieldState.error ? "border-destructive" : ""
                      } ${!fieldState.error && field.value === form.watch("password") && !!field.value ? "border-emerald-500" : ""}`}
                    />
                  </BaseField>
                )}
              />
            </div>
          </FormSection>

          <FormActions
            onCancel={onCancel}
            submitText={isEditing ? "Atualizar Usuário" : "Criar Usuário"}
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
