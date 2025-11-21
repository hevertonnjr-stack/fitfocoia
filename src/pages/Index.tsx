import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Dumbbell, Shield, ArrowRight, Zap, Users, Trophy, CheckCircle2, Target, TrendingUp, Award, Star, Calendar, Clock, Heart, Flame, BarChart3, Smartphone, Lock, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import fitfocoLogo from '@/assets/fitfoco-logo.png';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useRef, useState, useEffect, memo } from 'react';
const Index = () => {
  const {
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, {
    once: true,
    margin: "-100px"
  });
  const featuresInView = useInView(featuresRef, {
    once: true,
    margin: "-100px"
  });
  const handlePlanClick = async (planType: 'mensal' | 'trimestral' | 'anual') => {
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('create-risepay-checkout', {
        body: {
          plan_type: planType
        }
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
      window.location.assign(paymentUrl!);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    }
  };
  const plans = [{
    name: 'Plano Mensal',
    price: 'R$ 19,90',
    period: '/mês',
    planType: 'mensal' as const,
    features: ['✓ Acesso completo ao app', '✓ Todos os treinos personalizados', '✓ Scanner de Kcal de alimentos com IA', '✓ Desafios diários gamificados', '✓ Acompanhamento detalhado', '✓ Suporte IA 24/7', '✓ Comunidade exclusiva', '✓ Renovação automática']
  }, {
    name: 'Plano Trimestral',
    price: 'R$ 38,90',
    originalPrice: 'R$ 59,70',
    period: '/3 meses',
    popular: true,
    discount: '35% OFF',
    planType: 'trimestral' as const,
    features: ['✓ Tudo do plano mensal', '✓ Acesso completo ao app', '✓ Todos os treinos + Novidades', '✓ Scanner de Kcal de alimentos com IA', '✓ Desafios diários gamificados', '✓ Suporte IA 24/7 prioritário', '✓ Comunidade VIP', '✓ Economia de 35%', '🔥 Melhor custo-benefício', '🎁 Bônus exclusivos']
  }, {
    name: 'Plano Anual',
    price: 'R$ 73,90',
    originalPrice: 'R$ 238,80',
    period: '/ano',
    discount: '69% OFF',
    planType: 'anual' as const,
    features: ['✓ Tudo dos planos anteriores', '✓ Acesso vitalício garantido', '✓ Treinos ilimitados + Updates', '✓ Scanner de Kcal IA premium', '✓ Desafios exclusivos', '✓ Suporte IA 24/7 VIP', '✓ Comunidade Elite', '✓ Consultoria mensal inclusa', '✓ Economia de 69%', '💎 Máxima economia', '🎁 Bônus Premium', '🏆 Acesso antecipado features']
  }];
  const stats = [{
    value: 10000,
    label: 'Alunos Ativos',
    suffix: '+',
    icon: Users
  }, {
    value: 95,
    label: 'Taxa de Sucesso',
    suffix: '%',
    icon: Trophy
  }, {
    value: 500,
    label: 'Treinos Disponíveis',
    suffix: '+',
    icon: Dumbbell
  }, {
    value: 24,
    label: 'Suporte',
    suffix: '/7',
    icon: MessageCircle
  }];
  const features = [{
    icon: Dumbbell,
    title: 'Treinos Personalizados',
    description: 'Planos de treino adaptados ao seu nível, objetivos e biotipo, com acompanhamento em tempo real.',
    color: 'from-primary to-primary/60'
  }, {
    icon: BarChart3,
    title: 'Acompanhamento Detalhado',
    description: 'Gráficos e métricas completas para visualizar sua evolução, peso, medidas e performance.',
    color: 'from-blue-500 to-blue-600'
  }, {
    icon: Target,
    title: 'Metas Inteligentes',
    description: 'Sistema de objetivos personalizados com IA que se adapta ao seu progresso e ritmo.',
    color: 'from-purple-500 to-purple-600'
  }, {
    icon: Smartphone,
    title: 'App Intuitivo',
    description: 'Interface moderna e fácil de usar, com vídeos demonstrativos e instruções detalhadas.',
    color: 'from-green-500 to-green-600'
  }, {
    icon: Users,
    title: 'Comunidade Ativa',
    description: 'Conecte-se com milhares de pessoas que compartilham os mesmos objetivos que você.',
    color: 'from-orange-500 to-orange-600'
  }, {
    icon: Lock,
    title: 'Segurança Total',
    description: 'Seus dados e pagamentos protegidos com criptografia de ponta e certificação SSL.',
    color: 'from-red-500 to-red-600'
  }];
  const testimonials = [{
    name: 'Dr. Carlos Mendes',
    role: 'Perdeu 18kg em 4 meses • Ex-sedentário',
    content: 'Como médico, sempre recomendei atividade física, mas eu mesmo não praticava. O FitFoco mudou isso. Os treinos personalizados e o acompanhamento detalhado me motivaram a seguir consistentemente. Hoje me sinto 20 anos mais jovem e sou exemplo para meus pacientes.',
    rating: 5,
    image: '👨‍⚕️'
  }, {
    name: 'Ana Paula Costa',
    role: 'Maratonista • 22kg perdidos em 6 meses',
    content: 'Após ter meu segundo filho, achei que nunca mais voltaria à forma. O FitFoco provou que eu estava errada. O sistema de desafios diários me manteve engajada, e hoje corro maratonas regularmente. Minha família toda usa o app agora!',
    rating: 5,
    image: '👩‍💼'
  }, {
    name: 'Roberto Almeida',
    role: 'Ganhou 12kg de massa muscular',
    content: 'Treinei por anos sem resultados significativos. O FitFoco revolucionou minha abordagem com treinos científicos e acompanhamento de métricas. Em 8 meses ganhei mais massa magra do que nos últimos 3 anos. O investimento valeu cada centavo.',
    rating: 5,
    image: '💪'
  }, {
    name: 'Juliana Ferreira',
    role: 'Empresária • Transformação em 90 dias',
    content: 'Minha rotina corporativa não me deixava tempo para academia. O FitFoco com treinos de 20-30 minutos foi a solução perfeita. Perdi 14kg, ganhei disposição e minha produtividade no trabalho aumentou 40%. Melhor decisão profissional e pessoal!',
    rating: 5,
    image: '👔'
  }, {
    name: 'Marcos Oliveira',
    role: 'Superou diabetes tipo 2',
    content: 'Meu médico disse que eu precisava mudar urgentemente. Com o FitFoco, perdi 25kg em 7 meses e meus níveis de glicose normalizaram. Não preciso mais de medicação! A equipe de suporte foi fundamental no processo. Gratidão eterna!',
    rating: 5,
    image: '🏆'
  }, {
    name: 'Camila Rodrigues',
    role: 'Atleta Fitness • Top 3 em competições',
    content: 'Mesmo sendo atleta, o FitFoco elevou meu nível. A combinação de treinos científicos, scanner de alimentos e comunidade engajada me levou ao pódio em 3 competições este ano. Recomendo para iniciantes e avançados!',
    rating: 5,
    image: '🥇'
  }];
  const faqs = [{
    question: 'Como funciona o FitFoco?',
    answer: 'O FitFoco é uma plataforma completa de treinos online. Após se cadastrar e escolher seu plano, você terá acesso a treinos personalizados, acompanhamento de progresso, comunidade e muito mais.'
  }, {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim! Você tem total liberdade para cancelar sua assinatura quando quiser, sem multas ou taxas adicionais. No plano mensal, o cancelamento é processado imediatamente.'
  }, {
    question: 'Os treinos são adequados para iniciantes?',
    answer: 'Com certeza! Nossos treinos são adaptados para todos os níveis, desde iniciantes até avançados. O sistema se adapta automaticamente ao seu nível de condicionamento físico.'
  }, {
    question: 'Preciso de equipamentos especiais?',
    answer: 'Não necessariamente. Oferecemos treinos tanto para academia quanto para casa, com e sem equipamentos. Você escolhe o que melhor se adapta à sua realidade.'
  }, {
    question: 'Como funciona o suporte?',
    answer: 'Nosso suporte prioritário está disponível 24/7 através do chat no app. Nossa equipe está sempre pronta para ajudar com dúvidas sobre treinos, técnicas e uso da plataforma.'
  }, {
    question: 'Qual a diferença entre os planos?',
    answer: 'Todos os planos incluem acesso completo às funcionalidades. A diferença está no período de pagamento e desconto: quanto maior o plano, maior a economia!'
  }];
  return <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <motion.nav initial={{
      y: -100
    }} animate={{
      y: 0
    }} className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
          <motion.img src={fitfocoLogo} alt="FitFoco Logo" className="h-10 w-auto" whileHover={{
          scale: 1.05
        }} transition={{
          type: "spring",
          stiffness: 400
        }} />
          <Button variant="secondary" onClick={() => {
          if (isAdmin) {
            navigate('/admin');
          } else {
            navigate('/admin-login');
          }
        }}>
            <Shield className="mr-2 h-4 w-4" />
            {isAdmin ? 'Painel Admin' : 'Área Admin'}
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-center space-y-8">
            <motion.div initial={{
            scale: 0
          }} animate={{
            scale: 1
          }} transition={{
            type: "spring",
            stiffness: 200,
            delay: 0.1
          }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Flame className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Transforme seu corpo, transforme sua vida</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Conquiste o Corpo
              </span>
              <br />
              <span className="text-foreground">dos Seus Sonhos</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Junte-se a mais de <span className="font-bold text-primary">10.000 pessoas</span> que já transformaram suas vidas com treinos personalizados, acompanhamento profissional e uma comunidade que te apoia em cada passo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6 h-auto group" onClick={() => document.getElementById('planos')?.scrollIntoView({
              behavior: 'smooth'
            })}>
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto" onClick={() => navigate('/client-login')}>
                Já sou membro
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Sem fidelidade • Cancele quando quiser</span>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Acesso imediato</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section ref={statsRef} className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 30
          }} animate={statsInView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            delay: index * 0.1,
            duration: 0.5
          }} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-foreground mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>)}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={featuresInView ? {
          opacity: 1,
          y: 0
        } : {}} transition={{
          duration: 0.8
        }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Tudo que Você Precisa para <span className="text-primary">Evoluir</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Uma plataforma completa com todas as ferramentas para você alcançar seus objetivos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 30
          }} animate={featuresInView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            delay: index * 0.1,
            duration: 0.5
          }} whileHover={{
            y: -10
          }}>
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 overflow-hidden group">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Histórias de <span className="text-primary">Sucesso</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Veja o que nossos alunos estão dizendo sobre suas transformações
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <motion.div key={index} initial={{
            opacity: 0,
            scale: 0.9
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1,
            duration: 0.5
          }}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-5xl">{testimonial.image}</div>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-24 bg-black relative overflow-hidden">
        {/* Background effects simplificado */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/20 to-black pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
              Escolha Seu <span className="text-green-500">Plano Ideal</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Investimento acessível para resultados transformadores
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1,
            duration: 0.4
          }}>
                <Card className={`relative h-full bg-neutral-900 border-neutral-800 text-white ${plan.popular ? 'ring-2 ring-green-500 shadow-2xl shadow-green-500/20' : ''}`}>
                  {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        MAIS POPULAR
                      </span>
                    </div>}
                  {plan.discount && <div className="absolute -top-4 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {plan.discount}
                      </span>
                    </div>}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="space-y-2">
                      {plan.originalPrice && <div className="text-gray-400 line-through text-lg">
                          {plan.originalPrice}
                        </div>}
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-black text-green-400">{plan.price}</span>
                        <span className="text-gray-400">{plan.period}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </li>)}
                    </ul>
                    <Button className={`w-full ${plan.popular ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'}`} size="lg" onClick={() => handlePlanClick(plan.planType)}>
                      Começar Agora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>

          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.3,
          duration: 0.5
        }} className="mt-16 space-y-12">
            {/* Garantias e Benefícios */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-neutral-900 border-green-500/20">
                <CardContent className="pt-6 text-center">
                  <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-bold text-white mb-2">Garantia de 7 Dias</h3>
                  <p className="text-sm text-gray-400">
                    Não satisfeito? Devolvemos 100% do seu investimento sem perguntas
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-neutral-900 border-green-500/20">
                <CardContent className="pt-6 text-center">
                  <Zap className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-bold text-white mb-2">Acesso Instantâneo</h3>
                  <p className="text-sm text-gray-400">
                    Comece imediatamente após a confirmação do pagamento
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-neutral-900 border-green-500/20">
                <CardContent className="pt-6 text-center">
                  <Lock className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-bold text-white mb-2">Pagamento Seguro</h3>
                  <p className="text-sm text-gray-400">
                    Criptografia SSL e certificação PCI - seus dados protegidos
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Urgência */}
            <Card className="bg-gradient-to-r from-green-600 to-green-500 border-0">
              <CardContent className="py-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  🎁 Oferta Especial: Primeiros 1.000.000 Assinantes
                </h3>
                <p className="text-white/90 mb-4">
                  Ganhe DESCONTO EXCLUSIVO + Consultoria mensal gratuita
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Cancele quando quiser</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Sem taxas ocultas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Suporte 24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Perguntas <span className="text-primary">Frequentes</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Tire todas as suas dúvidas sobre o FitFoco
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => <motion.div key={index} initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.05,
            duration: 0.5
          }}>
                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground pl-9">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-primary via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }} className="text-center text-white space-y-8">
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              Pronto para Começar sua<br />Transformação?
            </h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Junte-se a milhares de pessoas que já estão transformando suas vidas com o FitFoco
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto group" onClick={() => document.getElementById('planos')?.scrollIntoView({
              behavior: 'smooth'
            })}>
                Ver Planos
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => navigate('/client-login')}>
                Entrar na Plataforma
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 pt-8 flex-wrap">
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6" />
                <span className="text-sm">+10.000 Alunos Satisfeitos</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 fill-white" />
                <span className="text-sm">4.9/5 Avaliação</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6" />
                <span className="text-sm">95% Taxa de Sucesso</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src={fitfocoLogo} alt="FitFoco" className="h-10 mb-4" />
              <p className="text-sm text-muted-foreground">
                Transformando vidas através do fitness e bem-estar.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Plataforma</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Treinos</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Comunidade</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Progresso</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 FitFoco. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;