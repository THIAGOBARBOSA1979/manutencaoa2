
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Edit, 
  Trash, 
  Tag, 
  Folder,
  Settings,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  templateCount: number;
  executionCount: number;
  lastUsed: Date;
}

interface ChecklistCategoriesProps {
  selectedCategory?: string;
  onCategorySelect: (categoryId: string) => void;
}

export function ChecklistCategories({ selectedCategory, onCategorySelect }: ChecklistCategoriesProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "blue"
  });

  // Mock data - in real app, this would come from a service
  const categories: Category[] = [
    {
      id: "all",
      name: "Todas as Categorias",
      description: "Visualizar todos os checklists",
      color: "gray",
      templateCount: 15,
      executionCount: 245,
      lastUsed: new Date()
    },
    {
      id: "vistoria",
      name: "Vistoria",
      description: "Checklists para vistorias de entrega e garantia",
      color: "blue",
      templateCount: 8,
      executionCount: 156,
      lastUsed: new Date(2025, 5, 8)
    },
    {
      id: "manutencao",
      name: "Manutenção",
      description: "Verificações de manutenção preventiva e corretiva",
      color: "green",
      templateCount: 4,
      executionCount: 67,
      lastUsed: new Date(2025, 5, 5)
    },
    {
      id: "seguranca",
      name: "Segurança",
      description: "Checklists de segurança e conformidade",
      color: "red",
      templateCount: 3,
      executionCount: 22,
      lastUsed: new Date(2025, 5, 1)
    }
  ];

  const colorOptions = [
    { value: "blue", label: "Azul", class: "bg-blue-500" },
    { value: "green", label: "Verde", class: "bg-green-500" },
    { value: "red", label: "Vermelho", class: "bg-red-500" },
    { value: "purple", label: "Roxo", class: "bg-purple-500" },
    { value: "orange", label: "Laranja", class: "bg-orange-500" },
    { value: "yellow", label: "Amarelo", class: "bg-yellow-500" }
  ];

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      gray: "bg-gray-100 text-gray-800 border-gray-200",
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      red: "bg-red-100 text-red-800 border-red-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return colorMap[color] || colorMap.gray;
  };

  const handleCreateCategory = () => {
    console.log("Creating category:", newCategory);
    setNewCategory({ name: "", description: "", color: "blue" });
    setIsCreating(false);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleDeleteCategory = (categoryId: string) => {
    console.log("Deleting category:", categoryId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Categorias</h3>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Vistoria Técnica"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o propósito desta categoria..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      className={cn(
                        "w-8 h-8 rounded-full border-2",
                        color.class,
                        newCategory.color === color.value ? "border-gray-900" : "border-gray-300"
                      )}
                      onClick={() => setNewCategory(prev => ({ ...prev, color: color.value }))}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateCategory} disabled={!newCategory.name.trim()}>
                  Criar Categoria
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md border-2",
              selectedCategory === category.id 
                ? "border-primary shadow-sm" 
                : "border-transparent"
            )}
            onClick={() => onCategorySelect(category.id)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      category.color === 'gray' ? 'bg-gray-400' :
                      category.color === 'blue' ? 'bg-blue-500' :
                      category.color === 'green' ? 'bg-green-500' :
                      category.color === 'red' ? 'bg-red-500' :
                      category.color === 'purple' ? 'bg-purple-500' :
                      category.color === 'orange' ? 'bg-orange-500' : 'bg-yellow-500'
                    )} />
                    <h4 className="font-medium">{category.name}</h4>
                  </div>
                  
                  {category.id !== "all" && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCategory(category);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id);
                        }}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1">
                      <Folder className="h-3 w-3" />
                      {category.templateCount} templates
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {category.executionCount} execuções
                    </span>
                  </div>
                  
                  {selectedCategory === category.id && (
                    <Badge variant="secondary" className="text-xs">
                      Selecionada
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
