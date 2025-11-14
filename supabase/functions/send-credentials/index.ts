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

    const emailResponse = await resend.emails.send({
      from: "FitFoco <onboarding@resend.dev>",
      to: [email],
      subject: "🎉 Bem-vindo ao FitFoco! Suas Credenciais de Acesso",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .credentials {
              background: white;
              border: 2px solid #10b981;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .credential-item {
              margin: 15px 0;
              padding: 10px;
              background: #f0fdf4;
              border-radius: 5px;
            }
            .credential-label {
              font-weight: bold;
              color: #059669;
              display: block;
              margin-bottom: 5px;
            }
            .credential-value {
              font-size: 18px;
              font-weight: 600;
              color: #1f2937;
              font-family: 'Courier New', monospace;
            }
            .button {
              display: inline-block;
              background: #10b981;
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            .highlight {
              color: #10b981;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Pagamento Confirmado!</h1>
            <p style="margin: 0; font-size: 18px;">Bem-vindo ao FitFoco, ${name}!</p>
          </div>
          
          <div class="content">
            <p>Olá <strong>${name}</strong>,</p>
            
            <p>Seu pagamento foi <span class="highlight">confirmado com sucesso</span> e sua conta FitFoco está pronta!</p>
            
            <p>Você adquiriu o <strong>${planNames[plan_type]}</strong>. Agora você tem acesso total a todos os treinos e funcionalidades premium!</p>
            
            <div class="credentials">
              <h2 style="color: #059669; margin-top: 0;">🔐 Suas Credenciais de Acesso</h2>
              
              <div class="credential-item">
                <span class="credential-label">📧 Email:</span>
                <span class="credential-value">${email}</span>
              </div>
              
              <div class="credential-item">
                <span class="credential-label">🔑 Senha:</span>
                <span class="credential-value">${password}</span>
              </div>
            </div>
            
            <p style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; border-radius: 5px;">
              <strong>⚠️ Importante:</strong> Guarde esta senha em um local seguro. Você pode alterá-la após o primeiro login.
            </p>
            
            <center>
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app') || 'https://seu-app.lovable.app'}/client-login" class="button">
                🚀 Acessar Minha Conta
              </a>
            </center>
            
            <h3 style="color: #059669;">💪 O que você pode fazer agora:</h3>
            <ul>
              <li>Acessar todos os treinos personalizados</li>
              <li>Acompanhar seu progresso em tempo real</li>
              <li>Conectar com a comunidade FitFoco</li>
              <li>Receber suporte prioritário</li>
            </ul>
            
            <p><strong>Está pronto para transformar seu corpo e sua vida?</strong> Faça login agora e comece sua jornada!</p>
            
            <div class="footer">
              <p>Este é um email automático. Se você não realizou esta compra, entre em contato conosco imediatamente.</p>
              <p>© ${new Date().getFullYear()} FitFoco. Todos os direitos reservados.</p>
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
