
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Shield, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Star,
  Award,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const features = [
    {
      icon: Building2,
      title: "Gestão de Imóveis",
      description: "Controle completo do seu patrimônio imobiliário com tecnologia avançada."
    },
    {
      icon: Shield,
      title: "Garantias Digitais", 
      description: "Sistema automatizado de garantias com acompanhamento em tempo real."
    },
    {
      icon: CheckCircle2,
      title: "Vistorias Inteligentes",
      description: "Vistorias digitais rápidas e precisas com relatórios detalhados."
    },
    {
      icon: Users,
      title: "Portal do Cliente",
      description: "Acesso exclusivo para clientes acompanharem seus imóveis."
    }
  ];

  const stats = [
    { value: "500+", label: "Imóveis Gerenciados", icon: Building2 },
    { value: "98%", label: "Satisfação", icon: Star },
    { value: "15+", label: "Anos de Experiência", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                A2
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">A2 Incorporadora</h1>
                <p className="text-sm text-blue-600 font-medium">House Key Flow</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>(11) 9999-9999</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Seg-Sex 8h-18h</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/admin/login">Área Administrativa</Link>
                </Button>
                <Button asChild>
                  <Link to="/client/login">Portal do Cliente</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mb-6">
              Sistema de Gestão Imobiliária
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Gestão completa do seu
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> patrimônio imobiliário</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
              Plataforma integrada para administração de imóveis, vistorias digitais, 
              gestão de garantias e portal exclusivo para clientes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4" asChild>
                <Link to="/client/login">
                  Acessar Portal do Cliente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4" asChild>
                <Link to="/admin/login">Área Administrativa</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Funcionalidades Completas
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar seu patrimônio imobiliário de forma eficiente
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h3 className="text-3xl font-bold mb-4">
              Pronto para começar?
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Acesse sua área exclusiva e tenha controle total sobre seus imóveis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
                <Link to="/client/login">Portal do Cliente</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600" asChild>
                <Link to="/admin/login">Área Administrativa</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold">
                  A2
                </div>
                <span className="text-xl font-bold">A2 Incorporadora</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Construindo sonhos e entregando qualidade há mais de 15 anos no mercado imobiliário.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Contato</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>(11) 9999-9999</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>contato@a2incorporadora.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>São Paulo, SP</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Acesso Rápido</h4>
              <div className="space-y-2">
                <Link to="/client/login" className="block text-gray-400 hover:text-white transition-colors">
                  Portal do Cliente
                </Link>
                <Link to="/admin/login" className="block text-gray-400 hover:text-white transition-colors">
                  Área Administrativa
                </Link>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Central de Ajuda
                </a>
              </div>
            </div>
          </div>
          
          <Separator className="bg-gray-700 mb-6" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 A2 Incorporadora. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              House Key Flow - Sistema de Gestão Imobiliária
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
