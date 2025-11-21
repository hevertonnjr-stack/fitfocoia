import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Zap, Users, Brain, Dumbbell, Trophy } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Personal Trainer Virtual",
    description: "IA avançada que cria planos personalizados baseados em suas metas e evolução",
  },
  {
    icon: Dumbbell,
    title: "Planos Ilimitados",
    description: "Gere quantos planos de treino quiser, quando quiser",
  },
  {
    icon: Sparkles,
    title: "Análise Avançada",
    description: "Insights detalhados sobre sua performance e sugestões de melhoria",
  },
  {
    icon: Users,
    title: "Grupos Exclusivos",
    description: "Acesso a comunidades premium com desafios especiais",
  },
  {
    icon: Trophy,
    title: "Prêmios Exclusivos",
    description: "Conquiste medalhas e prêmios disponíveis apenas para membros premium",
  },
  {
    icon: Zap,
    title: "Sem Anúncios",
    description: "Experiência completa sem interrupções",
  },
];

const plans = [
  {
    name: "Mensal",
    price: "R$ 18,90",
    period: "/mês",
    popular: false,
  },
  {
    name: "Trimestral",
    price: "R$ 24,90",
    period: "/mês",
    popular: true,
    savings: "Economize 17%",
  },
  {
    name: "Anual",
    price: "R$ 19,90",
    period: "/mês",
    popular: false,
    savings: "Economize 33%",
  },
];

export default function Premium() {
  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
          <Crown className="w-5 h-5" />
          <span className="font-semibold">FitFoco Premium</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Desbloqueie Seu Potencial Máximo
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Alcance seus objetivos mais rápido com recursos avançados e acompanhamento personalizado
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="border-primary/20">
              <CardContent className="pt-6">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pricing */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Escolha Seu Plano</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? "border-primary/50 shadow-lg scale-105 bg-gradient-to-br from-background to-primary/5"
                  : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  Mais Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  {plan.savings && (
                    <p className="text-sm text-primary font-normal">{plan.savings}</p>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  variant={plan.popular ? "default" : "outline"}
                >
                  Começar Agora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* What's Included */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">O Que Está Incluído</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Planos de treino personalizados com IA",
              "Biblioteca completa de exercícios em vídeo",
              "Análise detalhada de progresso",
              "Acesso a todos os desafios premium",
              "Suporte prioritário",
              "Novos treinos toda semana",
              "Integração com dispositivos wearables",
              "Estatísticas avançadas",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-1 bg-primary/10 rounded-full mt-0.5">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guarantee */}
      <div className="text-center mt-12 p-6 bg-muted/50 rounded-lg max-w-2xl mx-auto">
        <h3 className="font-bold mb-2">Garantia de 7 Dias</h3>
        <p className="text-sm text-muted-foreground">
          Não está satisfeito? Devolvemos seu dinheiro, sem perguntas.
        </p>
      </div>
    </div>
  );
}
