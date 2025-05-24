
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, Building2, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().email({
    message: "Digite um email válido",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres",
  }),
});

export default function ClientLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Aqui você implementará a lógica de autenticação
      console.log("Login attempt:", values);
      
      // Simulando validação de credenciais
      if (values.email === "cliente@exemplo.com" && values.password === "123456") {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao portal do cliente!",
        });
        navigate("/client");
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Email ou senha incorretos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                A2
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">A2 Incorporadora</h1>
                <p className="text-sm text-gray-600">Portal do Cliente</p>
              </div>
            </div>
            <Link to="/" className="text-sm text-gray-600 hover:text-primary">
              Voltar ao site
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Acesse sua área exclusiva
                </h2>
                <p className="text-lg text-gray-600">
                  Gerencie seus imóveis, acompanhe vistorias e solicite atendimentos de garantia de forma simples e segura.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Meus Imóveis</h3>
                    <p className="text-gray-600">
                      Visualize todas as informações do seu imóvel, documentos importantes e histórico de manutenções.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Vistorias Online</h3>
                    <p className="text-gray-600">
                      Agende vistorias de entrega e acompanhe o status em tempo real pelo portal.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Garantias</h3>
                    <p className="text-gray-600">
                      Solicite atendimentos de garantia e acompanhe o andamento das suas solicitações.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-2">Primeira vez aqui?</h4>
                <p className="text-blue-700 text-sm mb-3">
                  Suas credenciais de acesso foram enviadas por email após a compra do seu imóvel.
                </p>
                <Button variant="outline" size="sm" className="text-blue-700 border-blue-200 hover:bg-blue-100">
                  Preciso de ajuda
                </Button>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md shadow-xl border-0">
                <CardHeader className="space-y-4 pb-6">
                  <div className="text-center">
                    <CardTitle className="text-2xl font-bold">Entrar na minha conta</CardTitle>
                    <CardDescription className="mt-2">
                      Digite suas credenciais para acessar o portal
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="seu@email.com" 
                                  className="pl-9 h-12" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  type={showPassword ? "text" : "password"} 
                                  className="pl-9 pr-9 h-12" 
                                  placeholder="••••••••"
                                  {...field} 
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-1 top-1 h-10 w-10"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-gray-600">Lembrar de mim</span>
                        </label>
                        <Link to="/client/forgot-password" className="text-primary hover:underline">
                          Esqueci minha senha
                        </Link>
                      </div>

                      <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
                        {isLoading ? "Entrando..." : "Entrar"}
                      </Button>
                    </form>
                  </Form>

                  <div className="space-y-4">
                    <Separator />
                    
                    <div className="text-center text-sm text-gray-600">
                      <p>Credenciais para teste:</p>
                      <p className="font-mono text-xs bg-gray-50 p-2 rounded mt-1">
                        Email: cliente@exemplo.com<br />
                        Senha: 123456
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-400">
                © 2025 A2 Incorporadora. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white">
                Política de Privacidade
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white">
                Termos de Uso
              </Link>
              <Link to="/support" className="text-gray-400 hover:text-white">
                Suporte
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
