import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Loader2 } from 'lucide-react';
import { z } from 'zod';

const clientSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }).max(255),
  password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }).max(100),
});

const CreateClientWithSubscription = ({ onClientCreated }: { onClientCreated?: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [planType, setPlanType] = useState<'mensal' | 'trimestral' | 'anual'>('mensal');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const planPrices = {
    mensal: { amount: 18.90, months: 1 },
    trimestral: { amount: 57.90, months: 3 },
    anual: { amount: 99.90, months: 12 }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      clientSchema.parse({ email, password });

      // Create user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Add cliente role
        const { error: roleError } = await (supabase as any)
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'cliente'
          });

        if (roleError) throw roleError;

        // Calculate end date based on plan
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + planPrices[planType].months);

        // Create subscription
        const { error: subError } = await (supabase as any)
          .from('subscriptions')
          .insert({
            user_id: authData.user.id,
            plan_type: planType,
            amount: planPrices[planType].amount,
            status: 'active',
            end_date: endDate.toISOString()
          });

        if (subError) throw subError;

        toast({
          title: "Cliente criado com sucesso!",
          description: `Cliente ${email} cadastrado com plano ${planType}.`,
        });

        setEmail('');
        setPassword('');
        setPlanType('mensal');
        
        if (onClientCreated) {
          onClientCreated();
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Dados inválidos",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else if (error instanceof Error) {
        toast({
          title: "Erro ao criar cliente",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Novo Cliente</CardTitle>
            <CardDescription>Crie uma conta com assinatura ativa</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-email">Email do Cliente</Label>
            <Input
              id="client-email"
              type="email"
              placeholder="cliente@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-password">Senha</Label>
            <Input
              id="client-password"
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
          <div className="space-y-2">
            <Label htmlFor="plan-type">Plano de Assinatura</Label>
            <Select value={planType} onValueChange={(value: any) => setPlanType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensal">Mensal - R$ 18,90</SelectItem>
                <SelectItem value="trimestral">Trimestral - R$ 57,90</SelectItem>
                <SelectItem value="anual">Anual - R$ 99,90</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Criar Cliente com Assinatura
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateClientWithSubscription;
