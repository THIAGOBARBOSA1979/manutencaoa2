import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChecklistItem } from "@/services/ChecklistService";
import { Plus, Search, FileText } from "lucide-react";
import { ChecklistTemplateCard } from "./ChecklistTemplateCard";

interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  itemCount: number;
  isDefault: boolean;
  createdAt: Date;
  items: ChecklistItem[];
}

interface ChecklistTemplatesProps {
  onSelectTemplate: (template: ChecklistTemplate) => void;
  onCreateNew: () => void;
  selectedCategory?: string;
  searchQuery?: string;
}

export function ChecklistTemplates({ 
  onSelectTemplate, 
  onCreateNew, 
  selectedCategory = "all",
  searchQuery = ""
}: ChecklistTemplatesProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  // Templates predefinidos
  const templates: ChecklistTemplate[] = [
    {
      id: "1",
      name: "Vistoria Pré-Entrega",
      description: "Checklist completo para vistoria antes da entrega do imóvel",
      category: "Vistoria",
      itemCount: 25,
      isDefault: true,
      createdAt: new Date(2025, 4, 1),
      items: [
        {
          id: "1",
          text: "Verificar rachaduras nas paredes",
          description: "Estrutural: Verificar rachaduras nas paredes",
          required: true,
          isRequired: true,
          status: 'pending',
          evidence: []
        },
        {
          id: "2", 
          text: "Testar funcionamento de todas as torneiras",
          description: "Hidráulica: Testar funcionamento de todas as torneiras",
          required: true,
          isRequired: true,
          status: 'pending',
          evidence: []
        },
        {
          id: "3",
          text: "Verificar funcionamento de todas as tomadas",
          description: "Elétrica: Verificar funcionamento de todas as tomadas",
          required: true,
          isRequired: true,
          status: 'pending',
          evidence: []
        }
      ]
    },
    {
      id: "2",
      name: "Inspeção de Garantia",
      description: "Verificações durante o período de garantia",
      category: "Garantia",
      itemCount: 18,
      isDefault: true,
      createdAt: new Date(2025, 4, 5),
      items: [
        {
          id: "4",
          text: "Verificar possíveis infiltrações",
          description: "Estrutural: Verificar possíveis infiltrações",
          required: true,
          isRequired: true,
          status: 'pending',
          evidence: []
        },
        {
          id: "5",
          text: "Verificar estado da pintura",
          description: "Acabamento: Verificar estado da pintura",
          required: false,
          isRequired: false,
          status: 'pending',
          evidence: []
        }
      ]
    },
    {
      id: "3",
      name: "Manutenção Preventiva",
      description: "Checklist para manutenção preventiva regular",
      category: "Manutenção",
      itemCount: 15,
      isDefault: false,
      createdAt: new Date(2025, 4, 10),
      items: [
        {
          id: "6",
          text: "Verificar pressão da água",
          description: "Hidráulica: Verificar pressão da água",
          required: true,
          isRequired: true,
          status: 'pending',
          evidence: []
        }
      ]
    }
  ];

  const categories = ["Todos", "Vistoria", "Garantia", "Manutenção"];

  // Use search query from props or local state
  const effectiveSearchQuery = searchQuery || localSearchQuery;

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(effectiveSearchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           selectedCategory === "Todas as Categorias" || 
                           template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDuplicateTemplate = (template: ChecklistTemplate) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Cópia)`,
      isDefault: false,
      createdAt: new Date()
    };
    console.log("Template duplicado:", newTemplate);
  };

  return (
    <div className="space-y-6">
      {/* Header com busca e ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Templates de Checklist</h2>
          <p className="text-muted-foreground text-sm">
            {filteredTemplates.length} templates encontrados
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {!searchQuery && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar templates..."
                className="pl-8 w-full sm:w-64"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
              />
            </div>
          )}
          
          <Button onClick={onCreateNew} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Novo Template
          </Button>
        </div>
      </div>

      {/* Filtros por categoria */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={
              (selectedCategory === "all" && category === "Todos") ||
              selectedCategory === category ? "default" : "outline"
            }
            className="cursor-pointer"
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Grid de templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <ChecklistTemplateCard
            key={template.id}
            template={template}
            onSelect={() => onSelectTemplate(template)}
            onDuplicate={() => handleDuplicateTemplate(template)}
            onEdit={() => console.log("Edit template:", template.id)}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-semibold">Nenhum template encontrado</h3>
            <p className="text-muted-foreground mt-2">
              {effectiveSearchQuery || selectedCategory !== "all" 
                ? "Tente ajustar os filtros ou criar um novo template"
                : "Crie seu primeiro template para começar"
              }
            </p>
            <Button className="mt-4" onClick={onCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              {filteredTemplates.length === 0 && !effectiveSearchQuery 
                ? "Criar Primeiro Template" 
                : "Criar Novo Template"
              }
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
