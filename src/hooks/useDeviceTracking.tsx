import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDeviceTracking = () => {
  useEffect(() => {
    const trackDevice = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        // Obter informações do dispositivo
        const deviceInfo = {
          user_id: user.id,
          ip_address: await getIPAddress(),
          user_agent: navigator.userAgent,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language,
        };

        // Enviar para edge function
        await supabase.functions.invoke('track-device', {
          body: deviceInfo
        });

      } catch (error) {
        console.error('Error tracking device:', error);
      }
    };

    trackDevice();
  }, []);
};

async function getIPAddress(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP:', error);
    return 'unknown';
  }
}
