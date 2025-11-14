import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RisePayWebhook {
  event: string;
  data: {
    transaction_id: string;
    status: string;
    amount: number;
    customer: {
      email: string;
      name: string;
    };
    metadata?: {
      plan_type: string;
    };
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const webhook: RisePayWebhook = await req.json();
    console.log('RisePay webhook received:', webhook);

    // Processar apenas pagamentos aprovados
    if (webhook.event === 'payment.approved' || webhook.data.status === 'approved') {
      const { customer, transaction_id, amount, metadata } = webhook.data;
      const planType = metadata?.plan_type || 'mensal';

      console.log('Processing approved payment:', {
        email: customer.email,
        name: customer.name,
        plan: planType,
        amount: amount
      });

      // Chamar função de verificação de pagamento
      const { error: verifyError } = await supabase.functions.invoke('verify-payment', {
        body: {
          transaction_id: transaction_id,
          customer_email: customer.email,
          customer_name: customer.name,
          plan_type: planType,
          amount: amount
        }
      });

      if (verifyError) {
        console.error('Error verifying payment:', verifyError);
        throw verifyError;
      }

      console.log('Payment processed successfully');
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Webhook processed successfully' 
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
    console.error('Error in risepay-webhook function:', error);
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
