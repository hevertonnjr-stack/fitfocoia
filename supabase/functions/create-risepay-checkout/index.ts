import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateCheckoutRequest {
  plan_type: 'mensal' | 'trimestral' | 'anual';
  customer_email?: string;
  customer_name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: CreateCheckoutRequest = await req.json();
    console.log('Creating RisePay checkout for plan:', payload.plan_type);

    // Configuração dos planos
    const planConfig = {
      mensal: {
        amount: 2490, // R$ 24.90 em centavos
        description: 'Plano Mensal FitFoco - Acesso Completo',
        periodicity: 'monthly'
      },
      trimestral: {
        amount: 5790, // R$ 57.90 em centavos
        description: 'Plano Trimestral FitFoco - 35% OFF',
        periodicity: 'quarterly'
      },
      anual: {
        amount: 9990, // R$ 99.90 em centavos
        description: 'Plano Anual FitFoco - 66% OFF',
        periodicity: 'yearly'
      }
    };

    const selectedPlan = planConfig[payload.plan_type];
    
    if (!selectedPlan) {
      throw new Error('Plano inválido');
    }

    const risepayClientId = Deno.env.get('RISEPAY_CLIENT_ID');
    const risepayClientSecret = Deno.env.get('RISEPAY_CLIENT_SECRET');
    
    if (!risepayClientId || !risepayClientSecret) {
      console.error('RisePay credentials not configured');
      throw new Error('Sistema de pagamento não configurado. Configure RISEPAY_CLIENT_ID e RISEPAY_CLIENT_SECRET');
    }

    // Aqui você fará a chamada real para a API do RisePay
    // Por enquanto, vamos retornar os links fixos que você já tem
    const paymentLinks = {
      mensal: 'https://pay.risepay.com.br/Pay/63b5cd42ee0f49578a63ab025c05f64f',
      trimestral: 'https://pay.risepay.com.br/Pay/d2f3a83336804015a1823178ea60c940',
      anual: 'https://pay.risepay.com.br/Pay/7ed7396bb1e84636b5d11c1aee69e474'
    };

    const paymentUrl = paymentLinks[payload.plan_type];

    console.log('Checkout URL generated:', paymentUrl);

    return new Response(
      JSON.stringify({
        success: true,
        payment_url: paymentUrl,
        plan_type: payload.plan_type,
        amount: selectedPlan.amount,
        description: selectedPlan.description
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error creating checkout:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
