import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const paymentVerificationSchema = z.object({
  transaction_id: z.string().min(1).max(255),
  customer_email: z.string().email('Email inválido').max(255),
  customer_name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  plan_type: z.enum(['mensal', 'trimestral', 'anual']),
  amount: z.number().positive('Valor deve ser positivo').max(999999, 'Valor muito alto')
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
    const payload = paymentVerificationSchema.parse(body);
    
    console.log('Payment verification request:', {
      transaction_id: payload.transaction_id,
      email: payload.customer_email,
      plan: payload.plan_type
    });

    // Gerar senha aleatória
    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
    
    // Criar usuário no auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: payload.customer_email,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: payload.customer_name,
        plan_type: payload.plan_type
      }
    });

    if (authError) {
      console.error('Error creating user:', authError);
      throw new Error(`Erro ao criar usuário: ${authError.message}`);
    }

    const userId = authData.user.id;
    console.log('User created:', userId);

    // Calcular data de término da assinatura
    const startDate = new Date();
    const endDate = new Date();
    
    switch (payload.plan_type) {
      case 'mensal':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'trimestral':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'anual':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    // Criar assinatura
    const { error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_type: payload.plan_type,
        amount: payload.amount,
        status: 'active',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      });

    if (subError) {
      console.error('Error creating subscription:', subError);
      // Tentar remover o usuário se a assinatura falhar
      await supabase.auth.admin.deleteUser(userId);
      throw new Error(`Erro ao criar assinatura: ${subError.message}`);
    }

    console.log('Subscription created successfully');

    // Enviar email com credenciais
    const { error: emailError } = await supabase.functions.invoke('send-credentials', {
      body: {
        email: payload.customer_email,
        password: password,
        name: payload.customer_name,
        plan_type: payload.plan_type
      }
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      // Não falhar se o email não for enviado, mas logar o erro
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Pagamento verificado e conta criada com sucesso',
        user_id: userId
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
    console.error('Error in verify-payment function:', error);
    
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