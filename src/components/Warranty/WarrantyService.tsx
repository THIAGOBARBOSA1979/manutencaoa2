
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { User, Calendar, Clock, FileText, Upload, ShieldCheck } from "lucide-react";
import { EnhancedForm } from "@/components/ui/enhanced-form";
import { FormSection } from "@/components/ui/form-section";
import { FormActions } from "@/components/ui/form-actions";
import { BaseField, FloatingLabelInput } from "@/components/ui/form-field";

interface WarrantyServiceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warrantyId: string;
  warrantyTitle: string;
}

const formSchema = z.object({
  technician: z.string({ required_error: "Selecione um técnico" }),
  date: z.string({ required_error: "Selecione uma data" }),
  time: z.string({ required_error: "Selecione um horário" }),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  materials: z.string().optional(),
  status: z.enum(["in_progress", "pending", "rescheduled", "completed"]),
  finalObservation: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Mock data for technicians
const technicians = [
  { id: "1", name: "João Silva", specialty: "Hidráulica" },
  { id: "2", name: "Maria Oliveira", specialty: "Elétrica" },
  { id: "3", name: "Carlos Santos", specialty: "Estrutural" },
  { id: "4", name: "Ana Pereira", specialty: "Acabamentos" },
];

const WarrantyService: React.FC<WarrantyServiceProps> = ({
  open,
  onOpenChange,
  warrantyId,
  warrantyTitle,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      technician: "",
      date: "",
      time: "09:00",
      description: "",
      materials: "",
      status: "in_progress",
      finalObservation: "",
    },
  });

  const status = form.watch("status");

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      console.log("Form data:", data);
      console.log("Files:", files);

      // Mock webhook trigger
      const webhookEvent = data.status === "completed" ? "garantia_concluida" : "garantia_em_atendimento";
      console.log(`Triggering webhook: ${webhookEvent}`);

      toast({
        title: data.status === "completed" ? "Garantia concluída" : "Garantia em atendimento",
        description: data.status === "completed" 
          ? "O atendimento da garantia foi concluído com sucesso."
          : "O atendimento da garantia foi iniciado.",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar o atendimento.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setFiles([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Atender Solicitação de Garantia
          </DialogTitle>
          <DialogDescription>
            {warrantyTitle} (#{warrantyId})
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <EnhancedForm variant="minimal">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormSection
                  title="Responsável pelo Atendimento"
                  description="Defina o técnico responsável pelo atendimento"
                  icon={<User className="h-5 w-5" />}
                  variant="card"
                >
                  <FormField
                    control={form.control}
                    name="technician"
                    render={({ field, fieldState }) => (
                      <BaseField
                        label="Técnico Responsável"
                        required
                        error={fieldState.error?.message}
                        success={!fieldState.error && !!field.value}
                      >
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className={fieldState.error ? "border-destructive" : ""}>
                            <SelectValue placeholder="Selecione um técnico" />
                          </SelectTrigger>
                          <SelectContent>
                            {technicians.map((tech) => (
                              <SelectItem key={tech.id} value={tech.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{tech.name}</span>
                                  <span className="text-xs text-muted-foreground">Especialidade: {tech.specialty}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </BaseField>
                    )}
                  />
                </FormSection>

                <FormSection
                  title="Agendamento"
                  description="Data e horário do atendimento"
                  icon={<Calendar className="h-5 w-5" />}
                  variant="card"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field, fieldState }) => (
                        <BaseField
                          label="Data do Atendimento"
                          required
                          error={fieldState.error?.message}
                          success={!fieldState.error && !!field.value}
                        >
                          <FloatingLabelInput
                            {...field}
                            type="date"
                            label="Data do Atendimento"
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
                  </div>
                </FormSection>

                <FormSection
                  title="Detalhes do Atendimento"
                  description="Informações sobre o serviço realizado"
                  icon={<FileText className="h-5 w-5" />}
                  variant="card"
                >
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                      <BaseField
                        label="Descrição do Atendimento"
                        required
                        error={fieldState.error?.message}
                        success={!fieldState.error && field.value?.length >= 10}
                        hint="Descreva as ações realizadas durante o atendimento"
                      >
                        <Textarea
                          {...field}
                          placeholder="Descreva as ações realizadas durante o atendimento..."
                          className="min-h-[100px] resize-y"
                        />
                      </BaseField>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="materials"
                    render={({ field, fieldState }) => (
                      <BaseField
                        label="Materiais Utilizados"
                        error={fieldState.error?.message}
                        hint="Liste os materiais utilizados (opcional)"
                      >
                        <Textarea
                          {...field}
                          placeholder="Liste os materiais utilizados (opcional)"
                          className="min-h-[80px] resize-y"
                        />
                      </BaseField>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field, fieldState }) => (
                      <BaseField
                        label="Status do Atendimento"
                        required
                        error={fieldState.error?.message}
                        success={!fieldState.error && !!field.value}
                      >
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in_progress">Em Andamento</SelectItem>
                            <SelectItem value="pending">Pendente de Peças/Materiais</SelectItem>
                            <SelectItem value="rescheduled">Reagendado</SelectItem>
                            <SelectItem value="completed">Concluído</SelectItem>
                          </SelectContent>
                        </Select>
                      </BaseField>
                    )}
                  />

                  {status === "completed" && (
                    <FormField
                      control={form.control}
                      name="finalObservation"
                      render={({ field, fieldState }) => (
                        <BaseField
                          label="Observações Finais"
                          error={fieldState.error?.message}
                          hint="Descreva as observações finais do atendimento"
                        >
                          <Textarea
                            {...field}
                            placeholder="Descreva as observações finais do atendimento..."
                            className="min-h-[80px] resize-y"
                          />
                        </BaseField>
                      )}
                    />
                  )}
                </FormSection>

                <FormActions
                  onCancel={handleCancel}
                  submitText={status === "completed" ? "Finalizar Atendimento" : "Registrar Atendimento"}
                  cancelText="Cancelar"
                  loading={isSubmitting}
                  disabled={!form.formState.isValid}
                  variant="floating"
                />
              </form>
            </Form>
          </EnhancedForm>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WarrantyService;
