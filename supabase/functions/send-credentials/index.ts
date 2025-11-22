import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CredentialsEmailRequest {
  email: string;
  password: string;
  name: string;
  plan_type: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, name, plan_type }: CredentialsEmailRequest = await req.json();
    
    console.log('Sending credentials email to:', email);

    const planNames: Record<string, string> = {
      mensal: 'Plano Mensal',
      trimestral: 'Plano Trimestral', 
      anual: 'Plano Anual'
    };

    const planTypeLabels: Record<string, string> = {
      mensal: 'Plano Mensal',
      trimestral: 'Plano Trimestral',
      semestral: 'Plano Semestral',
      anual: 'Plano Anual'
    };

    const emailResponse = await resend.emails.send({
      from: "FitFoco <onboarding@resend.dev>",
      to: [email],
      subject: "🎉 Bem-vindo ao FitFoco! Suas Credenciais de Acesso",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bem-vindo ao FitFoco</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="background: white; border-radius: 20px; padding: 20px; display: inline-block; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                <h1 style="margin: 0; color: #667eea; font-size: 32px; font-weight: bold;">💪 FitFoco</h1>
              </div>
            </div>

            <!-- Main Card -->
            <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.2);">
              <h2 style="color: #1a202c; font-size: 28px; margin: 0 0 10px 0; font-weight: bold;">Bem-vindo, ${name}! 🎉</h2>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                Estamos muito felizes em ter você conosco! Sua jornada de transformação começa agora.
              </p>

              <!-- Plan Badge -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center;">
                <p style="color: white; font-size: 14px; margin: 0 0 5px 0; opacity: 0.9;">Seu Plano</p>
                <p style="color: white; font-size: 24px; font-weight: bold; margin: 0;">${planTypeLabels[plan_type] || plan_type}</p>
              </div>

              <!-- Credentials Box -->
              <div style="background: #f7fafc; border-left: 4px solid #667eea; border-radius: 8px; padding: 25px; margin: 30px 0;">
                <h3 style="color: #2d3748; font-size: 18px; margin: 0 0 20px 0; font-weight: bold;">🔐 Suas Credenciais de Acesso</h3>
                
                <div style="margin-bottom: 15px;">
                  <p style="color: #718096; font-size: 14px; margin: 0 0 5px 0; font-weight: 600;">Email:</p>
                  <p style="color: #2d3748; font-size: 16px; margin: 0; font-family: 'Courier New', monospace; background: white; padding: 10px; border-radius: 6px;">${email}</p>
                </div>

                <div>
                  <p style="color: #718096; font-size: 14px; margin: 0 0 5px 0; font-weight: 600;">Senha:</p>
                  <p style="color: #2d3748; font-size: 16px; margin: 0; font-family: 'Courier New', monospace; background: white; padding: 10px; border-radius: 6px;">${password}</p>
                </div>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="https://fitfoco.lovable.app/client-login" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: bold; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4); transition: transform 0.2s;">
                  🚀 Acessar FitFoco
                </a>
              </div>

              <!-- Security Notice -->
              <div style="background: #fff5f5; border-left: 4px solid #fc8181; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <p style="color: #742a2a; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>⚠️ Importante:</strong> Por segurança, recomendamos que você altere sua senha após o primeiro acesso.
                </p>
              </div>

              <!-- Features -->
              <div style="margin: 30px 0;">
                <h3 style="color: #2d3748; font-size: 18px; margin: 0 0 20px 0; font-weight: bold;">✨ O que você pode fazer:</h3>
                
                <div style="display: grid; gap: 15px;">
                  <div style="display: flex; align-items: start;">
                    <span style="color: #667eea; font-size: 24px; margin-right: 15px;">🏋️</span>
                    <div>
                      <strong style="color: #2d3748; font-size: 15px;">Treinos Personalizados</strong>
                      <p style="color: #718096; font-size: 14px; margin: 5px 0 0 0;">Acesse treinos exclusivos criados para você</p>
                    </div>
                  </div>

                  <div style="display: flex; align-items: start;">
                    <span style="color: #667eea; font-size: 24px; margin-right: 15px;">📊</span>
                    <div>
                      <strong style="color: #2d3748; font-size: 15px;">Acompanhe seu Progresso</strong>
                      <p style="color: #718096; font-size: 14px; margin: 5px 0 0 0;">Veja sua evolução em tempo real</p>
                    </div>
                  </div>

                  <div style="display: flex; align-items: start;">
                    <span style="color: #667eea; font-size: 24px; margin-right: 15px;">🎯</span>
                    <div>
                      <strong style="color: #2d3748; font-size: 15px;">Desafios Diários</strong>
                      <p style="color: #718096; font-size: 14px; margin: 5px 0 0 0;">Complete desafios e ganhe recompensas</p>
                    </div>
                  </div>

                  <div style="display: flex; align-items: start;">
                    <span style="color: #667eea; font-size: 24px; margin-right: 15px;">🤖</span>
                    <div>
                      <strong style="color: #2d3748; font-size: 15px;">Suporte IA 24/7</strong>
                      <p style="color: #718096; font-size: 14px; margin: 5px 0 0 0;">Tire dúvidas a qualquer momento</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Support -->
              <div style="text-align: center; padding-top: 30px; border-top: 2px solid #e2e8f0; margin-top: 30px;">
                <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">
                  Precisa de ajuda? Estamos aqui para você!
                </p>
                <p style="color: #667eea; font-size: 14px; margin: 0; font-weight: 600;">
                  📧 suporte@fitfoco.com
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding: 20px;">
              <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">
                © 2024 FitFoco. Transformando vidas através do fitness.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-credentials function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
