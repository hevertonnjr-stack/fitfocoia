import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Dumbbell, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import fitfocoLogo from '@/assets/fitfoco-logo.png';

const Index = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

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
      period: '/3 meses',
      popular: true,
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
      period: '/ano',
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section with Enhanced Motivational Content */}
        <div className="text-center mb-16 space-y-10">
          <div className="flex justify-center mb-6">
            <img src={fitfocoLogo} alt="FitFoco" className="h-32 w-auto animate-pulse drop-shadow-2xl" />
          </div>
          
          {/* Motivational Banner Above Main Heading */}
          <div className="bg-gradient-to-r from-primary via-primary/80 to-primary p-6 rounded-2xl shadow-2xl border-2 border-primary/50 max-w-4xl mx-auto">
            <p className="text-3xl md:text-4xl font-extrabold text-primary-foreground animate-pulse">
              💪 VOCÊ É MAIS FORTE DO QUE PENSA!
            </p>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mt-3 font-semibold">
              Comece hoje a jornada que vai mudar sua vida para sempre! 🔥
            </p>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Transforme Seu Corpo, Transforme Sua Vida
          </h1>
          
          {/* Enhanced Motivational Content */}
          <div className="max-w-6xl mx-auto space-y-8">
            <p className="text-3xl font-bold text-foreground animate-pulse">
              🔥 Chegou a hora de você se tornar a melhor versão de si mesmo!
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 p-8 rounded-3xl border-2 border-primary/40 shadow-2xl">
                <h3 className="text-3xl font-bold mb-6 text-primary">⚡ Acesso Imediato!</h3>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-2xl">✓</span>
                    <span><strong>Pagou?</strong> Acesso liberado instantaneamente!</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-2xl">✓</span>
                    <span><strong>Email automático</strong> com suas credenciais</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-2xl">✓</span>
                    <span><strong>Sem espera!</strong> Comece a treinar agora mesmo</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-admin-success/20 via-admin-success/15 to-admin-success/10 p-8 rounded-3xl border-2 border-admin-success/40 shadow-2xl">
                <h3 className="text-3xl font-bold mb-6 text-admin-success">🎯 Garantia Total</h3>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-start gap-3">
                    <span className="text-admin-success text-2xl">✓</span>
                    <span><strong>7 dias</strong> para testar sem compromisso</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-admin-success text-2xl">✓</span>
                    <span><strong>100% reembolso</strong> se não gostar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-admin-success text-2xl">✓</span>
                    <span><strong>Zero burocracia</strong> para cancelar</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-10 rounded-3xl border-2 border-primary/40 shadow-xl">
              <p className="text-2xl font-bold mb-6 text-primary">
                🚀 Por que milhares estão escolhendo o FitFoco?
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="space-y-4">
                  <p className="text-lg font-semibold">✨ Você vai ter acesso a:</p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">→</span>
                      <span>Treinos personalizados que se adaptam ao SEU ritmo e metas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">→</span>
                      <span>Acompanhamento em tempo real do seu progresso</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">→</span>
                      <span>Suporte prioritário com especialistas fitness</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">→</span>
                      <span>Acesso imediato após confirmação de pagamento</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <p className="text-lg font-semibold">🎯 Resultados Comprovados:</p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">→</span>
                      <span>Mais de 10.000 transformações reais</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">→</span>
                      <span>98% de satisfação dos nossos alunos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">→</span>
                      <span>Método validado por profissionais certificados</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">→</span>
                      <span>Sistema automático de liberação de acesso</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/15 to-primary/5 p-8 rounded-2xl border-2 border-primary/30 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary text-center">🔐 Processo 100% Seguro e Automático</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">1️⃣</span>
                  </div>
                  <p className="font-semibold text-sm">Escolha seu plano</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">2️⃣</span>
                  </div>
                  <p className="font-semibold text-sm">Realize o pagamento</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">3️⃣</span>
                  </div>
                  <p className="font-semibold text-sm">Verificação automática</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">✅</span>
                  </div>
                  <p className="font-semibold text-sm">Acesso liberado!</p>
                </div>
              </div>
              <p className="text-center mt-6 text-sm text-muted-foreground">
                Após o pagamento, você receberá suas credenciais por email automaticamente. Não é necessário aguardar aprovação manual!
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-gradient-to-br from-primary/10 to-transparent p-8 rounded-2xl border-2 border-primary/30 hover:border-primary/50 transition-all shadow-lg hover:shadow-xl">
                <h3 className="text-2xl font-bold mb-3 text-primary">💪 Resultados Visíveis</h3>
                <p className="text-muted-foreground text-lg">
                  Veja mudanças reais nas primeiras 2 semanas! Nosso método científico garante resultados ou seu dinheiro de volta.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-transparent p-8 rounded-2xl border-2 border-primary/30 hover:border-primary/50 transition-all shadow-lg hover:shadow-xl">
                <h3 className="text-2xl font-bold mb-3 text-primary">⚡ Tecnologia Exclusiva</h3>
                <p className="text-muted-foreground text-lg">
                  Sistema inteligente que aprende com você e ajusta automaticamente seus treinos para máxima eficiência!
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-transparent p-8 rounded-2xl border-2 border-primary/30 hover:border-primary/50 transition-all shadow-lg hover:shadow-xl">
                <h3 className="text-2xl font-bold mb-3 text-primary">🎯 Garantia Total</h3>
                <p className="text-muted-foreground text-lg">
                  7 dias para testar sem compromisso. Não gostou? Devolvemos 100% do seu investimento, sem burocracia!
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 p-10 rounded-3xl border-3 border-primary/40 shadow-2xl">
              <p className="text-3xl font-bold mb-4 text-primary">
                ⏰ ATENÇÃO: Promoção por Tempo Limitado!
              </p>
              <p className="text-xl text-foreground mb-4 font-semibold">
                Cada dia que você adia é um dia a menos para alcançar o corpo dos seus sonhos!
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Não deixe para amanhã a transformação que você pode começar HOJE. Milhares já deram o primeiro passo... 
                <span className="text-primary font-bold"> e você, o que está esperando?</span>
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">10,000+</p>
                  <p className="text-sm text-muted-foreground">Alunos ativos</p>
                </div>
                <div className="hidden md:block h-16 w-px bg-primary/30"></div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">98%</p>
                  <p className="text-sm text-muted-foreground">Satisfação</p>
                </div>
                <div className="hidden md:block h-16 w-px bg-primary/30"></div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Treinos disponíveis</p>
                </div>
                <div className="hidden md:block h-16 w-px bg-primary/30"></div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">⚡</p>
                  <p className="text-sm text-muted-foreground">Acesso Instantâneo</p>
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="bg-gradient-to-br from-background to-primary/5 p-10 rounded-3xl border-2 border-primary/20 shadow-xl">
              <h3 className="text-3xl font-bold text-center mb-8 text-primary">💬 O Que Dizem Nossos Alunos</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-background/80 p-6 rounded-xl border border-primary/20">
                  <div className="flex mb-3">
                    <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                  </div>
                  <p className="text-muted-foreground mb-3">"Em apenas 2 semanas já vi resultados incríveis! O sistema de treinos é muito bem estruturado."</p>
                  <p className="font-bold text-sm">- João Silva, 28 anos</p>
                </div>
                <div className="bg-background/80 p-6 rounded-xl border border-primary/20">
                  <div className="flex mb-3">
                    <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                  </div>
                  <p className="text-muted-foreground mb-3">"Melhor investimento que já fiz! O acesso foi liberado na hora e o suporte é excelente."</p>
                  <p className="font-bold text-sm">- Maria Santos, 32 anos</p>
                </div>
                <div className="bg-background/80 p-6 rounded-xl border border-primary/20">
                  <div className="flex mb-3">
                    <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                  </div>
                  <p className="text-muted-foreground mb-3">"Finalmente um app que funciona de verdade! Perdi 8kg em 2 meses seguindo os treinos."</p>
                  <p className="font-bold text-sm">- Carlos Mendes, 35 anos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Grid - Moved below motivational content */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Escolha Seu Plano e Comece Agora!
          </h2>
          <p className="text-center text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Investimento acessível para transformar sua vida. Escolha o plano ideal para você e receba acesso imediato!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.name}
                className={`relative border-2 transition-all hover:scale-105 ${
                  plan.popular 
                    ? 'border-primary shadow-2xl shadow-primary/30 scale-105' 
                    : 'border-primary/20 hover:border-primary/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      🏆 Mais Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground text-lg">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full text-lg font-bold"
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => window.open(plan.paymentUrl, '_blank')}
                  >
                    {plan.popular ? '🚀 Começar Agora' : 'Assinar Agora'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(plan.paymentUrl);
                      alert('Link copiado!');
                    }}
                  >
                    📋 Copiar Link de Pagamento
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Admin and Client Access - Enhanced styling */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8 text-foreground">
            Já é Cliente ou Administrador?
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group">
              <Button 
                onClick={() => navigate('/admin-login')}
                className="w-full h-auto py-8 bg-gradient-to-br from-admin-success via-primary to-admin-success/80 hover:from-admin-success/90 hover:via-primary/90 hover:to-admin-success/70 text-primary-foreground border-2 border-primary/30 shadow-2xl hover:shadow-admin-success/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col items-center gap-3">
                  <Shield className="h-12 w-12" />
                  <div>
                    <p className="text-2xl font-bold">Painel Administrativo</p>
                    <p className="text-sm opacity-90 mt-1">Acesso exclusivo para gestores</p>
                  </div>
                </div>
              </Button>
            </div>
            
            <div className="group">
              <Button 
                onClick={() => navigate('/client-login')}
                className="w-full h-auto py-8 bg-gradient-to-br from-primary via-admin-info to-primary/80 hover:from-primary/90 hover:via-admin-info/90 hover:to-primary/70 text-primary-foreground border-2 border-primary/30 shadow-2xl hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col items-center gap-3">
                  <Dumbbell className="h-12 w-12" />
                  <div>
                    <p className="text-2xl font-bold">Área de Clientes</p>
                    <p className="text-sm opacity-90 mt-1">Acesse sua conta após a compra</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
