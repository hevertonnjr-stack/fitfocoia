import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Dumbbell, Shield, ArrowRight, Zap, Users, Trophy, CheckCircle2, Target, TrendingUp, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import fitfocoLogo from '@/assets/fitfoco-logo.png';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Index = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const handlePlanClick = async (planType: 'mensal' | 'trimestral' | 'anual') => {
    try {
      // Chamar edge function para gerar link do RisePay
      const { data, error } = await supabase.functions.invoke('create-risepay-checkout', {
        body: { plan_type: planType }
      });

      let paymentUrl: string | undefined = data?.payment_url;
      if (error || !paymentUrl) {
        if (planType === 'mensal') {
          paymentUrl = 'https://pay.risepay.com.br/Pay/63b5cd42ee0f49578a63ab025c05f64f';
        } else {
          console.error('Erro ao gerar link de pagamento:', error);
          toast.error('Erro ao processar. Tente novamente.');
          return;
        }
      }

      console.log('Abrindo link de pagamento:', paymentUrl);

      // Redirecionar de forma confiável (evita bloqueio de pop-up)
      window.location.assign(paymentUrl!);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    }
  };
  const plans = [
    {
      name: 'Plano Mensal',
      price: 'R$ 24,90',
      period: '/mês',
      planType: 'mensal' as const,
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
      planType: 'trimestral' as const,
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
      planType: 'anual' as const,
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
        <div className="flex justify-end mb-6">
          <Button variant="secondary" asChild>
            <Link to={isAdmin ? '/admin' : '/admin-login'}>
              {isAdmin ? 'Ir para Painel Admin' : 'Acesso Administrativo'}
            </Link>
          </Button>
        </div>
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-8"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <img 
              src={fitfocoLogo} 
              alt="FitFoco" 
              className="h-32 w-auto drop-shadow-2xl hover:scale-110 transition-transform duration-300" 
            />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
          >
            Transforme Seu Corpo e Sua Vida
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
          >
            Conquiste o corpo dos seus sonhos com treinos personalizados e acompanhamento profissional
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col gap-4 max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-6 border-2 border-primary/30">
              <p className="text-lg md:text-xl font-bold text-foreground mb-2">
                💪 Quer EMAGRECER e ter o corpo definido que sempre sonhou?
              </p>
              <p className="text-base text-muted-foreground">
                Nossos treinos são desenvolvidos para queimar gordura de forma eficiente e saudável
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl p-6 border-2 border-accent/30">
              <p className="text-lg md:text-xl font-bold text-foreground mb-2">
                🏆 Quer GANHAR MASSA MUSCULAR e ficar forte?
              </p>
              <p className="text-base text-muted-foreground">
                Programas especializados para hipertrofia e ganho de força muscular
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex items-center gap-3 bg-card p-4 rounded-lg border border-border shadow-lg"
            >
              <Users className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">500+</p>
                <p className="text-sm text-muted-foreground">Clientes Transformados</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex items-center gap-3 bg-card p-4 rounded-lg border border-border shadow-lg"
            >
              <Trophy className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">1000+</p>
                <p className="text-sm text-muted-foreground">Metas Conquistadas</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex items-center gap-3 bg-card p-4 rounded-lg border border-border shadow-lg"
            >
              <Award className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">98%</p>
                <p className="text-sm text-muted-foreground">Alcançam Resultados</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-20"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/20 hover:border-primary/50 transition-all h-full shadow-lg hover:shadow-2xl">
              <CardHeader>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Dumbbell className="h-12 w-12 text-primary mb-4" />
                </motion.div>
                <CardTitle>Treinos Para Seu Objetivo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Seja para EMAGRECER ou GANHAR MÚSCULOS, temos o treino perfeito para você alcançar seus objetivos
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/20 hover:border-primary/50 transition-all h-full shadow-lg hover:shadow-2xl">
              <CardHeader>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Target className="h-12 w-12 text-primary mb-4" />
                </motion.div>
                <CardTitle>Resultados Reais e Comprovados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mais de 500 pessoas já transformaram seus corpos e suas vidas com o FitFoco
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/20 hover:border-primary/50 transition-all h-full shadow-lg hover:shadow-2xl">
              <CardHeader>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <TrendingUp className="h-12 w-12 text-primary mb-4" />
                </motion.div>
                <CardTitle>Evolução Constante</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Acompanhe seu progresso em tempo real e veja suas conquistas semana após semana
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* CTA Section - GARANTA SUA VAGA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-accent to-primary p-1 animate-pulse">
            <div className="bg-background rounded-3xl p-8 md:p-12">
              {/* Header com múltiplos incentivos */}
              <div className="text-center mb-8 space-y-6">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-full shadow-2xl">
                    <Zap className="h-12 w-12 text-primary-foreground" />
                  </div>
                </motion.div>
                
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                  🔥 TRANSFORME SEU CORPO AGORA! 🔥
                </h2>

                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border-2 border-primary/30 max-w-3xl mx-auto">
                  <p className="text-xl md:text-2xl font-bold text-foreground mb-3">
                    ⚡ Você está a UM CLIQUE de realizar seu sonho:
                  </p>
                  <div className="space-y-2 text-base md:text-lg text-muted-foreground">
                    <p>✅ Perder aqueles quilos extras que te incomodam</p>
                    <p>✅ Ganhar músculos e ter o corpo definido que sempre quis</p>
                    <p>✅ Aumentar sua autoestima e confiança</p>
                    <p>✅ Ter mais energia e disposição no dia a dia</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-xl md:text-2xl text-foreground font-bold animate-pulse">
                    👇 ESCOLHA SEU PLANO E COMECE HOJE MESMO 👇
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-3 text-destructive font-bold text-base md:text-lg">
                    <Zap className="h-5 w-5 animate-pulse" />
                    <span className="animate-pulse">⏰ Últimas Vagas</span>
                    <Zap className="h-5 w-5 animate-pulse" />
                    <span className="animate-pulse">🎯 Desconto Exclusivo</span>
                    <Zap className="h-5 w-5 animate-pulse" />
                    <span className="animate-pulse">💪 Comece Agora</span>
                  </div>

                  <div className="bg-gradient-to-r from-destructive/10 to-primary/10 rounded-full px-6 py-3 inline-block border-2 border-destructive/50 animate-pulse">
                    <p className="text-destructive font-bold text-lg">
                      🚨 OFERTA LIMITADA - ATÉ 66% DE DESCONTO 🚨
                    </p>
                  </div>
                </div>
              </div>

              {/* Plans Grid - CENTRALIZADO */}
              <div className="flex justify-center mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
                  {plans.map((plan, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -10 }}
                    >
                      <Card 
                        className={`relative border-2 transition-all hover:shadow-2xl h-full ${
                          plan.popular 
                            ? 'border-primary shadow-lg shadow-primary/20 scale-105' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                          <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
                            ⭐ MAIS POPULAR ⭐
                          </div>
                        </div>
                      )}
                      
                      {plan.discount && (
                        <div className="absolute -right-2 top-4 z-10">
                          <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-l-full font-bold text-sm shadow-lg animate-pulse">
                            {plan.discount}
                          </div>
                        </div>
                      )}

                      <CardHeader className="text-center pb-6 pt-8">
                        <CardTitle className="text-2xl mb-4 font-bold">{plan.name}</CardTitle>
                        <div>
                          {plan.originalPrice && (
                            <p className="text-lg text-muted-foreground line-through mb-2">
                              {plan.originalPrice}
                            </p>
                          )}
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl md:text-5xl font-bold text-primary">{plan.price}</span>
                            <span className="text-muted-foreground">{plan.period}</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        <ul className="space-y-3">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-sm font-medium">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          onClick={() => handlePlanClick(plan.planType)}
                          className={`w-full text-base md:text-lg py-6 font-bold shadow-lg transition-all hover:scale-105 ${
                            plan.popular
                              ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90 animate-pulse'
                              : ''
                          }`}
                          size="lg"
                        >
                          {plan.popular ? '🔥 GARANTIR AGORA 🔥' : 'GARANTIR MINHA VAGA'}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </CardContent>
                    </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer com garantias e urgência */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center space-y-6"
              >
                <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border shadow-md"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="font-medium">Pagamento 100% Seguro</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border shadow-md"
                  >
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="font-medium">Acesso Imediato</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border shadow-md"
                  >
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="font-medium">Garantia de 7 dias</span>
                  </motion.div>
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border-2 border-primary/20">
                  <p className="text-foreground font-bold text-xl mb-3">
                    🎁 BÔNUS EXCLUSIVOS PARA QUEM COMEÇAR HOJE:
                  </p>
                  <div className="space-y-2 text-base text-muted-foreground">
                    <p>✅ E-book: Guia Completo de Alimentação Saudável</p>
                    <p>✅ Acesso ao Grupo VIP no WhatsApp</p>
                    <p>✅ Suporte Prioritário 24/7</p>
                    <p>✅ Planilha de Acompanhamento de Progresso</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-6 border-2 border-accent/30">
                  <p className="text-lg md:text-xl font-bold text-foreground mb-3">
                    💬 O QUE NOSSOS CLIENTES DIZEM:
                  </p>
                  <div className="space-y-3 text-muted-foreground">
                    <p className="italic">"Perdi 15kg em 3 meses! Melhor investimento da minha vida!" - Maria S.</p>
                    <p className="italic">"Ganhei 8kg de massa muscular. Nunca me senti tão forte!" - João P.</p>
                    <p className="italic">"Finalmente consegui o corpo que sempre quis. Obrigado FitFoco!" - Ana L.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Login Links */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => navigate('/client-login')}
              className="min-w-[200px] border-2 hover:scale-105 transition-all shadow-lg"
              size="lg"
            >
              <Users className="mr-2 h-5 w-5" />
              Já sou cliente - Acessar
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => navigate('/admin-login')}
              className="min-w-[200px] border-2 hover:scale-105 transition-all shadow-lg"
              size="lg"
            >
              <Shield className="mr-2 h-5 w-5" />
              Acesso Administrativo
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
