import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserCheck, Loader2 } from 'lucide-react';

const ManualClientApproval = ({ onApprovalComplete }: { onApprovalComplete?: () => void }) => {
  const [email, setEmail] = useState('');
  const [planType, setPlanType] = useState<'mensal' | 'trimestral' | 'anual'>('mensal');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const planPrices = {
    mensal: { amount: 18.90, months: 1 },
    trimestral: { amount: 57.90, months: 3 },
    anual: { amount: 99.90, months: 12 }
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Find user by email
      const { data: profiles, error: profileError } = await (supabase as any)
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError || !profiles) {
        throw new Error('Usuário não encontrado');
      }

      // Check if user already has an active subscription
      const { data: existingSub } = await (supabase as any)
        .from('subscriptions')
        .select('*')
        .eq('user_id', profiles.id)
        .eq('status', 'active')
        .single();

      if (existingSub) {
        throw new Error('Este usuário já possui uma assinatura ativa');
      }

      // Calculate end date
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + planPrices[planType].months);

      // Create subscription
      const { error: subError } = await (supabase as any)
        .from('subscriptions')
        .insert({
          user_id: profiles.id,
          plan_type: planType,
          amount: planPrices[planType].amount,
          status: 'active',
          end_date: endDate.toISOString()
        });

      if (subError) throw subError;

      // Add cliente role if not exists
      const { error: roleError } = await (supabase as any)
        .from('user_roles')
        .insert({
          user_id: profiles.id,
          role: 'cliente'
        })
        .select()
        .single();

      // Ignore duplicate role errors
      if (roleError && !roleError.message.includes('duplicate')) {
        throw roleError;
      }

      toast({
        title: "Cliente aprovado!",
        description: `Acesso liberado para ${email} com plano ${planType}.`,
      });

      setEmail('');
      setPlanType('mensal');
      
      if (onApprovalComplete) {
        onApprovalComplete();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Erro ao liberar acesso",
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
            <UserCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Liberar Acesso Manualmente</CardTitle>
            <CardDescription>Aprovar cliente e criar assinatura</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleApprove} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="approval-email">Email do Cliente</Label>
            <Input
              id="approval-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="approval-plan">Plano</Label>
            <Select
              value={planType}
              onValueChange={(value) => setPlanType(value as 'mensal' | 'trimestral' | 'anual')}
              disabled={loading}
            >
              <SelectTrigger id="approval-plan">
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
                Liberando...
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Liberar Acesso
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualClientApproval;
