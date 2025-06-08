
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from 'uuid';
import { Plus, AlertTriangle, User, Building, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
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
  
  const selectedClient = form.watch("client");
  const selectedProperty = form.watch("property");
  
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Informações do Cliente e Imóvel */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Informações do Cliente e Imóvel</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Cliente <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{client.name}</span>
                            <span className="text-sm text-muted-foreground">{client.email}</span>
                          </div>
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
              name="property"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Empreendimento <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um empreendimento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockProperties.map(property => (
                        <SelectItem key={property.id} value={property.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{property.name}</span>
                            <span className="text-sm text-muted-foreground">{property.location}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Unidade <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 204, 507, 101A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferência de contato</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Como prefere ser contatado?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="phone">Telefone</SelectItem>
                      <SelectItem value="any">Qualquer um</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da solicitação <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Ex: Problemas de infiltração no banheiro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Problems Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium">Problemas Reportados</h3>
            <p className="text-sm text-muted-foreground mt-1 sm:mt-0">
              Adicione todos os problemas que deseja reportar
            </p>
          </div>
          
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
        </div>
        
        {/* Additional Information Field */}
        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Informações adicionais</FormLabel>
              <FormControl>
                <textarea 
                  className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                  placeholder="Forneça qualquer informação adicional que possa ajudar nossa equipe técnica"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit">
            Enviar solicitação
          </Button>
        </div>
      </form>
    </Form>
  );
}
