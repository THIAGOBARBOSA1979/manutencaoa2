
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'floating' | 'inline';
}

export function FormActions({
  onCancel,
  onSubmit,
  submitText = "Salvar",
  cancelText = "Cancelar",
  loading = false,
  disabled = false,
  className,
  variant = 'default'
}: FormActionsProps) {
  const baseClasses = "flex gap-3";
  
  if (variant === 'floating') {
    return (
      <div className={cn(
        "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-4 z-50",
        "md:sticky md:bottom-auto md:bg-transparent md:backdrop-blur-none md:border-t-0 md:p-0",
        className
      )}>
        <div className={cn(baseClasses, "justify-end w-full max-w-7xl mx-auto")}>
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              {cancelText}
            </Button>
          )}
          <Button 
            type="submit" 
            onClick={onSubmit}
            disabled={disabled || loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitText}
          </Button>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn(baseClasses, "justify-start", className)}>
        <Button 
          type="submit" 
          onClick={onSubmit}
          disabled={disabled || loading}
          size="sm"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitText}
        </Button>
        {onCancel && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      baseClasses, 
      "justify-end pt-6 border-t bg-muted/30 -mx-6 px-6 -mb-6 pb-6 mt-8",
      className
    )}>
      {onCancel && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>
      )}
      <Button 
        type="submit" 
        onClick={onSubmit}
        disabled={disabled || loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitText}
      </Button>
    </div>
  );
}
