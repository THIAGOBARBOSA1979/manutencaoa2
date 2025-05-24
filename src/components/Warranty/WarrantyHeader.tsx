
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Plus, 
  Calendar,
  ChevronDown,
  Download,
  InfoIcon,
  Filter,
  Settings,
  FileText,
  BarChart3,
  Mail,
  Bell,
  Archive,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ScheduleInspectionDialog } from "@/components/Inspection/ScheduleInspectionDialog";
import { useToast } from "@/components/ui/use-toast";

interface WarrantyHeaderProps {
  onExportData: () => void;
}

export const WarrantyHeader = ({ onExportData }: WarrantyHeaderProps) => {
  const { toast } = useToast();

  const handleExportPDF = () => {
    toast({
      title: "Gerando relatório PDF",
      description: "O relatório será enviado para seu e-mail quando estiver pronto.",
    });
  };

  const handleExportExcel = () => {
    toast({
      title: "Exportando para Excel",
      description: "Os dados estão sendo preparados para download.",
    });
  };

  const handleSendReport = () => {
    toast({
      title: "Enviando relatório",
      description: "O relatório semanal será enviado por e-mail.",
    });
  };

  const handleConfigureNotifications = () => {
    toast({
      title: "Configurações de notificação",
      description: "Abrindo configurações de alertas e notificações.",
    });
  };

  const handleArchiveOld = () => {
    toast({
      title: "Arquivando garantias antigas",
      description: "Garantias concluídas há mais de 6 meses serão arquivadas.",
    });
  };

  const handleCleanupData = () => {
    toast({
      title: "Limpeza de dados",
      description: "Removendo dados temporários e otimizando o sistema.",
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Garantias
        </h1>
        <p className="text-muted-foreground">
          Gerenciamento completo de solicitações de garantia e assistência técnica
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <ScheduleInspectionDialog 
          triggerButton={
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Agendar Vistoria
            </Button>
          }
        />
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Solicitação
        </Button>

        {/* Menu de Relatórios */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Relatórios
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Exportar Dados</DropdownMenuLabel>
            <DropdownMenuItem onClick={onExportData}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportExcel}>
              <FileText className="mr-2 h-4 w-4" />
              Exportar Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPDF}>
              <FileText className="mr-2 h-4 w-4" />
              Relatório PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Relatórios Automáticos</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleSendReport}>
              <Mail className="mr-2 h-4 w-4" />
              Enviar relatório semanal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: "Em breve", description: "Dashboard de analytics em desenvolvimento." })}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard analytics
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menu de Ações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Ações
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filtros e Visualização</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => toast({ title: "Filtros avançados", description: "Abrindo painel de filtros avançados." })}>
              <Filter className="mr-2 h-4 w-4" />
              Filtros avançados
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: "Configurações", description: "Abrindo configurações de visualização." })}>
              <Settings className="mr-2 h-4 w-4" />
              Configurar visualização
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleConfigureNotifications}>
              <Bell className="mr-2 h-4 w-4" />
              Configurar alertas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: "Lembretes", description: "Configurando lembretes automáticos." })}>
              <Calendar className="mr-2 h-4 w-4" />
              Lembretes automáticos
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Manutenção</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleArchiveOld}>
              <Archive className="mr-2 h-4 w-4" />
              Arquivar antigas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCleanupData}>
              <Trash2 className="mr-2 h-4 w-4" />
              Limpeza de dados
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menu de Informações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <InfoIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Informações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => toast({ title: "Guia de garantias", description: "Abrindo manual de garantias." })}>
              <FileText className="mr-2 h-4 w-4" />
              Guia de garantias
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: "Tutoriais", description: "Abrindo tutoriais do sistema." })}>
              <InfoIcon className="mr-2 h-4 w-4" />
              Tutoriais
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: "Suporte", description: "Entrando em contato com o suporte." })}>
              <Mail className="mr-2 h-4 w-4" />
              Contatar suporte
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
