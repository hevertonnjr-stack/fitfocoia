import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import CreateClientWithSubscription from '@/components/CreateClientWithSubscription';
import ManualClientApproval from '@/components/ManualClientApproval';
import CreateAdminUser from '@/components/CreateAdminUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Users, Loader2, DollarSign, Activity, Monitor, AlertTriangle, UserX, Clock, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Client {
  id: string;
  email: string;
  created_at: string;
}

interface Subscription {
  id: string;
  user_id: string;
  plan_type: string;
  amount: number;
  status: string;
  end_date: string;
}

interface Session {
  id: string;
  user_id: string;
  device_info: string;
  ip_address: string;
  last_seen: string;
  is_online: boolean;
}

const Admin = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeSubscriptions: 0,
    onlineUsers: 0,
    totalRevenue: 0,
    expiringIn7Days: 0,
    expired: 0
  });
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/');
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
      setupRealtimeSubscriptions();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      // Load clients
      const { data: clientsData, error: clientsError } = await (supabase as any)
        .from('profiles')
        .select('id, email, created_at')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;
      setClients((clientsData as any) || []);

      // Load subscriptions
      const { data: subsData, error: subsError } = await (supabase as any)
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (subsError) throw subsError;
      setSubscriptions((subsData as any) || []);

      // Load sessions
      const { data: sessionsData, error: sessionsError } = await (supabase as any)
        .from('user_sessions')
        .select('*')
        .order('last_seen', { ascending: false });

      if (sessionsError) throw sessionsError;
      setSessions((sessionsData as any) || []);

      const activeCount = ((subsData as any[])?.filter((s: any) => s.status === 'active') || []).length;
      const onlineCount = ((sessionsData as any[])?.filter((s: any) => s.is_online) || []).length;
      const revenue = ((subsData as any[])?.reduce((sum: number, s: any) => sum + Number(s.amount), 0)) || 0;
      
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const expiringCount = ((subsData as any[])?.filter((s: any) => {
        const endDate = new Date(s.end_date);
        return s.status === 'active' && endDate > now && endDate <= sevenDaysFromNow;
      }) || []).length;
      
      const expiredCount = ((subsData as any[])?.filter((s: any) => {
        const endDate = new Date(s.end_date);
        return endDate <= now;
      }) || []).length;

      // Load activity logs
      const { data: logsData } = await (supabase as any)
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      setActivityLogs((logsData as any) || []);

      setStats({
        totalClients: clientsData?.length || 0,
        activeSubscriptions: activeCount,
        onlineUsers: onlineCount,
        totalRevenue: revenue,
        expiringIn7Days: expiringCount,
        expired: expiredCount
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to sessions changes
    const sessionsChannel = supabase
      .channel('admin-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_sessions'
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    // Subscribe to subscriptions changes
    const subsChannel = supabase
      .channel('admin-subscriptions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions'
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(subsChannel);
    };
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-[1600px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 pb-6 border-b border-primary/20">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 border border-primary/30">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">
                Painel Administrativo
              </h1>
              <p className="text-muted-foreground mt-1">Controle total em tempo real</p>
            </div>
          </div>
          <Badge className="ml-auto px-4 py-2 bg-primary/20 text-primary border-primary/30">
            <Shield className="mr-2 h-4 w-4" />
            Admin
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-chart-2/20 to-chart-2/5 border-chart-2/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-chart-2" />
              </div>
              <div className="text-3xl font-bold text-chart-2">{stats.totalClients}</div>
              <p className="text-sm text-muted-foreground mt-1">Total de Clientes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-admin-info/20 to-admin-info/5 border-admin-info/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-5 w-5 text-admin-info" />
              </div>
              <div className="text-3xl font-bold text-admin-info flex items-center gap-2">
                {stats.onlineUsers}
                <span className="inline-block w-2 h-2 bg-admin-info rounded-full animate-pulse"></span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Online Agora</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-admin-success/20 to-admin-success/5 border-admin-success/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="h-5 w-5 text-admin-success" />
              </div>
              <div className="text-3xl font-bold text-admin-success">{stats.activeSubscriptions}</div>
              <p className="text-sm text-muted-foreground mt-1">Clientes Ativos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-admin-warning/20 to-admin-warning/5 border-admin-warning/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-5 w-5 text-admin-warning" />
              </div>
              <div className="text-3xl font-bold text-admin-warning">{stats.expiringIn7Days}</div>
              <p className="text-sm text-muted-foreground mt-1">Expirando em 7 dias</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-admin-danger/20 to-admin-danger/5 border-admin-danger/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <UserX className="h-5 w-5 text-admin-danger" />
              </div>
              <div className="text-3xl font-bold text-admin-danger">{stats.expired}</div>
              <p className="text-sm text-muted-foreground mt-1">Expirados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary">R$ {stats.totalRevenue.toFixed(0)}</div>
              <p className="text-sm text-muted-foreground mt-1">Receita Total</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Forms Column */}
          <div className="space-y-6">
            <CreateClientWithSubscription onClientCreated={loadData} />
            <ManualClientApproval onApprovalComplete={loadData} />
            <CreateAdminUser onAdminCreated={loadData} />
          </div>

          {/* Clients List */}
          <Card className="border-primary/20 xl:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Clientes Cadastrados</CardTitle>
                  <CardDescription>
                    {stats.totalClients} clientes no total
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : clients.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum cliente cadastrado
                </p>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2 pr-4">
                    {clients.map((client) => {
                      const sub = subscriptions.find(s => s.user_id === client.id && s.status === 'active');
                      return (
                        <div
                          key={client.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                {client.email.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{client.email}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(client.created_at).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          {sub && (
                            <Badge className="bg-admin-success/20 text-admin-success border-admin-success/30">
                              Ativo
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Grid for Devices and Suspicious Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Devices */}
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-admin-info/10 p-2">
                  <Monitor className="h-5 w-5 text-admin-info" />
                </div>
                <div>
                  <CardTitle>Dispositivos Autorizados</CardTitle>
                  <CardDescription>
                    {sessions.filter(s => s.is_online).length}/{sessions.length} online agora
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-admin-info" />
                </div>
              ) : sessions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum dispositivo conectado
                </p>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3 pr-4">
                    {sessions.map((session) => {
                      const client = clients.find(c => c.id === session.user_id);
                      return (
                        <div
                          key={session.id}
                          className="flex items-start justify-between p-4 rounded-lg bg-card/50 border border-border/50"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">
                              <Monitor className="h-4 w-4 text-admin-info" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-sm font-bold text-admin-info">{session.ip_address || 'N/A'}</p>
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                {session.device_info || 'Dispositivo desconhecido'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Último: {new Date(session.last_seen).toLocaleString('pt-BR')}
                              </p>
                              <p className="text-xs mt-1">
                                <span className="text-muted-foreground">Usuário:</span>{' '}
                                <span className="text-foreground">{client?.email}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {session.is_online ? (
                              <Badge className="bg-admin-success/20 text-admin-success border-admin-success/30">
                                <span className="inline-block w-2 h-2 bg-admin-success rounded-full mr-1 animate-pulse"></span>
                                Ativo
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Offline</Badge>
                            )}
                            <div className="text-xs text-right">
                              <div className="text-muted-foreground">Score:</div>
                              <div className="font-mono font-bold text-admin-success">100/100</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Suspicious Activity */}
          <Card className="border-admin-danger/30 bg-admin-danger/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-admin-danger/20 p-2">
                  <AlertTriangle className="h-5 w-5 text-admin-danger" />
                </div>
                <div>
                  <CardTitle>Atividades Suspeitas</CardTitle>
                  <CardDescription>
                    Tentativas de acesso não autorizado
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-admin-danger" />
                </div>
              ) : activityLogs.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-admin-success mx-auto mb-2" />
                  <p className="text-muted-foreground">Nenhuma atividade suspeita detectada</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3 pr-4">
                    {activityLogs.map((log: any) => (
                      <div
                        key={log.id}
                        className="p-4 rounded-lg bg-admin-danger/10 border border-admin-danger/30"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-admin-danger" />
                            <p className="font-mono text-sm font-bold text-admin-danger">
                              {log.ip_address || 'IP Desconhecido'}
                            </p>
                          </div>
                          <Badge className="bg-admin-danger/20 text-admin-danger border-admin-danger/30">
                            Bloqueado
                          </Badge>
                        </div>
                        <div className="space-y-1 text-xs">
                          <p className="text-muted-foreground">
                            {new Date(log.created_at).toLocaleString('pt-BR')}
                          </p>
                          <p><span className="text-muted-foreground">Tipo:</span> {log.activity_type}</p>
                          {log.user_agent && (
                            <p className="text-muted-foreground truncate">{log.user_agent}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
