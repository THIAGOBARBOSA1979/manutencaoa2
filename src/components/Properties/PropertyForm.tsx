
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, MapPin, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres"
  }),
  address: z.string().min(5, {
    message: "O endereço deve ter pelo menos 5 caracteres"
  }),
  city: z.string().min(2, {
    message: "Informe a cidade"
  }),
  state: z.string().min(2, {
    message: "Informe o estado"
  }),
  phase: z.string({
    required_error: "Selecione a fase da obra"
  }),
  description: z.string().optional(),
  status: z.boolean().default(true),
  totalUnits: z.number().min(1).default(1),
});

type FormValues = z.infer<typeof formSchema>;

// Phase options
const phaseOptions = [
  { value: "planning", label: "Planejamento" },
  { value: "foundation", label: "Fundação" },
  { value: "structure", label: "Estrutura" },
  { value: "finishing", label: "Acabamento" },
  { value: "completed", label: "Concluído" },
];

interface PropertyFormProps {
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
}

export function PropertyForm({ onSubmit, onCancel }: PropertyFormProps) {
  // Initialize form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      phase: "",
      description: "",
      status: true,
      totalUnits: 1,
    },
  });
  
  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    if (onSubmit) {
      onSubmit(values);
    } else {
      // Default behavior if no onSubmit is provided
      toast({
        title: "Empreendimento cadastrado",
        description: "O empreendimento foi cadastrado com sucesso.",
      });
      console.log("Form submitted:", values);
      form.reset();
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do empreendimento <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Residencial Vista Verde" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, número, bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Estado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="phase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fase da obra <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a fase" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {phaseOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="totalUnits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total de unidades <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Informações adicionais sobre o empreendimento"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Status do empreendimento
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Define se o empreendimento está ativo ou inativo no sistema
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit">
            Cadastrar Empreendimento
          </Button>
        </div>
      </form>
    </Form>
  );
}
