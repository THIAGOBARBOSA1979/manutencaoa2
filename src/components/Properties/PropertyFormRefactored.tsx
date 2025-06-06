
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Validation schema following system standards
const propertyFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres").max(500, "Descrição deve ter no máximo 500 caracteres"),
  type: z.enum(["residential", "commercial", "mixed"], {
    required_error: "Selecione o tipo do empreendimento"
  }),
  status: z.enum(["planning", "construction", "finishing", "delivered"], {
    required_error: "Selecione o status do empreendimento"
  }),
  address: z.object({
    street: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, "Bairro deve ter pelo menos 2 caracteres"),
    city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
    state: z.string().length(2, "Estado deve ter 2 caracteres"),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, "CEP deve ter formato válido (00000-000)")
  }),
  totalUnits: z.number().min(1, "Deve ter pelo menos 1 unidade").max(1000, "Máximo de 1000 unidades"),
  totalFloors: z.number().min(1, "Deve ter pelo menos 1 andar").max(100, "Máximo de 100 andares"),
  launchDate: z.date({
    required_error: "Data de lançamento é obrigatória"
  }),
  expectedDelivery: z.date({
    required_error: "Previsão de entrega é obrigatória"
  }),
  manager: z.string().min(2, "Nome do responsável deve ter pelo menos 2 caracteres"),
  contact: z.object({
    phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Telefone deve ter formato (00) 0000-0000"),
    email: z.string().email("Email deve ter formato válido")
  }),
  amenities: z.array(z.string()).optional(),
  hasElevator: z.boolean().default(false),
  hasGarage: z.boolean().default(false),
  hasPool: z.boolean().default(false),
  hasGym: z.boolean().default(false),
  hasSecurity: z.boolean().default(false)
}).refine(data => data.expectedDelivery > data.launchDate, {
  message: "Data de entrega deve ser posterior ao lançamento",
  path: ["expectedDelivery"]
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

interface PropertyFormRefactoredProps {
  onSubmit: (data: PropertyFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<PropertyFormData>;
}

export function PropertyFormRefactored({ onSubmit, onCancel, initialData }: PropertyFormRefactoredProps) {
  const [customAmenity, setCustomAmenity] = useState("");
  
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: undefined,
      status: "planning",
      address: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: ""
      },
      totalUnits: 1,
      totalFloors: 1,
      manager: "",
      contact: {
        phone: "",
        email: ""
      },
      amenities: [],
      hasElevator: false,
      hasGarage: false,
      hasPool: false,
      hasGym: false,
      hasSecurity: false,
      ...initialData
    }
  });

  const watchedAmenities = form.watch("amenities") || [];

  const handleAddAmenity = () => {
    if (customAmenity.trim() && !watchedAmenities.includes(customAmenity.trim())) {
      form.setValue("amenities", [...watchedAmenities, customAmenity.trim()]);
      setCustomAmenity("");
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    form.setValue("amenities", watchedAmenities.filter(a => a !== amenity));
  };

  const predefinedAmenities = [
    "Salão de festas",
    "Playground",
    "Quadra esportiva",
    "Churrasqueira",
    "Jardim",
    "Espaço gourmet",
    "Sauna",
    "Sala de jogos",
    "Bicicletário",
    "Pet place"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Informações Básicas</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Empreendimento <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Residencial Bosque Verde" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="residential">Residencial</SelectItem>
                      <SelectItem value="commercial">Comercial</SelectItem>
                      <SelectItem value="mixed">Misto</SelectItem>
                    </SelectContent>
                  </Select>
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
                <FormLabel>Descrição <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva as principais características do empreendimento..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="planning">Planejamento</SelectItem>
                      <SelectItem value="construction">Em Construção</SelectItem>
                      <SelectItem value="finishing">Acabamento</SelectItem>
                      <SelectItem value="delivered">Entregue</SelectItem>
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
                  <FormLabel>Total de Unidades <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      max="1000"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalFloors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total de Andares <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      max="100"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Endereço</h3>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logradouro <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Rua das Flores" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address.number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="address.complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input placeholder="Bloco A, Lote 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address.neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Centro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="São Paulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="SP" maxLength={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address.zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="00000-000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Cronograma</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="launchDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Lançamento <span className="text-destructive">*</span></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione a data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={ptBR}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedDelivery"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Previsão de Entrega <span className="text-destructive">*</span></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione a data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={ptBR}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Responsável e Contato</h3>
          
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="manager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do responsável" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="contato@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Comodidades</h3>
          
          {/* Quick checkboxes for common amenities */}
          <div className="grid gap-3 md:grid-cols-3">
            <FormField
              control={form.control}
              name="hasElevator"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Elevador
                  </FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hasGarage"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Garagem
                  </FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hasPool"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Piscina
                  </FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hasGym"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Academia
                  </FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hasSecurity"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Portaria 24h
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          {/* Custom amenities */}
          <div className="space-y-3">
            <FormLabel>Outras Comodidades</FormLabel>
            
            {/* Quick add buttons for predefined amenities */}
            <div className="flex flex-wrap gap-2">
              {predefinedAmenities.map(amenity => (
                <Button
                  key={amenity}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-xs",
                    watchedAmenities.includes(amenity) && "bg-primary/10 border-primary"
                  )}
                  onClick={() => {
                    if (watchedAmenities.includes(amenity)) {
                      handleRemoveAmenity(amenity);
                    } else {
                      form.setValue("amenities", [...watchedAmenities, amenity]);
                    }
                  }}
                >
                  {watchedAmenities.includes(amenity) ? "Remover" : "Adicionar"} {amenity}
                </Button>
              ))}
            </div>
            
            {/* Custom amenity input */}
            <div className="flex gap-2">
              <Input
                placeholder="Digite uma comodidade personalizada..."
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddAmenity}
                disabled={!customAmenity.trim() || watchedAmenities.includes(customAmenity.trim())}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Selected amenities display */}
            {watchedAmenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {watchedAmenities.map(amenity => (
                  <div
                    key={amenity}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                  >
                    {amenity}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 w-4 h-4 text-primary hover:text-destructive"
                      onClick={() => handleRemoveAmenity(amenity)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
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
