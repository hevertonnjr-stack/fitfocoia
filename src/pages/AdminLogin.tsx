import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Loader2, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, isAdmin, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAdmin) {
      console.log('Admin autenticado, redirecionando para painel');
      navigate('/admin', { replace: true });
    } else if (!authLoading && user && !isAdmin) {
      console.log('Usuário não é admin, bloqueando acesso');
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta área.",
        variant: "destructive",
      });
      navigate('/', { replace: true });
    }
  }, [isAdmin, authLoading, user, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('1. Iniciando login...');
      
      // Setup admin
      try {
        await supabase.functions.invoke('setup-admin', { method: 'POST' });
      } catch (setupError) {
        console.log('Setup admin:', setupError);
      }

      // Aguarda setup completar
      await new Promise(resolve => setTimeout(resolve, 500));

      // Faz login
      console.log('2. Fazendo login...');
      const { error } = await signIn(email, password);

      if (error) {
        console.error('Erro no login:', error);
        toast({
          title: "Erro no login",
          description: error.message || "Credenciais inválidas",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log('3. Login bem-sucedido! Aguardando verificação de role...');
      
      toast({
        title: "Login bem-sucedido!",
        description: "Verificando permissões...",
      });

      // Aguarda a verificação de role (o useAuth já vai fazer isso automaticamente)
      // O useEffect vai redirecionar quando isAdmin mudar para true
      
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer login",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <Card className="shadow-2xl border-primary/10">
          <CardHeader className="space-y-3 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-4 ring-4 ring-primary/20">
                <Shield className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Acesso Administrativo
            </CardTitle>
            <CardDescription className="text-base">
              ⚠️ Área restrita e protegida - Apenas administradores autorizados
            </CardDescription>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mt-4">
              <p className="text-xs text-destructive font-medium">
                🔒 AVISO DE SEGURANÇA: Todas as tentativas de acesso são monitoradas e registradas. Acesso não autorizado é crime conforme Lei 12.737/2012.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email Administrativo</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@fitness.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Senha</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Entrar como Admin
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
