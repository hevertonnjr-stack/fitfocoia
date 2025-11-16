import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Dumbbell, Loader2, ArrowLeft } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }).max(255),
  password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }).max(100),
});

const ClientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Se já estiver logado, verifica se possui assinatura ativa antes de liberar acesso
  useEffect(() => {
    const verifyIfLoggedHasAccess = async () => {
      if (!user) return;
      try {
        const has = await (supabase as any).rpc('has_active_subscription', { user_id: user.id });
        const hasActive = has?.data === true;
        if (hasActive) {
          navigate('/dashboard');
        } else {
          await signOut();
        }
      } catch (e) {
        await signOut();
      }
    };
    verifyIfLoggedHasAccess();
  }, [user, navigate, signOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      authSchema.parse({ email, password });

      const { error } = await signIn(email, password);

      if (error) {
        toast({
          title: "Erro no login",
          description: "Credenciais inválidas. Verifique se você possui uma assinatura ativa.",
          variant: "destructive",
        });
      } else {
        // Verifica assinatura ativa antes de liberar acesso
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;

        if (!userId) {
          toast({
            title: "Erro de sessão",
            description: "Não foi possível validar sua sessão.",
            variant: "destructive",
          });
          await signOut();
        } else {
          const { data: hasActive } = await (supabase as any).rpc('has_active_subscription', { user_id: userId });
          if (hasActive) {
            navigate('/dashboard');
          } else {
            toast({
              title: "Acesso restrito",
              description: "Apenas clientes com plano ativo podem acessar.",
              variant: "destructive",
            });
            await signOut();
          }
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Dados inválidos",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
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
          Voltar aos Planos
        </Button>

        <Card className="shadow-2xl border-primary/10">
          <CardHeader className="space-y-3 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Dumbbell className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Acesso de Cliente
            </CardTitle>
            <CardDescription className="text-base">
              Entre com as credenciais fornecidas após sua compra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  maxLength={100}
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
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientLogin;
