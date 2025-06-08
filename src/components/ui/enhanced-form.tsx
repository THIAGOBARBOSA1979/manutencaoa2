
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

interface EnhancedFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
  success?: string;
  error?: string;
  info?: string;
  variant?: 'default' | 'card' | 'minimal';
  children: React.ReactNode;
}

export function EnhancedForm({
  title,
  description,
  success,
  error,
  info,
  variant = 'default',
  className,
  children,
  ...props
}: EnhancedFormProps) {
  const formContent = (
    <>
      {(title || description) && (
        <div className="space-y-2 mb-6">
          {title && (
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {success && (
        <Alert className="mb-6 border-emerald-200 bg-emerald-50 text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {info && (
        <Alert className="mb-6 border-blue-200 bg-blue-50 text-blue-800">
          <Info className="h-4 w-4" />
          <AlertDescription>{info}</AlertDescription>
        </Alert>
      )}

      {children}
    </>
  );

  if (variant === 'card') {
    return (
      <Card className={cn("p-6 shadow-sm", className)}>
        <form {...props}>
          {formContent}
        </form>
      </Card>
    );
  }

  if (variant === 'minimal') {
    return (
      <form {...props} className={cn("space-y-6", className)}>
        {formContent}
      </form>
    );
  }

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      <form {...props} className="space-y-6 p-6 bg-background border rounded-lg shadow-sm">
        {formContent}
      </form>
    </div>
  );
}
