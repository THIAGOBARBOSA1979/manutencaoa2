import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
}

export function ChecklistTemplates({ onSelectTemplate, onCreateNew }: ChecklistTemplatesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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
          description: "Estrutural: Verificar rachaduras nas paredes",
          required: true,
          evidence: []
        },
        {
          id: "2", 
          description: "Hidráulica: Testar funcionamento de todas as torneiras",
          required: true,
          evidence: []
        },
        {
          id: "3",
          description: "Elétrica: Verificar funcionamento de todas as tomadas",
          required: true,
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
          description: "Estrutural: Verificar possíveis infiltrações",
          required: true,
          evidence: []
        },
        {
          id: "5",
          description: "Acabamento: Verificar estado da pintura",
          required: false,
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
          description: "Hidráulica: Verificar pressão da água",
          required: true,
          evidence: []
        }
      ]
    }
  ];

  const categories = ["all", "Vistoria", "Garantia", "Manutenção"];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    
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
      {/* Header com busca e filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          {categories.map((category) => (
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

        <Button onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Template
        </Button>
      </div>

      {/* Grid de templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <CardContent className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Nenhum template encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou criar um novo template
            </p>
            <Button className="mt-4" onClick={onCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
