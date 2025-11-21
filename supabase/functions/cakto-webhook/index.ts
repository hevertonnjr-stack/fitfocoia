import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapeamento dos produtos Cakto para tipos de plano
const productPlanMap: Record<string, string> = {
  'oe4gntt_660033': 'mensal',
  '3bkvcdo_660047': 'trimestral',
  '3fyyh99_660056': 'anual',
};

// Valores dos planos
const planPrices: Record<string, number> = {
  'mensal': 18.90,
  'trimestral': 38.90,
  'anual': 73.90,
};

// Schema de validação flexível para o webhook da Cakto
const caktoWebhookSchema = z.object({
  event: z.string().optional(),
  order: z.object({
    id: z.string().optional(),
    status: z.string().optional(),
    amount: z.number().optional(),
    product: z.object({
      id: z.string().optional(),
      name: z.string().optional(),
    }).optional(),
    customer: z.object({
      email: z.string().email(),
      name: z.string(),
    }),
  }).optional(),
  // Campos alternativos caso a estrutura seja diferente
  customer: z.object({
    email: z.string().email(),
    name: z.string(),
  }).optional(),
  product_id: z.string().optional(),
  amount: z.number().optional(),
  status: z.string().optional(),
}).passthrough(); // Permite campos adicionais

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
    
    // Log completo do payload recebido para debug
    console.log('=== CAKTO WEBHOOK RECEIVED ===');
    console.log('Full payload:', JSON.stringify(body, null, 2));
    
    // Validação flexível
    const webhook = caktoWebhookSchema.parse(body);
    
    // Extração de dados com fallbacks para diferentes estruturas
    let customerEmail: string;
    let customerName: string;
    let productId: string | undefined;
    let amount: number | undefined;
    let status: string | undefined;

    // Tentar extrair do objeto order primeiro
    if (webhook.order) {
      customerEmail = webhook.order.customer.email;
      customerName = webhook.order.customer.name;
      productId = webhook.order.product?.id;
      amount = webhook.order.amount;
      status = webhook.order.status;
    } else if (webhook.customer) {
      // Fallback para estrutura alternativa
      customerEmail = webhook.customer.email;
      customerName = webhook.customer.name;
      productId = webhook.product_id;
      amount = webhook.amount;
      status = webhook.status;
    } else {
      throw new Error('Could not extract customer data from webhook');
    }

    console.log('Extracted data:', {
      email: customerEmail,
      name: customerName,
      productId,
      amount,
      status,
      event: webhook.event,
    });

    // Verificar se o pagamento foi aprovado
    const isApproved = 
      webhook.event?.includes('approved') || 
      status?.toLowerCase() === 'approved' ||
      status?.toLowerCase() === 'paid' ||
      status?.toLowerCase() === 'completed';

    if (!isApproved) {
      console.log('Payment not approved, status:', status);
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Webhook received but payment not approved yet' 
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Tentar mapear o produto para um tipo de plano
    let planType: string = 'mensal'; // Default
    
    if (productId) {
      // Extrair o ID do produto do link (caso venha como URL)
      const productIdMatch = productId.match(/([a-z0-9_]+)_\d+/i);
      const extractedId = productIdMatch ? productIdMatch[0] : productId;
      
      if (productPlanMap[extractedId]) {
        planType = productPlanMap[extractedId];
        console.log(`Product ${extractedId} mapped to plan: ${planType}`);
      } else {
        console.warn(`Product ID ${extractedId} not found in mapping, using default: mensal`);
      }
    }

    // Usar o valor do plano mapeado ou o valor recebido
    const finalAmount = planPrices[planType] || amount || 18.90;

    console.log('Processing payment:', {
      email: customerEmail,
      name: customerName,
      plan: planType,
      amount: finalAmount,
    });

    // Chamar função de verificação de pagamento
    const { error: verifyError } = await supabase.functions.invoke('verify-payment', {
      body: {
        transaction_id: webhook.order?.id || `cakto_${Date.now()}`,
        customer_email: customerEmail,
        customer_name: customerName,
        plan_type: planType,
        amount: finalAmount,
      }
    });

    if (verifyError) {
      console.error('Error verifying payment:', verifyError);
      throw verifyError;
    }

    console.log('Payment processed successfully for:', customerEmail);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Webhook processed successfully',
        plan: planType,
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
    console.error('=== ERROR IN CAKTO WEBHOOK ===');
    console.error('Error details:', error);
    
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Dados inválidos no webhook',
          details: error.errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Internal server error',
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
