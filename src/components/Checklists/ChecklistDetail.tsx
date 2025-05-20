
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChecklistItem } from '@/services/ChecklistService';
import { Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistDetailProps {
  title: string;
  description: string;
  items: ChecklistItem[];
  readOnly?: boolean;
  onItemStatusChange?: (itemId: string, status: 'ok' | 'issue' | 'na') => void;
  onSave?: () => void;
  onBack: () => void;
}

export const ChecklistDetail = ({ 
  title, 
  description, 
  items,
  readOnly = false,
  onItemStatusChange,
  onSave,
  onBack
}: ChecklistDetailProps) => {
  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    // Extract category from description if it follows format "Category: Description"
    let category = "Outros";
    const match = item.description.match(/^([^:]+):\s(.+)$/);
    
    if (match) {
      category = match[1];
    }
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button variant="outline" onClick={onBack}>Voltar</Button>
      </div>
      
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
      
      {/* Display items grouped by category */}
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
            <CardDescription>
              {categoryItems.length} {categoryItems.length === 1 ? 'item' : 'itens'} para verificação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryItems.map(item => {
                // Extract just the description part after the category
                const itemText = item.description.includes(': ') 
                  ? item.description.split(': ')[1] 
                  : item.description;
                
                return (
                  <div key={item.id} className="p-3 border rounded-md">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span>{itemText}</span>
                          {item.required && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                              Obrigatório
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {!readOnly && onItemStatusChange && (
                        <div className="flex border rounded-md overflow-hidden">
                          <Button
                            size="sm"
                            variant="ghost"
                            className={cn(
                              "rounded-none px-2",
                              item.status === "ok" && "bg-green-100 text-green-800"
                            )}
                            onClick={() => onItemStatusChange(item.id, 'ok')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className={cn(
                              "rounded-none px-2",
                              item.status === "issue" && "bg-red-100 text-red-800"
                            )}
                            onClick={() => onItemStatusChange(item.id, 'issue')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className={cn(
                              "rounded-none px-2",
                              item.status === "na" && "bg-gray-100 text-gray-800"
                            )}
                            onClick={() => onItemStatusChange(item.id, 'na')}
                          >
                            N/A
                          </Button>
                        </div>
                      )}
                      
                      {readOnly && (
                        <div className={cn(
                          "px-2 py-1 text-xs font-medium rounded-md",
                          item.status === "ok" && "bg-green-100 text-green-800",
                          item.status === "issue" && "bg-red-100 text-red-800",
                          item.status === "na" && "bg-gray-100 text-gray-800",
                          !item.status && "bg-amber-100 text-amber-800"
                        )}>
                          {item.status === "ok" ? "OK" : 
                           item.status === "issue" ? "Problema" :
                           item.status === "na" ? "N/A" : "Pendente"}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {!readOnly && onSave && (
        <div className="flex justify-end">
          <Button onClick={onSave}>
            <Check className="mr-2 h-4 w-4" />
            Salvar Checklist
          </Button>
        </div>
      )}
    </div>
  );
};
