import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Building, 
  FileText, 
  ClipboardCheck, 
  ShieldCheck, 
  MessageSquare,
  LogOut,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const ChatSupportPanel = () => {
  const [message, setMessage] = useState("");
  const {
    toast
  } = useToast();
  const handleSend = () => {
    if (message.trim()) {
      toast({
        description: "Mensagem enviada com sucesso"
      });
      setMessage("");
    }
  };
  return <div className="w-[380px] h-[500px] flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg" alt="Suporte" />
          <AvatarFallback>A2</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">Suporte A2 Imobiliária</h3>
          <p className="text-xs text-muted-foreground">Tempo médio de resposta: 15 minutos</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="flex justify-start">
          <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[80%]">
            <p className="text-sm">Olá! Como posso ajudar você com seu imóvel hoje?</p>
            <span className="text-xs text-muted-foreground mt-1 block">10:30</span>
          </div>
        </div>
        
        <div className="flex justify-end">
          <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none p-3 max-w-[80%]">
            <p className="text-sm">Tenho dúvidas sobre o prazo de garantia do meu imóvel.</p>
            <span className="text-xs text-primary-foreground/70 mt-1 block">10:32</span>
          </div>
        </div>
        
        <div className="flex justify-start">
          <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[80%]">
            <p className="text-sm">Claro! A garantia estrutural é de 5 anos, sistemas hidráulicos e elétricos de 2 anos, e acabamentos de 1 ano. Posso enviar o manual completo de garantias se preferir.</p>
            <span className="text-xs text-muted-foreground mt-1 block">10:35</span>
          </div>
        </div>
      </div>
      
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Digite sua mensagem..." onKeyPress={e => e.key === 'Enter' && handleSend()} />
          <Button onClick={handleSend} type="button">Enviar</Button>
        </div>
      </div>
    </div>;
};

const ClientNavLink = ({
  to,
  icon: Icon,
  children,
  badgeCount,
  onClick,
  ...props
}: {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  badgeCount?: number;
  onClick?: () => void;
  [key: string]: any;
}) => {
  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) => cn(
        "flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
        isActive 
          ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25" 
          : "hover:bg-muted/50 text-foreground/80 hover:text-foreground hover:shadow-md"
      )} 
      {...props}
    >
      <div className="flex items-center gap-3">
        <div className="p-1">
          <Icon size={18} />
        </div>
        <span className="font-medium">{children}</span>
      </div>
      {typeof badgeCount === 'number' && badgeCount > 0 && (
        <Badge 
          variant="secondary" 
          className="ml-auto bg-white/20 text-inherit border-0 shadow-sm"
        >
          {badgeCount}
        </Badge>
      )}
    </NavLink>
  );
};

interface ClientSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkClick: () => void;
}

export const ClientSidebar = ({ isOpen, onClose, onLinkClick }: ClientSidebarProps) => {
  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-72 bg-background/95 backdrop-blur-sm border-r transform transition-transform duration-300 ease-in-out md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Sidebar header */}
      <div className="h-16 flex items-center justify-between px-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <Link to="/client" className="flex items-center gap-3" onClick={onLinkClick}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold shadow-lg">
            A2
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Portal do Cliente
            </span>
            <p className="text-xs text-muted-foreground">A2 Imobiliária</p>
          </div>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden hover:bg-white/50" 
          onClick={onClose}
        >
          <X size={18} />
        </Button>
      </div>
      
      {/* User profile */}
      <div className="p-6 border-b bg-gradient-to-br from-muted/30 to-background">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-lg font-semibold">
              MO
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">Maria Oliveira</p>
            <p className="text-sm text-muted-foreground">Edifício Aurora</p>
            <p className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full inline-block mt-1">
              Unidade 204
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <div className="space-y-1">
          <ClientNavLink to="/client" icon={Home} onClick={onLinkClick}>
            Início
          </ClientNavLink>
          <ClientNavLink to="/client/properties" icon={Building} onClick={onLinkClick}>
            Meu Imóvel
          </ClientNavLink>
          <ClientNavLink to="/client/documents" icon={FileText} badgeCount={4} onClick={onLinkClick}>
            Documentos
          </ClientNavLink>
          <ClientNavLink to="/client/inspections" icon={ClipboardCheck} badgeCount={2} onClick={onLinkClick}>
            Vistorias
          </ClientNavLink>
          <ClientNavLink to="/client/warranty" icon={ShieldCheck} badgeCount={1} onClick={onLinkClick}>
            Garantias
          </ClientNavLink>
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground px-3">Suporte e Ajuda</h4>
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 border-dashed hover:bg-muted/30 hover:border-primary/30" 
                onClick={onLinkClick}
              >
                <MessageSquare size={18} />
                Falar com suporte
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
              <ChatSupportPanel />
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      
      {/* User controls */}
      <div className="p-4 border-t bg-muted/20">
        <Link to="/">
          <Button 
            variant="outline" 
            className="w-full gap-3 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors" 
            onClick={onLinkClick}
          >
            <LogOut size={18} />
            Sair do Portal
          </Button>
        </Link>
      </div>
    </div>
  );
};
