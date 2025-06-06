
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Building, Eye, EyeOff, Shield, ArrowLeft, Lock, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      return;
    }

    try {
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      await login(email, password);
    } catch (error) {
      // Error handling is done in the AuthContext
      console.error("Login error:", error);
    }
  };

  const demoCredentials = [
    {
      role: "Administrador",
      email: "admin@gestaopos.com",
      password: "admin123",
      description: "Acesso completo ao sistema"
    },
    {
      role: "Cliente",
      email: "cliente@exemplo.com", 
      password: "123456",
      description: "Portal do cliente"
    }
  ];

  const securityFeatures = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Autenticação Segura",
      description: "Sistema de login unificado com criptografia avançada"
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Controle de Acesso",
      description: "Redirecionamento automático baseado no perfil do usuário"
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Proteção Anti-Fraude",
      description: "Bloqueio automático após tentativas inválidas"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao início
            </Button>
            
            <div className="flex justify-center mb-6">
              <div className="bg-primary rounded-xl p-3">
                <Building className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Acesso ao Sistema
            </h1>
            <p className="text-slate-600">
              Faça login para acessar sua área personalizada
            </p>
          </div>

          {/* Login Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center">Entrar</CardTitle>
              <CardDescription className="text-center">
                Digite suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pl-10 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="text-gray-700">Lembrar de mim</span>
                  </label>
                  <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Esqueceu sua senha?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Entrando...
                    </div>
                  ) : (
                    "Entrar no Sistema"
                  )}
                </Button>
              </form>

              <Separator className="my-6" />

              {/* Demo Credentials */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Credenciais para demonstração:
                  </p>
                </div>
                
                {demoCredentials.map((cred, index) => (
                  <Alert key={index} className="bg-slate-50 border-slate-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-medium text-slate-900">{cred.role}</p>
                        <div className="text-xs space-y-1">
                          <p><strong>Email:</strong> {cred.email}</p>
                          <p><strong>Senha:</strong> {cred.password}</p>
                          <p className="text-slate-600">{cred.description}</p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Security Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-blue-600 p-12 items-center justify-center">
        <div className="max-w-md text-white">
          <h2 className="text-4xl font-bold mb-6">
            Sistema Unificado de Acesso
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Login inteligente com redirecionamento automático baseado no seu perfil de usuário.
          </p>
          
          <div className="space-y-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-white/20 rounded-lg p-2">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-blue-100 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-blue-100">Seguro</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
