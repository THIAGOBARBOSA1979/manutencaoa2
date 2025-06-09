
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ChecklistCategoryCard } from "./ChecklistCategoryCard";
import { ChecklistCategoryForm } from "./ChecklistCategoryForm";

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

  const handleCreateCategory = (data: any) => {
    console.log("Creating category:", data);
    setIsCreating(false);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleUpdateCategory = (data: any) => {
    console.log("Updating category:", editingCategory?.id, data);
    setEditingCategory(null);
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
            <ChecklistCategoryForm
              onSubmit={handleCreateCategory}
              onCancel={() => setIsCreating(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
        {categories.map((category) => (
          <ChecklistCategoryCard
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onClick={() => onCategorySelect(category.id)}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        ))}
      </div>

      {/* Edit Category Dialog */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoria</DialogTitle>
            </DialogHeader>
            <ChecklistCategoryForm
              initialData={{
                name: editingCategory.name,
                description: editingCategory.description,
                color: editingCategory.color
              }}
              onSubmit={handleUpdateCategory}
              onCancel={() => setEditingCategory(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
