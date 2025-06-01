
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientHeader } from "@/components/ClientLayout/ClientHeader";
import { ClientSidebar } from "@/components/ClientLayout/ClientSidebar";

// Helper component for the mobile header
const MobileHeader = ({ onToggleSidebar }: { onToggleSidebar: () => void; }) => {
  return (
    <div className="flex items-center justify-between h-16 px-4 border-b md:hidden bg-background/95 backdrop-blur-sm">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="hover:bg-muted/50">
        <Menu size={20} />
      </Button>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold">
          A2
        </div>
        <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Portal do Cliente
        </span>
      </div>
      <div className="w-8"></div> {/* Spacer for centering */}
    </div>
  );
};

const ClientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Close the sidebar when a link is clicked on mobile
  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Mobile header */}
      <MobileHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Sidebar */}
      <ClientSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLinkClick={handleLinkClick}
      />
      
      {/* Backdrop overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
      
      {/* Main content */}
      <div className="md:ml-72 min-h-screen flex flex-col">
        {/* Desktop header */}
        <div className="hidden md:block">
          <ClientHeader />
        </div>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="py-6 px-6 text-center border-t bg-muted/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 A2 Incorporadora. Todos os direitos reservados.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Portal do Cliente • Versão 2.0
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ClientLayout;
