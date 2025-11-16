import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const adminEmail = 'thaylanfreitas@gmail.com';
    const adminPassword = '12345';
    const clientEmail = 'thaylanfreitas@gmail.com';
    const clientPassword = 'th123';

    // List all users to check existence (emails are case-insensitive)
    const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
    
    const adminUser = usersList?.users.find(u => u.email?.toLowerCase() === adminEmail.toLowerCase()) ?? null;
    const clientUser = usersList?.users.find(u => u.email?.toLowerCase() === clientEmail.toLowerCase()) ?? null;

    // Only create admin if doesn't exist
    let finalAdminUser = adminUser;
    if (!adminUser) {
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });
      if (userError) {
        console.error('Error creating admin user:', userError);
        return new Response(
          JSON.stringify({ error: userError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      finalAdminUser = userData.user;
    }

    // Only create client if doesn't exist
    let finalClientUser = clientUser;
    if (!clientUser) {
      const { data: clientData, error: clientError } = await supabaseAdmin.auth.admin.createUser({
        email: clientEmail,
        password: clientPassword,
        email_confirm: true,
      });
      if (clientError) {
        console.error('Error creating client user:', clientError);
        return new Response(
          JSON.stringify({ error: clientError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      finalClientUser = clientData.user;
    }

    // Ensure admin role exists
    if (finalAdminUser) {
      const { error: adminRoleError } = await supabaseAdmin
        .from('user_roles')
        .upsert({ user_id: finalAdminUser.id, role: 'admin' }, { onConflict: 'user_id,role' });

      if (adminRoleError && adminRoleError.code !== '23505') {
        console.error('Error ensuring admin role:', adminRoleError);
      }
    }

    // Ensure client role exists
    if (finalClientUser) {
      const { error: clientRoleError } = await supabaseAdmin
        .from('user_roles')
        .upsert({ user_id: finalClientUser.id, role: 'cliente' }, { onConflict: 'user_id,role' });

      if (clientRoleError && clientRoleError.code !== '23505') {
        console.error('Error ensuring client role:', clientRoleError);
      }
    }

    console.log('Setup completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Usuários configurados com sucesso',
        admin: { 
          email: adminEmail, 
          status: adminUser ? 'já_existe' : 'criado' 
        },
        client: { 
          email: clientEmail, 
          status: clientUser ? 'já_existe' : 'criado' 
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in setup-admin function:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
