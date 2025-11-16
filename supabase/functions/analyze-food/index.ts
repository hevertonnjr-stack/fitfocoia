import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'Imagem não fornecida' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    // Call Lovable AI for image analysis
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analise esta imagem de alimento e retorne um JSON com as seguintes informações:
{
  "name": "nome do alimento em português",
  "portion": "porção estimada (ex: 100g, 1 unidade)",
  "calories": número de calorias,
  "protein": gramas de proteína,
  "carbs": gramas de carboidratos,
  "fat": gramas de gordura,
  "fiber": gramas de fibra,
  "sodium": miligramas de sódio,
  "sugar": gramas de açúcar,
  "healthScore": pontuação de saúde de 0-100,
  "recommendations": ["lista de recomendações nutricionais"],
  "warnings": ["lista de alertas se houver"]
}

Seja preciso nas estimativas nutricionais. Se não conseguir identificar claramente, retorne valores estimados conservadores.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', errorText);
      throw new Error(`Erro na API de IA: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Resposta vazia da IA');
    }

    // Parse the JSON from AI response
    let foodData;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      foodData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      // Fallback to a default response if parsing fails
      foodData = {
        name: "Alimento não identificado",
        portion: "100g",
        calories: 200,
        protein: 5,
        carbs: 30,
        fat: 5,
        fiber: 2,
        sodium: 100,
        sugar: 5,
        healthScore: 50,
        recommendations: ["Não foi possível identificar o alimento com precisão. Tente uma foto mais clara."],
        warnings: []
      };
    }

    return new Response(
      JSON.stringify(foodData),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in analyze-food function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro ao analisar alimento',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
