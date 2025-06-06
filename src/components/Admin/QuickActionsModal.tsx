
import { useState } from "react";
import { Building, ClipboardCheck, ShieldCheck, Users, Calendar, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface QuickActionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickActionsModal({ open, onOpenChange }: QuickActionsModalProps) {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Novo Empreendimento",
      description: "Cadastrar uma nova propriedade no sistema",
      icon: <Building className="h-6 w-6" />,
      action: () => {
        navigate('/admin/properties');
        onOpenChange(false);
      },
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      title: "Agendar Vistoria",
      description: "Criar nova vistoria para um imóvel",
      icon: <ClipboardCheck className="h-6 w-6" />,
      action: () => {
        navigate('/admin/inspections');
        onOpenChange(false);
      },
      color: "bg-green-50 text-green-700 border-green-200"
    },
    {
      title: "Nova Garantia",
      description: "Registrar solicitação de garantia",
      icon: <ShieldCheck className="h-6 w-6" />,
      action: () => {
        navigate('/admin/warranty');
        onOpenChange(false);
      },
      color: "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
      title: "Cadastrar Usuário",
      description: "Adicionar novo usuário ao sistema",
      icon: <Users className="h-6 w-6" />,
      action: () => {
        navigate('/admin/users');
        onOpenChange(false);
      },
      color: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      title: "Ver Agenda",
      description: "Consultar agenda de atividades",
      icon: <Calendar className="h-6 w-6" />,
      action: () => {
        navigate('/admin/calendar');
        onOpenChange(false);
      },
      color: "bg-indigo-50 text-indigo-700 border-indigo-200"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ações Rápidas
          </DialogTitle>
          <DialogDescription>
            Acesso direto às funções mais utilizadas do sistema
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer hover:shadow-md transition-all duration-200 border-2 ${action.color}`}
              onClick={action.action}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  {action.icon}
                  <CardTitle className="text-base">{action.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm">
                  {action.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
