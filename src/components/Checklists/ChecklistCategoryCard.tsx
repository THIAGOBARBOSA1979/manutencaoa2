
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Folder, CheckCircle } from "lucide-react";
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

interface ChecklistCategoryCardProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
  onEdit?: (category: Category) => void;
  onDelete?: (categoryId: string) => void;
}

export function ChecklistCategoryCard({ 
  category, 
  isSelected, 
  onClick, 
  onEdit, 
  onDelete 
}: ChecklistCategoryCardProps) {
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      gray: "bg-gray-400",
      blue: "bg-blue-500",
      green: "bg-green-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      yellow: "bg-yellow-500"
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md border-2",
        isSelected ? "border-primary shadow-sm" : "border-transparent"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", getColorClass(category.color))} />
              <h4 className="font-medium">{category.name}</h4>
            </div>
            
            {category.id !== "all" && (onEdit || onDelete) && (
              <div className="flex gap-1">
                {onEdit && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(category);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(category.id);
                    }}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                )}
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
            
            {isSelected && (
              <Badge variant="secondary" className="text-xs">
                Selecionada
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
