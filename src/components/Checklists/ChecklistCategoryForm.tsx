
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
}

interface ChecklistCategoryFormProps {
  initialData?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
}

const colorOptions = [
  { value: "blue", label: "Azul", class: "bg-blue-500" },
  { value: "green", label: "Verde", class: "bg-green-500" },
  { value: "red", label: "Vermelho", class: "bg-red-500" },
  { value: "purple", label: "Roxo", class: "bg-purple-500" },
  { value: "orange", label: "Laranja", class: "bg-orange-500" },
  { value: "yellow", label: "Amarelo", class: "bg-yellow-500" }
];

export function ChecklistCategoryForm({ initialData, onSubmit, onCancel }: ChecklistCategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>(
    initialData || { name: "", description: "", color: "blue" }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Categoria</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Ex: Vistoria Técnica"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Descreva o propósito desta categoria..."
        />
      </div>
      
      <div className="space-y-2">
        <Label>Cor</Label>
        <div className="flex gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              type="button"
              className={cn(
                "w-8 h-8 rounded-full border-2",
                color.class,
                formData.color === color.value ? "border-gray-900" : "border-gray-300"
              )}
              onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!formData.name.trim()}>
          {initialData ? "Atualizar" : "Criar"} Categoria
        </Button>
      </div>
    </form>
  );
}
