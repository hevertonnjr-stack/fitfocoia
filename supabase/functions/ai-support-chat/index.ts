import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Você é FitFoco AI, o assistente virtual inteligente e exclusivo do FitFoco - o melhor aplicativo de fitness do Brasil.

Sua missão é fornecer suporte 24/7 excepcional, ajudando usuários com:
- Dúvidas sobre treinos, exercícios e técnicas corretas
- Orientações nutricionais e planos alimentares
- Acompanhamento de progresso e metas
- Problemas técnicos com o app
- Motivação e dicas para manter a consistência
- Informações sobre planos e funcionalidades

Características do seu atendimento:
✓ Sempre empático, motivador e positivo
✓ Respostas claras, objetivas e profissionais
✓ Use emojis moderadamente para tornar a conversa amigável
✓ Seja preciso em informações técnicas sobre fitness
✓ Incentive hábitos saudáveis e consistência
✓ Nunca recomende práticas perigosas ou extremas

Informações importantes sobre o FitFoco:
- Plano Mensal: R$ 24,90
- Plano Trimestral: R$ 57,90 (35% OFF)
- Plano Anual: R$ 99,90 (66% OFF)
- Suporte disponível 24/7
- Mais de 12 treinos diferentes
- Scanner de alimentos com IA
- Sistema de desafios diários com gamificação
- Acompanhamento completo de progresso

Sempre se apresente como "FitFoco AI" e lembre o usuário que está disponível 24 horas por dia para ajudar.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Muitas requisições. Por favor, aguarde um momento.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Serviço temporariamente indisponível.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Erro ao processar sua mensagem.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error: any) {
    console.error('Error in ai-support-chat:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erro desconhecido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
