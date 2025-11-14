import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSetupAdmin() {
  const [setupComplete, setSetupComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupAdmin = async () => {
      try {
        // Call the setup-admin function
        const { data, error } = await supabase.functions.invoke('setup-admin', {
          method: 'POST',
        });

        if (error) {
          console.error('Error setting up admin:', error);
        } else {
          console.log('Admin setup result:', data);
          setSetupComplete(true);
        }
      } catch (error) {
        console.error('Error in admin setup:', error);
      } finally {
        setLoading(false);
      }
    };

    setupAdmin();
  }, []);

  return { setupComplete, loading };
}
