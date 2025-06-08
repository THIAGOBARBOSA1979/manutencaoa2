
import { Bell, MessageSquare, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const NotificationPanel = () => {
  const notifications = [
    {
      id: "1",
      title: "Agendamento confirmado",
      message: "Sua vistoria de entrega foi confirmada para 20/05/2025 às 14:30",
      date: "Há 2 horas",
      read: false,
      type: "success"
    },
    {
      id: "2", 
      title: "Solicitação de garantia atualizada",
      message: "O status da sua solicitação foi atualizado para 'Em andamento'",
      date: "Há 1 dia",
      read: true,
      type: "info"
    },
    {
      id: "3",
      title: "Novo documento disponível",
      message: "Manual do proprietário foi adicionado aos seus documentos",
      date: "Há 2 dias", 
      read: true,
      type: "document"
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-[420px] max-h-[70vh] flex flex-col bg-background border rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <div>
          <h3 className="font-semibold text-lg">Notificações</h3>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} não lidas` : 'Todas lidas'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" className="text-xs hover:bg-white/50">
            Marcar todas como lidas
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-auto">
        {notifications.length > 0 ? (
          <div className="divide-y">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-muted/30 cursor-pointer transition-colors ${
                  !notification.read ? "bg-primary/5 border-l-4 border-primary" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium text-sm ${!notification.read ? "text-primary" : ""}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {notification.message}
                    </p>
                    <span className="text-xs text-muted-foreground/70 mt-2 block">
                      {notification.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Você não tem notificações</p>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t bg-muted/20">
        <Button variant="outline" size="sm" className="w-full">
          Ver todas notificações
        </Button>
      </div>
    </div>
  );
};

const ChatSupportPanel = () => {
  return (
    <div className="w-[420px] h-[500px] flex flex-col bg-background border rounded-lg shadow-lg">
      <div className="flex items-center gap-3 p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
          <AvatarImage src="/placeholder.svg" alt="Suporte" />
          <AvatarFallback className="bg-primary text-primary-foreground">A2</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">Suporte A2 Imobiliária</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Online • Tempo médio: 15 min
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4 bg-gradient-to-b from-muted/10 to-background">
        <div className="flex justify-start">
          <div className="bg-white border rounded-2xl rounded-tl-md p-4 max-w-[85%] shadow-sm">
            <p className="text-sm">Olá! Como posso ajudar você com seu imóvel hoje?</p>
            <span className="text-xs text-muted-foreground mt-2 block">10:30</span>
          </div>
        </div>
        
        <div className="flex justify-end">
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md p-4 max-w-[85%] shadow-sm">
            <p className="text-sm">Tenho dúvidas sobre o prazo de garantia do meu imóvel.</p>
            <span className="text-xs text-primary-foreground/70 mt-2 block">10:32</span>
          </div>
        </div>
        
        <div className="flex justify-start">
          <div className="bg-white border rounded-2xl rounded-tl-md p-4 max-w-[85%] shadow-sm">
            <p className="text-sm">Claro! A garantia estrutural é de 5 anos, sistemas hidráulicos e elétricos de 2 anos, e acabamentos de 1 ano. Posso enviar o manual completo de garantias se preferir.</p>
            <span className="text-xs text-muted-foreground mt-2 block">10:35</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t bg-muted/20">
        <div className="flex gap-2">
          <input 
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Digite sua mensagem..." 
          />
          <Button size="sm" className="px-4">Enviar</Button>
        </div>
      </div>
    </div>
  );
};

export const ClientHeader = () => {
  const { user, logout } = useAuth();
  const unreadNotifications = 3;

  const handleLogout = () => {
    console.log('ClientHeader: Executando logout');
    logout();
  };

  // Dados do usuário baseados no contexto de autenticação
  const userData = user || {
    name: "Usuário",
    property: "Propriedade"
  };

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Portal do Cliente
            </h1>
            <p className="text-sm text-muted-foreground">A2 Imobiliária</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-muted/50 transition-colors">
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 border-0">
              <NotificationPanel />
            </SheetContent>
          </Sheet>
          
          {/* Chat support */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-muted/50 transition-colors">
                <MessageSquare size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 border-0">
              <ChatSupportPanel />
            </SheetContent>
          </Sheet>
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 hover:bg-muted/50 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                    {userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{userData.name}</p>
                  <p className="text-xs text-muted-foreground">Edifício Aurora - Un. 204</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex items-center gap-2">
                <User size={16} />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Settings size={16} />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
