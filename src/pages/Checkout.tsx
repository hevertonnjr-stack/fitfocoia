import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'mensal';

  const planDetails = {
    mensal: {
      name: 'Plano Mensal',
      price: 'R$ 18,90',
      period: '/mês',
      risePayLink: 'https://risepay.com.br/checkout/mensal-fitfoco',
      features: [
        'Acesso completo ao app',
        'Todos os treinos',
        'Acompanhamento de progresso',
        'Suporte prioritário'
      ]
    },
    trimestral: {
      name: 'Plano Trimestral',
      price: 'R$ 57,90',
      period: '/3 meses',
      risePayLink: 'https://risepay.com.br/checkout/trimestral-fitfoco',
      features: [
        'Acesso completo ao app',
        'Todos os treinos',
        'Acompanhamento de progresso',
        'Suporte prioritário',
        'Economia de 35%'
      ]
    },
    anual: {
      name: 'Plano Anual',
      price: 'R$ 99,90',
      period: '/ano',
      risePayLink: 'https://risepay.com.br/checkout/anual-fitfoco',
      features: [
        'Acesso completo ao app',
        'Todos os treinos',
        'Acompanhamento de progresso',
        'Suporte prioritário',
        'Economia de 66%',
        'Melhor custo-benefício'
      ]
    }
  };

  const selectedPlan = planDetails[plan as keyof typeof planDetails] || planDetails.mensal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar aos Planos
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Finalizar Assinatura</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Plan Summary */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">{selectedPlan.name}</CardTitle>
                <CardDescription>Resumo do seu plano</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-4xl font-bold text-primary">{selectedPlan.price}</span>
                  <span className="text-muted-foreground">{selectedPlan.period}</span>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Incluído no plano:</h3>
                  <ul className="space-y-2">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Payment Section - RisePay Integration */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">Pagamento Seguro</CardTitle>
                <CardDescription>Powered by RisePay</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-br from-primary/5 to-transparent p-6 rounded-lg border border-primary/20 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>🔒</span>
                      <span>Pagamento 100% Seguro</span>
                    </div>
                    <span>•</span>
                    <span>SSL Certificado</span>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="font-semibold">Para configurar sua integração RisePay:</p>
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                      <li>Acesse sua conta RisePay</li>
                      <li>Copie suas credenciais de API (Client ID e Secret)</li>
                      <li>Clique no botão abaixo para configurar</li>
                    </ol>
                  </div>

                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      window.open('https://risepay.com.br', '_blank');
                    }}
                  >
                    Acessar RisePay Dashboard
                  </Button>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg border border-primary/30 text-sm">
                  <p className="font-semibold mb-2 text-primary">✓ Sistema configurado!</p>
                  <p className="text-muted-foreground">
                    Clique no botão abaixo para ser redirecionado à página segura de pagamento RisePay. 
                    Após a confirmação do pagamento, você receberá suas credenciais de acesso por email.
                  </p>
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                  size="lg"
                  onClick={() => {
                    window.location.href = selectedPlan.risePayLink;
                  }}
                >
                  Pagar com RisePay - {selectedPlan.price}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  🔐 Todas as transações são processadas de forma segura e criptografada
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
