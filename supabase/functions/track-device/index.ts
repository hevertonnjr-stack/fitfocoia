import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeviceInfo {
  ip_address: string;
  user_agent: string;
  device_type?: string;
  browser?: string;
  os?: string;
  screen_resolution?: string;
  language?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Autenticação necessária' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create client with user's token to get their ID
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader }
      }
    });

    // Get authenticated user from JWT
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role client for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const deviceInfo: DeviceInfo = await req.json();
    console.log('Device tracking request for user:', user.id);

    // Parse user agent para extrair informações
    const ua = deviceInfo.user_agent || '';
    const browser = extractBrowser(ua);
    const os = extractOS(ua);
    const deviceType = extractDeviceType(ua);

    // Calcular score de segurança
    let score = 100;
    
    // Diminui score se for dispositivo móvel (mais propenso a ataques)
    if (deviceType === 'Mobile') score -= 10;
    
    // Diminui score para navegadores desconhecidos
    if (browser === 'Unknown') score -= 20;
    
    // Diminui score para IPs suspeitos (você pode implementar verificação de blacklist aqui)
    if (await isIPBlacklisted(supabase, deviceInfo.ip_address)) {
      score = 0;
    }

    // Verifica se o dispositivo já existe (use user.id from JWT, not from request)
    const { data: existingDevice, error: checkError } = await supabase
      .from('authorized_devices')
      .select('*')
      .eq('user_id', user.id)
      .eq('ip_address', deviceInfo.ip_address)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing device:', checkError);
    }

    if (existingDevice) {
      // Atualizar dispositivo existente
      const { error: updateError } = await supabase
        .from('authorized_devices')
        .update({
          last_seen: new Date().toISOString(),
          user_agent: deviceInfo.user_agent,
          device_type: deviceType,
          browser: browser,
          os: os,
          screen_resolution: deviceInfo.screen_resolution,
          language: deviceInfo.language,
          score: score,
        })
        .eq('id', existingDevice.id);

      if (updateError) {
        console.error('Error updating device:', updateError);
        throw updateError;
      }

      console.log('Device updated successfully');
    } else {
      // Criar novo dispositivo
      const { error: insertError } = await supabase
        .from('authorized_devices')
        .insert({
          user_id: user.id,
          ip_address: deviceInfo.ip_address,
          user_agent: deviceInfo.user_agent,
          device_type: deviceType,
          browser: browser,
          os: os,
          screen_resolution: deviceInfo.screen_resolution,
          language: deviceInfo.language,
          score: score,
          status: score < 50 ? 'suspicious' : 'active',
        });

      if (insertError) {
        console.error('Error inserting device:', insertError);
        throw insertError;
      }

      console.log('New device registered');

      // Se score for baixo, registrar atividade suspeita
      if (score < 50) {
        await supabase
          .from('suspicious_activities')
          .insert({
            ip_address: deviceInfo.ip_address,
            user_agent: deviceInfo.user_agent,
            activity_type: 'new_device_low_score',
            reason: `Novo dispositivo com score baixo (${score}/100). Possível tentativa de acesso não autorizado.`,
            severity: score < 30 ? 'high' : 'medium',
            device_info: {
              browser: browser,
              os: os,
              device: deviceType,
              resolution: deviceInfo.screen_resolution,
            },
          });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        score: score,
        device_info: {
          browser,
          os,
          device_type: deviceType,
        }
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
    console.error('Error in track-device function:', error);
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

function extractBrowser(ua: string): string {
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera')) return 'Opera';
  return 'Unknown';
}

function extractOS(ua: string): string {
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS')) return 'MacOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Unknown';
}

function extractDeviceType(ua: string): string {
  if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) return 'Mobile';
  if (ua.includes('Tablet') || ua.includes('iPad')) return 'Tablet';
  return 'Desktop';
}

async function isIPBlacklisted(supabase: any, ip: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('ip_blacklist')
    .select('id')
    .eq('ip_address', ip)
    .eq('status', 'active')
    .single();

  return !!data && !error;
}

serve(handler);
