
import { Link } from "react-router-dom";
import { 
  Building2, 
  Shield, 
  CheckCircle2, 
  Star,
  Users,
  Award,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Clock,
  FileCheck,
  Wrench,
  Home as HomeIcon,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  const warrantyTypes = [
    {
      icon: Building2,
      title: "Estrutural",
      period: "5 anos",
      description: "Fundação, pilares, vigas e lajes com garantia estendida",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Impermeabilização",
      period: "3 anos",
      description: "Proteção contra infiltrações e vazamentos",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Wrench,
      title: "Instalações",
      period: "2 anos",
      description: "Sistemas hidráulicos, elétricos e de gás",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: HomeIcon,
      title: "Acabamentos",
      period: "1 ano",
      description: "Pisos, revestimentos, pintura e esquadrias",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      property: "Residencial Vista Verde",
      quote: "O sistema de garantias da A2 me deu total tranquilidade. Quando precisei, o atendimento foi rápido e eficiente.",
      rating: 5
    },
    {
      name: "João Santos",
      property: "Edifício Aurora",
      quote: "Processo de solicitação de garantia super simples pelo portal. Problema resolvido em menos de uma semana.",
      rating: 5
    },
    {
      name: "Ana Costa",
      property: "Condomínio Parque das Flores",
      quote: "A transparência do portal me permite acompanhar tudo em tempo real. Excelente sistema!",
      rating: 5
    }
  ];

  const faqItems = [
    {
      question: "Como funciona o sistema de garantias da A2?",
      answer: "Nossa garantia é escalonada por tipo de item: estrutural (5 anos), impermeabilização (3 anos), instalações (2 anos) e acabamentos (1 ano). Você pode solicitar atendimento facilmente pelo nosso portal online."
    },
    {
      question: "Como solicitar uma garantia?",
      answer: "Acesse seu portal do cliente, vá na seção 'Garantias', clique em 'Nova Solicitação', descreva o problema e anexe fotos. Nossa equipe analisará e entrará em contato em até 24 horas."
    },
    {
      question: "Qual o prazo para atendimento?",
      answer: "Problemas urgentes (vazamentos, falta de energia) são atendidos em até 24h. Demais casos em até 7 dias úteis. Você acompanha todo o processo pelo portal."
    },
    {
      question: "O que não é coberto pela garantia?",
      answer: "Não cobrimos desgaste natural, uso inadequado, modificações feitas pelo proprietário, danos por terceiros ou eventos da natureza. Consulte o manual completo no seu portal."
    },
    {
      question: "Posso acompanhar o andamento da solicitação?",
      answer: "Sim! Pelo portal você vê o status em tempo real, pode enviar mensagens para nossa equipe e recebe notificações sobre atualizações."
    }
  ];

  const stats = [
    { value: "98%", label: "Satisfação com Garantias", icon: Star },
    { value: "2.5k+", label: "Clientes Protegidos", icon: Users },
    { value: "24h", label: "Tempo Médio de Resposta", icon: Clock }
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
                <p className="text-sm text-blue-600 font-medium">Garantia que Protege Seu Investimento</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>(11) 9999-9999</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>garantias@a2incorporadora.com</span>
                </div>
              </div>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Portal do Cliente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Focado em Garantias */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-lg px-6 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  Sistema de Garantias Completo
                </Badge>
                
                <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                  Seu imóvel protegido com a
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> garantia A2</span>
                </h2>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Sistema completo de garantias com cobertura de até 5 anos, atendimento rápido e portal online 
                  para acompanhar suas solicitações em tempo real.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/client/warranty">
                    <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg px-8 py-4">
                      <Shield className="h-5 w-5 mr-2" />
                      Consultar Garantias
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                      Acessar Portal
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Cards de Garantia Visual */}
              <div className="grid grid-cols-2 gap-4">
                {warrantyTypes.map((warranty, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${warranty.color} flex items-center justify-center mx-auto mb-4`}>
                        <warranty.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{warranty.title}</h4>
                      <p className="text-2xl font-bold text-blue-600 mb-2">{warranty.period}</p>
                      <p className="text-sm text-gray-600">{warranty.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/70">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Garantias Detalhada */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                Sistema de Garantias Completo
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Proteção abrangente para seu investimento com diferentes prazos de cobertura 
                e processo simplificado de solicitação.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {warrantyTypes.map((warranty, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${warranty.color} flex items-center justify-center mx-auto mb-4`}>
                      <warranty.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{warranty.title}</CardTitle>
                    <p className="text-3xl font-bold text-blue-600">{warranty.period}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{warranty.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Processo de Solicitação */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h4 className="text-2xl font-bold text-center mb-8">Como Solicitar Garantia</h4>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { step: "1", title: "Acesse o Portal", desc: "Entre no portal do cliente com suas credenciais" },
                  { step: "2", title: "Nova Solicitação", desc: "Clique em 'Garantias' > 'Nova Solicitação'" },
                  { step: "3", title: "Descreva o Problema", desc: "Adicione detalhes e fotos do problema" },
                  { step: "4", title: "Acompanhe", desc: "Receba atualizações em tempo real" }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                      {item.step}
                    </div>
                    <h5 className="font-semibold mb-2">{item.title}</h5>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                O que nossos clientes dizem
              </h3>
              <p className="text-xl text-gray-600">
                Experiências reais de quem já utilizou nosso sistema de garantias
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.property}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ sobre Garantias */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                Dúvidas Frequentes sobre Garantias
              </h3>
              <p className="text-xl text-gray-600">
                Tire suas principais dúvidas sobre nosso sistema de garantias
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="font-semibold text-gray-900">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white space-y-8">
            <h3 className="text-4xl font-bold">
              Proteja seu investimento com a garantia A2
            </h3>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Acesse seu portal e tenha total controle sobre as garantias do seu imóvel. 
              Atendimento rápido, processo transparente e cobertura completa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/client/warranty">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4">
                  <Shield className="h-5 w-5 mr-2" />
                  Ver Minhas Garantias
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                  Entrar no Portal
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold">
                  A2
                </div>
                <span className="text-xl font-bold">A2 Incorporadora</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Construindo sonhos e protegendo investimentos há mais de 15 anos no mercado imobiliário.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-lg">Garantias</h3>
              <div className="space-y-2 text-gray-300">
                <Link to="/client/warranty" className="block hover:text-white transition-colors">
                  Consultar Garantias
                </Link>
                <Link to="/client/warranty" className="block hover:text-white transition-colors">
                  Nova Solicitação
                </Link>
                <Link to="/client/properties" className="block hover:text-white transition-colors">
                  Meu Imóvel
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">Contato</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>(11) 9999-9999</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>garantias@a2incorporadora.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>São Paulo, SP</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">Links Úteis</h3>
              <div className="space-y-2">
                <Link to="/login" className="block text-gray-300 hover:text-white transition-colors">
                  Portal do Cliente
                </Link>
                <Link to="/privacy" className="block text-gray-300 hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
                <Link to="/terms" className="block text-gray-300 hover:text-white transition-colors">
                  Termos de Uso
                </Link>
                <Link to="/support" className="block text-gray-300 hover:text-white transition-colors">
                  Central de Ajuda
                </Link>
              </div>
            </div>
          </div>
          
          <Separator className="bg-white/20 mb-6" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 A2 Incorporadora. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Seu investimento protegido com garantia completa
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
