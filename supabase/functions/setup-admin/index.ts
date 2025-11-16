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
    const clientEmail = 'Thaylanfreitas@gmail.com';
    const clientPassword = 'th123';

    // List users once to check existence
    const { data: usersList1 } = await supabaseAdmin.auth.admin.listUsers();

    // Ensure Admin user exists
    let adminUser = usersList1?.users.find(u => u.email === adminEmail) ?? null;
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
      adminUser = userData.user;
    }

    // Ensure Admin role
    const { error: adminRoleError } = await supabaseAdmin
      .from('user_roles')
      .upsert({ user_id: adminUser!.id, role: 'admin' }, { onConflict: 'user_id,role' });

    if (adminRoleError) {
      console.error('Error ensuring admin role:', adminRoleError);
      return new Response(
        JSON.stringify({ error: 'Erro ao garantir role admin' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ensure Client user exists
    // Refresh list to avoid pagination issues
    const { data: usersList2 } = await supabaseAdmin.auth.admin.listUsers();
    let clientUser = usersList2?.users.find(u => u.email === clientEmail) ?? null;

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
      clientUser = clientData.user;
    }

    // Ensure Client role
    const { error: clientRoleError } = await supabaseAdmin
      .from('user_roles')
      .upsert({ user_id: clientUser!.id, role: 'cliente' }, { onConflict: 'user_id,role' });

    if (clientRoleError) {
      console.error('Error ensuring client role:', clientRoleError);
      return new Response(
        JSON.stringify({ error: 'Erro ao garantir role cliente' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Users ensured successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Admin e Cliente prontos',
        admin: { email: adminEmail },
        client: { email: clientEmail }
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
