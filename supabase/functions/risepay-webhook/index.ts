import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const webhookSchema = z.object({
  event: z.string().min(1).max(100),
  data: z.object({
    transaction_id: z.string().min(1).max(255),
    status: z.string().min(1).max(50),
    amount: z.number().positive().max(999999),
    customer: z.object({
      email: z.string().email().max(255),
      name: z.string().min(1).max(100)
    }),
    metadata: z.object({
      plan_type: z.string().max(50)
    }).optional()
  })
});

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    
    // Validate input
    const webhook = webhookSchema.parse(body);
    
    console.log('RisePay webhook received:', {
      event: webhook.event,
      transaction_id: webhook.data.transaction_id,
      status: webhook.data.status
    });

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
    
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Dados inválidos: ' + error.errors.map(e => e.message).join(', ')
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
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