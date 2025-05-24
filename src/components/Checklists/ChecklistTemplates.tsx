
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardCheck, 
  FileText, 
  Download, 
  Star,
  Clock,
  Users,
  Building,
  Wrench,
  Zap,
  Droplets
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  items: number;
  rating: number;
  usageCount: number;
  lastUsed: string;
  icon: any;
  tags: string[];
}

const templates: Template[] = [
  {
    id: "pre-delivery",
    title: "Vistoria Pré-Entrega Completa",
    description: "Checklist abrangente para vistorias antes da entrega ao cliente",
    category: "Vistoria",
    items: 45,
    rating: 4.8,
    usageCount: 127,
    lastUsed: "2 dias atrás",
    icon: Building,
    tags: ["Popular", "Completo", "Recomendado"]
  },
  {
    id: "hydraulic",
    title: "Inspeção Hidráulica",
    description: "Foco em instalações hidráulicas, torneiras e sistemas de água",
    category: "Hidráulica",
    items: 22,
    rating: 4.6,
    usageCount: 89,
    lastUsed: "1 semana atrás",
    icon: Droplets,
    tags: ["Especializado", "Rápido"]
  },
  {
    id: "electrical",
    title: "Verificação Elétrica",
    description: "Checklist para instalações elétricas e sistemas de energia",
    category: "Elétrica",
    items: 28,
    rating: 4.7,
    usageCount: 76,
    lastUsed: "3 dias atrás",
    icon: Zap,
    tags: ["Segurança", "Técnico"]
  },
  {
    id: "maintenance",
    title: "Manutenção Preventiva",
    description: "Rotina de manutenção preventiva para edificações",
    category: "Manutenção",
    items: 35,
    rating: 4.5,
    usageCount: 54,
    lastUsed: "1 mês atrás",
    icon: Wrench,
    tags: ["Preventivo", "Mensal"]
  }
];

interface ChecklistTemplatesProps {
  onSelectTemplate: (template: Template) => void;
  onCreateCustom: () => void;
}

export const ChecklistTemplates = ({ onSelectTemplate, onCreateCustom }: ChecklistTemplatesProps) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Vistoria", "Hidráulica", "Elétrica", "Manutenção"];
  
  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (template: Template) => {
    onSelectTemplate(template);
    toast({
      title: "Template selecionado",
      description: `Usando template: ${template.title}`,
    });
  };

  const handleDownloadTemplate = (template: Template) => {
    toast({
      title: "Download iniciado",
      description: `Baixando template: ${template.title}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Templates de Checklist</h3>
          <p className="text-muted-foreground">Escolha um template pronto ou crie um personalizado</p>
        </div>
        
        <div className="flex gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === "all" ? "Todos" : category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map(template => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{template.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">{template.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span>{template.items} itens</span>
                  <span>{template.usageCount} usos</span>
                  <span>{template.lastUsed}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Usar Template
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDownloadTemplate(template)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-medium mb-2">Criar Template Personalizado</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Crie um checklist personalizado do zero com seus próprios itens
          </p>
          <Button onClick={onCreateCustom}>
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Criar Personalizado
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
