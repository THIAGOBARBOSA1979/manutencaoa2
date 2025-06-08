
import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: 'cpf' | 'cnpj' | 'phone' | 'cep' | 'currency';
}

export function MaskedInput({ mask, onChange, ...props }: MaskedInputProps) {
  const applyMask = (value: string, maskType?: string) => {
    if (!maskType) return value;
    
    const cleanValue = value.replace(/\D/g, '');
    
    switch (maskType) {
      case 'cpf':
        return cleanValue
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1');
          
      case 'cnpj':
        return cleanValue
          .replace(/(\d{2})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1/$2')
          .replace(/(\d{4})(\d{1,2})/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1');
          
      case 'phone':
        if (cleanValue.length <= 10) {
          return cleanValue
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
        } else {
          return cleanValue
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
        }
        
      case 'cep':
        return cleanValue
          .replace(/(\d{5})(\d)/, '$1-$2')
          .replace(/(-\d{3})\d+?$/, '$1');
          
      case 'currency':
        const number = parseFloat(cleanValue) / 100;
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(number);
        
      default:
        return value;
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyMask(e.target.value, mask);
    e.target.value = maskedValue;
    onChange?.(e);
  };
  
  return (
    <Input
      {...props}
      onChange={handleChange}
    />
  );
}

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  
  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
