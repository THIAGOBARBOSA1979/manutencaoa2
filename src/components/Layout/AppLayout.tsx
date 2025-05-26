
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-64 min-h-screen">
        {/* Top bar with user info */}
        <div className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <div className="flex-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
