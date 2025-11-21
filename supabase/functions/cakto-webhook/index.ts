import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapeamento dos produtos Cakto para tipos de plano
// Usando os IDs dos links de checkout da Cakto
const productPlanMap: Record<string, string> = {
  'oe4gntt_660033': 'mensal',
  '3bkvcdo_660047': 'trimestral',
  '3fyyh99_660056': 'anual',
};

// Também mapear por offer IDs se necessário
const offerPlanMap: Record<string, string> = {
  // Adicione aqui os IDs das ofertas quando souber
};

// Valores dos planos
const planPrices: Record<string, number> = {
  'mensal': 18.90,
  'trimestral': 38.90,
  'anual': 73.90,
};

// Schema de validação para o formato real do webhook da Cakto
const caktoWebhookSchema = z.object({
  secret: z.string().optional(),
  event: z.string(),
  data: z.object({
    id: z.string().optional(),
    refId: z.string().optional(),
    customer: z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string().optional(),
      docNumber: z.string().optional(),
    }),
    product: z.object({
      id: z.string().optional(),
      short_id: z.string().optional(),
      name: z.string().optional(),
    }).optional(),
    offer: z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      price: z.number().optional(),
    }).optional(),
    status: z.string(),
    amount: z.number(),
    baseAmount: z.number().optional(),
    checkoutUrl: z.string().optional(),
  }),
}).passthrough();

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
    
    // Extração de dados da estrutura real da Cakto
    const customerEmail = webhook.data.customer.email;
    const customerName = webhook.data.customer.name;
    const productId = webhook.data.product?.short_id || webhook.data.product?.id;
    const offerId = webhook.data.offer?.id;
    const amount = webhook.data.amount;
    const status = webhook.data.status;
    const checkoutUrl = webhook.data.checkoutUrl || '';

    console.log('Extracted data:', {
      email: customerEmail,
      name: customerName,
      productId,
      amount,
      status,
      event: webhook.event,
    });

    // Verificar se o pagamento foi aprovado ou assinatura criada
    const isApproved = 
      webhook.event === 'subscription_created' ||
      webhook.event === 'order_paid' ||
      webhook.event === 'payment_approved' ||
      status?.toLowerCase() === 'paid' ||
      status?.toLowerCase() === 'approved' ||
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

    // Tentar mapear o produto/oferta para um tipo de plano
    let planType: string = 'mensal'; // Default
    
    // Extrair o ID do produto do checkoutUrl se disponível
    let extractedCheckoutId: string | undefined;
    if (checkoutUrl) {
      const urlMatch = checkoutUrl.match(/pay\.cakto\.com\.br\/([a-z0-9_]+)/i);
      if (urlMatch) {
        extractedCheckoutId = urlMatch[1];
      }
    }
    
    // Tentar mapear na seguinte ordem:
    // 1. Pelo ID extraído do checkoutUrl
    if (extractedCheckoutId && productPlanMap[extractedCheckoutId]) {
      planType = productPlanMap[extractedCheckoutId];
      console.log(`Checkout URL ${extractedCheckoutId} mapped to plan: ${planType}`);
    }
    // 2. Pelo offer ID
    else if (offerId && offerPlanMap[offerId]) {
      planType = offerPlanMap[offerId];
      console.log(`Offer ${offerId} mapped to plan: ${planType}`);
    }
    // 3. Pelo product ID
    else if (productId && productPlanMap[productId]) {
      planType = productPlanMap[productId];
      console.log(`Product ${productId} mapped to plan: ${planType}`);
    }
    else {
      console.warn(`Could not map product/offer to plan. Using default: mensal. CheckoutURL: ${checkoutUrl}, ProductID: ${productId}, OfferID: ${offerId}`);
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
        transaction_id: webhook.data.id || webhook.data.refId || `cakto_${Date.now()}`,
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
