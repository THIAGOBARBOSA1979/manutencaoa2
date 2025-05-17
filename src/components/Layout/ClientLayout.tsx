
import { Outlet, Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Home, ClipboardCheck, ShieldCheck, Building, LogOut, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const ClientNavLink = ({
  to,
  icon: Icon,
  children
}: {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive
          ? "bg-primary/90 text-primary-foreground"
          : "hover:bg-primary/10 text-foreground/80 hover:text-foreground"
      )}
    >
      <Icon size={18} />
      <span>{children}</span>
    </NavLink>
  );
};

const ClientHeader = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden">
          <Menu size={20} />
        </Button>
        <Link to="/client" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
            A2
          </div>
          <span className="text-xl font-semibold">Portal do Cliente</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <LogOut size={16} className="mr-2" />
            Sair
          </Button>
        </Link>
      </div>
    </header>
  );
};

const ClientSidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r flex flex-col transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile close button */}
        <div className="flex items-center justify-between h-16 px-4 border-b md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
              A2
            </div>
            <span className="text-xl font-semibold">Portal do Cliente</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </Button>
        </div>
        
        {/* User info */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User size={20} />
            </div>
            <div>
              <p className="font-medium">Maria Oliveira</p>
              <p className="text-xs text-muted-foreground">Edifício Aurora - Unidade 204</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <ClientNavLink to="/client" icon={Home}>Início</ClientNavLink>
          <ClientNavLink to="/client/properties" icon={Building}>Meu Imóvel</ClientNavLink>
          <ClientNavLink to="/client/inspections" icon={ClipboardCheck}>Vistorias</ClientNavLink>
          <ClientNavLink to="/client/warranty" icon={ShieldCheck}>Garantias</ClientNavLink>
        </nav>
      </div>
    </>
  );
};

const ClientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="md:ml-64 min-h-screen flex flex-col">
        <ClientHeader onToggleSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
        
        <footer className="py-4 px-6 text-center border-t text-sm text-muted-foreground">
          &copy; 2025 A2 Incorporadora. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
};

export default ClientLayout;
