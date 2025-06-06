import { Building, ClipboardCheck, ShieldCheck, Users, ChevronRight, Star, CheckCircle, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Building className="h-6 w-6" />,
      title: "Gestão de Empreendimentos",
      description: "Controle completo de propriedades, unidades e cronogramas de entrega",
      color: "bg-blue-50 text-blue-700"
    },
    {
      icon: <ClipboardCheck className="h-6 w-6" />,
      title: "Sistema de Vistorias",
      description: "Agendamento e execução de vistorias com checklists personalizáveis",
      color: "bg-green-50 text-green-700"
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Gestão de Garantias",
      description: "Controle de solicitações e prazos de garantia com rastreabilidade completa",
      color: "bg-amber-50 text-amber-700"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Portal do Cliente",
      description: "Acesso dedicado para clientes acompanharem seus imóveis e solicitações",
      color: "bg-purple-50 text-purple-700"
    }
  ];

  const testimonials = [
    {
      name: "Construtora ABC",
      role: "Gerente de Projetos",
      content: "Sistema revolucionou nossa gestão pós-obra. Reduzimos 60% do tempo em processos administrativos.",
      rating: 5
    },
    {
      name: "Incorporadora XYZ",
      role: "Diretor Comercial", 
      content: "Transparência total com os clientes. Melhoramos significativamente nossa satisfação no pós-venda.",
      rating: 5
    }
  ];

  const benefits = [
    "Redução de 60% no tempo de processos administrativos",
    "Transparência total com clientes",
    "Rastreabilidade completa de todas as ações", 
    "Integração com sistemas existentes",
    "Relatórios detalhados e personalizáveis",
    "Suporte técnico especializado"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <Building className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">GestãoPós</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/admin/login')}>
                Área Administrativa
              </Button>
              <Button onClick={() => navigate('/client/login')}>
                Portal do Cliente
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge variant="outline" className="mb-6 bg-white/50">
            🚀 Sistema de Gestão Pós-Obra
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Gestão Completa do
            <span className="text-primary block">Pós-Obra</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Plataforma integrada para gestão de empreendimentos, vistorias, garantias e relacionamento com clientes. 
            Transforme seu pós-obra em vantagem competitiva.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/admin/login')}>
              Começar Agora
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Funcionalidades Principais
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tudo que você precisa para uma gestão eficiente do pós-obra
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Por que escolher nossa plataforma?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Desenvolvido especificamente para o mercado imobiliário brasileiro, 
                nossa solução atende às necessidades reais do pós-obra.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-blue-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-white rounded-full p-6 shadow-lg mb-4 mx-auto w-fit">
                    <BarChart3 className="h-12 w-12 text-primary" />
                  </div>
                  <p className="text-slate-600">Dashboard Intuitivo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              O que nossos clientes dizem
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-slate-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary to-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para transformar seu pós-obra?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a centenas de empresas que já revolucionaram sua gestão
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => navigate('/admin/login')}>
            Começar Gratuitamente
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary rounded-lg p-2">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">GestãoPós</span>
              </div>
              <p className="text-slate-400">
                Solução completa para gestão pós-obra
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Funcionalidades</li>
                <li>Preços</li>
                <li>Demonstração</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Documentação</li>
                <li>Contato</li>
                <li>Status</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Sobre</li>
                <li>Blog</li>
                <li>Carreiras</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 GestãoPós. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
