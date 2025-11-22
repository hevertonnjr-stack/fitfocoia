import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function CreateTestClient() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('neymarjunior@gmail.com');
  const [password, setPassword] = useState('ney010');
  const [planType, setPlanType] = useState('mensal');
  const [amount, setAmount] = useState('49.90');
  const [durationMonths, setDurationMonths] = useState('1');

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-client-complete', {
        body: {
          email,
          password,
          planType,
          amount: parseFloat(amount),
          durationMonths: parseInt(durationMonths),
        },
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Cliente criado com sucesso!', {
          description: `Email: ${email}`,
        });
      } else {
        throw new Error(data.error || 'Erro ao criar cliente');
      }
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error('Erro ao criar cliente', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Criar Cliente de Teste</CardTitle>
          <CardDescription>
            Criar conta de cliente com assinatura ativa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateClient} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planType">Tipo de Plano</Label>
              <Input
                id="planType"
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                placeholder="mensal, anual, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duração (meses)</Label>
              <Input
                id="duration"
                type="number"
                value={durationMonths}
                onChange={(e) => setDurationMonths(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Cliente'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
