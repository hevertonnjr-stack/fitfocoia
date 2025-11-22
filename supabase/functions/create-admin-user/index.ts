import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, password } = await req.json();

    console.log('Creating admin user:', email);

    // Criar usuário
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      throw new Error(`Erro ao criar usuário: ${createError.message}`);
    }

    const userId = userData.user.id;

    // Criar perfil
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: email,
      });

    if (profileError) {
      console.error('Erro ao criar perfil:', profileError);
      throw new Error(`Erro ao criar perfil: ${profileError.message}`);
    }

    // Criar role de admin
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'admin',
      });

    if (roleError) {
      console.error('Erro ao criar role admin:', roleError);
      throw new Error(`Erro ao criar role admin: ${roleError.message}`);
    }

    console.log('Admin user created successfully:', { userId, email });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Admin criado com sucesso',
        userId,
        email,
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
    console.error('Error in create-admin-user:', error);
    
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
