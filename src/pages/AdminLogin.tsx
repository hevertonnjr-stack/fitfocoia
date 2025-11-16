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
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('1. Iniciando processo de login...');
      
      // Primeiro tenta configurar o admin (se ainda não existir)
      try {
        console.log('2. Chamando setup-admin...');
        const setupResult = await supabase.functions.invoke('setup-admin', { method: 'POST' });
        console.log('3. Setup admin resultado:', setupResult);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (setupError) {
        console.log('Setup admin error (pode ser normal):', setupError);
      }

      // Faz o login
      console.log('4. Tentando fazer login com:', email);
      const { error } = await signIn(email, password);

      if (error) {
        console.error('5. Erro no login:', error);
        toast({
          title: "Erro no login",
          description: error.message || "Credenciais inválidas",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Login bem-sucedido
      console.log('6. Login bem-sucedido! Verificando role...');
      toast({
        title: "Login bem-sucedido!",
        description: "Verificando permissões...",
      });

      // Aguarda um pouco para garantir que a role foi verificada
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verifica se o usuário tem role de admin
      const { data: { user } } = await supabase.auth.getUser();
      console.log('7. Usuário atual:', user?.id);
      
      if (user) {
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        console.log('8. Role data:', { roleData, roleError });

        if (roleData) {
          // Sucesso! Redireciona para o admin
          console.log('9. Role de admin confirmada! Redirecionando...');
          toast({
            title: "Acesso autorizado!",
            description: "Entrando no painel administrativo...",
          });
          
          setTimeout(() => {
            navigate('/admin', { replace: true });
          }, 500);
        } else {
          console.error('10. Usuário não tem role de admin!');
          toast({
            title: "Acesso negado",
            description: "Usuário não possui privilégios de administrador",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          setLoading(false);
        }
      } else {
        console.error('11. Nenhum usuário encontrado após login!');
        setLoading(false);
      }
    } catch (error) {
      console.error('12. Erro no processo de login:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer login. Tente novamente.",
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
              <div className="rounded-full bg-primary/10 p-4">
                <Shield className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Acesso Administrativo
            </CardTitle>
            <CardDescription className="text-base">
              Área restrita para administradores
            </CardDescription>
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
