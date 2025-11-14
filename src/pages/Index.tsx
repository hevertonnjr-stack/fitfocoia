import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Dumbbell, Shield, ArrowRight, Zap, Users, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import fitfocoLogo from '@/assets/fitfoco-logo.png';

const Index = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const handlePlanClick = (paymentUrl: string) => {
    window.open(paymentUrl, '_blank', 'noopener,noreferrer');
  };

  const plans = [
    {
      name: 'Plano Mensal',
      price: 'R$ 24,90',
      period: '/mês',
      paymentUrl: 'https://pay.risepay.com.br/checkout/th123',
      features: [
        'Acesso completo ao app',
        'Todos os treinos',
        'Acompanhamento de progresso',
        'Suporte prioritário',
        'Renovação automática'
      ]
    },
    {
      name: 'Plano Trimestral',
      price: 'R$ 57,90',
      originalPrice: 'R$ 89,70',
      period: '/3 meses',
      popular: true,
      discount: '35% OFF',
      paymentUrl: 'https://pay.risepay.com.br/Pay/d2f3a83336804015a1823178ea60c940',
      features: [
        'Acesso completo ao app',
        'Todos os treinos',
        'Acompanhamento de progresso',
        'Suporte prioritário',
        'Economia de 35%',
        '🔥 Melhor custo-benefício'
      ]
    },
    {
      name: 'Plano Anual',
      price: 'R$ 99,90',
      originalPrice: 'R$ 298,80',
      period: '/ano',
      discount: '66% OFF',
      paymentUrl: 'https://pay.risepay.com.br/Pay/7ed7396bb1e84636b5d11c1aee69e474',
      features: [
        'Acesso completo ao app',
        'Todos os treinos',
        'Acompanhamento de progresso',
        'Suporte prioritário',
        'Economia de 66%',
        '💎 Máxima economia',
        'Pagamento único'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-20 space-y-8">
          <div className="flex justify-center mb-8">
            <img 
              src={fitfocoLogo} 
              alt="FitFoco" 
              className="h-24 w-auto animate-pulse" 
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Transforme Seu Corpo
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Plataforma completa de treinos com acompanhamento profissional
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="flex items-center gap-3 bg-card p-4 rounded-lg border border-border">
              <Users className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">500+</p>
                <p className="text-sm text-muted-foreground">Clientes Ativos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card p-4 rounded-lg border border-border">
              <Trophy className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">1000+</p>
                <p className="text-sm text-muted-foreground">Treinos Realizados</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card p-4 rounded-lg border border-border">
              <Zap className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">98%</p>
                <p className="text-sm text-muted-foreground">Satisfação</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <Card className="border-primary/20 hover:border-primary/50 transition-all">
            <CardHeader>
              <Dumbbell className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Treinos Personalizados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Planos de treino adaptados ao seu nível e objetivos
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/50 transition-all">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Acompanhamento Profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Suporte especializado durante toda sua jornada
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/50 transition-all">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Resultados Garantidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Metodologia comprovada para alcançar seus objetivos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section - GARANTA SUA VAGA */}
        <div className="mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-accent to-primary p-1">
            <div className="bg-background rounded-3xl p-12">
              <div className="text-center mb-12">
                <div className="inline-block animate-bounce mb-6">
                  <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-full">
                    <Zap className="h-12 w-12 text-primary-foreground" />
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                  🔥 ÚLTIMAS VAGAS COM DESCONTO! 🔥
                </h2>
                
                <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                  Clique e Garanta Sua Vaga Agora
                </p>
                
                <div className="flex items-center justify-center gap-2 text-destructive font-bold text-lg">
                  <Zap className="h-5 w-5 animate-pulse" />
                  <span className="animate-pulse">Oferta por tempo limitado</span>
                  <Zap className="h-5 w-5 animate-pulse" />
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {plans.map((plan, index) => (
                  <Card 
                    key={index}
                    className={`relative border-2 transition-all hover:scale-105 hover:shadow-2xl ${
                      plan.popular 
                        ? 'border-primary shadow-lg shadow-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
                          MAIS POPULAR
                        </div>
                      </div>
                    )}
                    
                    {plan.discount && (
                      <div className="absolute -right-2 top-4">
                        <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-l-full font-bold text-sm shadow-lg animate-pulse">
                          {plan.discount}
                        </div>
                      </div>
                    )}

                    <CardHeader className="text-center pb-8 pt-8">
                      <CardTitle className="text-2xl mb-4">{plan.name}</CardTitle>
                      <div>
                        {plan.originalPrice && (
                          <p className="text-lg text-muted-foreground line-through mb-2">
                            {plan.originalPrice}
                          </p>
                        )}
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-5xl font-bold text-primary">{plan.price}</span>
                          <span className="text-muted-foreground">{plan.period}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => handlePlanClick(plan.paymentUrl)}
                        className={`w-full text-lg py-6 ${
                          plan.popular
                            ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90'
                            : ''
                        }`}
                        size="lg"
                      >
                        GARANTIR MINHA VAGA
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-sm text-muted-foreground mb-4">
                  ✅ Pagamento 100% Seguro | ⚡ Acesso Imediato | 🔒 Garantia de 7 dias
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <Button
            variant="outline"
            onClick={() => navigate('/client-login')}
            className="min-w-[200px]"
          >
            Já sou cliente - Fazer Login
          </Button>
          
          {isAdmin && (
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              className="min-w-[200px]"
            >
              Painel Administrativo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
