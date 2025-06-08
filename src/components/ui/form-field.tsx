
import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface BaseFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function BaseField({ 
  label, 
  required, 
  error, 
  success, 
  hint, 
  className,
  children 
}: BaseFieldProps) {
  const fieldId = React.useId();
  
  return (
    <div className={cn("space-y-2", className)}>
      <Label 
        htmlFor={fieldId}
        className={cn(
          "text-sm font-medium transition-colors",
          error && "text-destructive",
          success && "text-emerald-600"
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <div className="relative">
        {React.cloneElement(children as React.ReactElement, { 
          id: fieldId,
          className: cn(
            "transition-all duration-200",
            error && "border-destructive focus:ring-destructive",
            success && "border-emerald-500 focus:ring-emerald-500",
            (children as React.ReactElement).props.className
          )
        })}
        
        {(error || success) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {error && <AlertCircle className="h-4 w-4 text-destructive" />}
            {success && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          </div>
        )}
      </div>
      
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
}

export function FloatingLabelInput({ 
  label, 
  error, 
  success, 
  className, 
  ...props 
}: FloatingLabelInputProps) {
  const [focused, setFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue);
  const fieldId = React.useId();
  
  return (
    <div className={cn("relative", className)}>
      <Input
        {...props}
        id={fieldId}
        className={cn(
          "peer pt-6 pb-2 transition-all duration-200",
          error && "border-destructive focus:ring-destructive",
          success && "border-emerald-500 focus:ring-emerald-500"
        )}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        onChange={(e) => {
          setHasValue(!!e.target.value);
          props.onChange?.(e);
        }}
      />
      
      <Label
        htmlFor={fieldId}
        className={cn(
          "absolute left-3 transition-all duration-200 pointer-events-none",
          "text-muted-foreground",
          (focused || hasValue) 
            ? "top-2 text-xs font-medium" 
            : "top-1/2 -translate-y-1/2 text-sm",
          error && "text-destructive",
          success && "text-emerald-600"
        )}
      >
        {label}
        {props.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {(error || success) && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {error && <AlertCircle className="h-4 w-4 text-destructive" />}
          {success && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
        </div>
      )}
    </div>
  );
}
