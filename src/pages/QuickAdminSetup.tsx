import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function QuickAdminSetup() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Criando conta admin...');
  const navigate = useNavigate();

  useEffect(() => {
    createAdmin();
  }, []);

  const createAdmin = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: {
          email: 'neymar@gmail.com',
          password: 'neymar10',
        },
      });

      if (error) throw error;

      if (data.success) {
        setStatus('success');
        setMessage('Admin criado com sucesso!');
        toast.success('Conta admin criada!', {
          description: 'Email: neymar@gmail.com',
        });
      } else {
        throw new Error(data.error || 'Erro ao criar admin');
      }
    } catch (error: any) {
      console.error('Erro:', error);
      setStatus('error');
      setMessage(error.message || 'Erro ao criar admin');
      toast.error('Erro ao criar admin', {
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>Setup Admin</CardTitle>
          </div>
          <CardDescription>
            Criando conta de administrador
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-8">
            {status === 'loading' && (
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">{message}</p>
              </div>
            )}
            
            {status === 'success' && (
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <div>
                  <p className="text-lg font-semibold text-green-600">{message}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Email: neymar@gmail.com
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Senha: neymar10
                  </p>
                </div>
              </div>
            )}
            
            {status === 'error' && (
              <div className="text-center space-y-4">
                <XCircle className="h-12 w-12 text-red-500 mx-auto" />
                <div>
                  <p className="text-lg font-semibold text-red-600">Erro</p>
                  <p className="text-sm text-muted-foreground mt-2">{message}</p>
                </div>
              </div>
            )}
          </div>

          {status === 'success' && (
            <Button 
              onClick={() => navigate('/admin-login')} 
              className="w-full"
            >
              Ir para Login Admin
            </Button>
          )}

          {status === 'error' && (
            <Button 
              onClick={() => createAdmin()} 
              variant="outline"
              className="w-full"
            >
              Tentar Novamente
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
