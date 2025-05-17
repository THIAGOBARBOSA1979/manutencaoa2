import { NavLink } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Home, Building, ClipboardCheck, ShieldCheck, Settings, Menu, X, Users, Calendar } from "lucide-react";
interface SidebarProps {
  className?: string;
}
const SidebarLink = ({
  to,
  icon: Icon,
  children,
  end = false
}: {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  end?: boolean;
}) => {
  return <NavLink to={to} end={end} className={({
    isActive
  }) => cn("flex items-center gap-3 px-3 py-2 rounded-md transition-colors", isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground")}>
      <Icon size={18} />
      <span>{children}</span>
    </NavLink>;
};
export const Sidebar = ({
  className
}: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  return <>
      {/* Mobile sidebar toggle button */}
      <button className="fixed right-4 top-4 z-50 rounded-full p-2 bg-primary text-primary-foreground shadow-md lg:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Sidebar */}
      <div className={cn("fixed inset-y-0 left-0 z-40 w-64 bg-sidebar flex flex-col transition-transform duration-300 lg:translate-x-0", isOpen ? "translate-x-0" : "-translate-x-full", className)}>
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">A2 imobiliária </h1>
        </div>
        
        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <SidebarLink to="/" icon={Home} end>Dashboard</SidebarLink>
          <SidebarLink to="/properties" icon={Building}>Empreendimentos</SidebarLink>
          <SidebarLink to="/inspections" icon={ClipboardCheck}>Vistorias</SidebarLink>
          <SidebarLink to="/warranty" icon={ShieldCheck}>Garantias</SidebarLink>
          <SidebarLink to="/calendar" icon={Calendar}>Agendamentos</SidebarLink>
          <SidebarLink to="/users" icon={Users}>Usuários</SidebarLink>
          <SidebarLink to="/settings" icon={Settings}>Configurações</SidebarLink>
        </nav>
        
        {/* User profile */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">Admin</p>
              <p className="text-xs text-sidebar-foreground/70">admin@construtora.com</p>
            </div>
          </div>
        </div>
      </div>
    </>;
};