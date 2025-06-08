
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageCircle, Send, User, Clock, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const commentSchema = z.object({
  comment: z.string().min(5, {
    message: "O comentário deve ter pelo menos 5 caracteres"
  }).max(500, {
    message: "O comentário deve ter no máximo 500 caracteres"
  }),
});

type CommentFormValues = z.infer<typeof commentSchema>;

// Mock comments data
const mockComments = [
  {
    id: "1",
    author: "Admin Sistema",
    content: "Solicitação analisada e aprovada. Técnico será atribuído em breve.",
    timestamp: new Date(2025, 4, 15, 14, 30),
    type: "system"
  },
  {
    id: "2",
    author: "Carlos Silva",
    content: "Cliente relatou que o problema persiste mesmo após primeira tentativa de reparo. Necessário revisão técnica mais detalhada.",
    timestamp: new Date(2025, 4, 16, 9, 15),
    type: "admin"
  },
  {
    id: "3",
    author: "João Técnico",
    content: "Materiais necessários foram solicitados. Previsão de conclusão: 2 dias úteis.",
    timestamp: new Date(2025, 4, 17, 11, 45),
    type: "technician"
  }
];

interface WarrantyCommentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warranty: any;
}

export function WarrantyCommentsModal({ open, onOpenChange, warranty }: WarrantyCommentsModalProps) {
  const { toast } = useToast();
  const [comments, setComments] = useState(mockComments);
  
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: ""
    },
  });

  const onSubmit = (data: CommentFormValues) => {
    const newComment = {
      id: Date.now().toString(),
      author: "Admin Atual", // Would be current user
      content: data.comment,
      timestamp: new Date(),
      type: "admin" as const
    };

    setComments([...comments, newComment]);
    form.reset();
    
    toast({
      title: "Comentário adicionado",
      description: "Seu comentário foi adicionado com sucesso",
    });
  };

  const getAuthorBadge = (type: string) => {
    const typeConfig = {
      system: { label: "Sistema", className: "bg-purple-100 text-purple-800" },
      admin: { label: "Administrador", className: "bg-blue-100 text-blue-800" },
      technician: { label: "Técnico", className: "bg-green-100 text-green-800" }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || { label: "Usuário", className: "bg-gray-100 text-gray-800" };
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
  };

  if (!warranty) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comentários Internos
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Comentários visíveis apenas no painel administrativo - {warranty.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lista de comentários */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum comentário interno ainda</p>
                <p className="text-sm">Seja o primeiro a adicionar uma observação</p>
              </div>
            ) : (
              comments.map((comment, index) => (
                <div key={comment.id} className="space-y-3">
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{comment.author}</span>
                        </div>
                        {getAuthorBadge(comment.type)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(comment.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                  </div>
                  {index < comments.length - 1 && <Separator />}
                </div>
              ))
            )}
          </div>

          <Separator />

          {/* Formulário para novo comentário */}
          <div className="space-y-4">
            <h4 className="font-medium">Adicionar novo comentário</h4>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comentário interno</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Adicione observações, atualizações ou instruções internas..."
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Este comentário será visível apenas para administradores e técnicos
                  </p>
                  <Button type="submit" size="sm">
                    <Send className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
