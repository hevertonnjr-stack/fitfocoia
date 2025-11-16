import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import CreateClientWithSubscription from '@/components/CreateClientWithSubscription';
import ManualClientApproval from '@/components/ManualClientApproval';
import CreateAdminUser from '@/components/CreateAdminUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, Users, Loader2, DollarSign, Activity, Monitor, 
  AlertTriangle, Clock, CheckCircle2, XCircle, Trash2, 
  ArrowLeft, Radio, UserX
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Stats {
  totalClients: number;
  activeSubscriptions: number;
  onlineUsers: number;
  totalRevenue: number;
  expiringIn7Days: number;
  expired: number;
}

interface Client {
  id: string;
  email: string;
  created_at: string;
}

interface AuthorizedDevice {
  id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  device_type: string;
  browser: string;
  os: string;
  score: number;
  status: string;
  first_seen: string;
  last_seen: string;
}

interface SuspiciousActivity {
  id: string;
  ip_address: string;
  user_agent: string;
  activity_type: string;
  reason: string;
  severity: string;
  status: string;
  device_info: any;
  created_at: string;
}

const Admin = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    activeSubscriptions: 0,
    onlineUsers: 0,
    totalRevenue: 0,
    expiringIn7Days: 0,
    expired: 0
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [devices, setDevices] = useState<AuthorizedDevice[]>([]);
  const [suspiciousActivities, setSuspiciousActivities] = useState<SuspiciousActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      loadData();
      setupRealtimeSubscriptions();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);

      const { data: clientsData, error: clientsError } = await supabase
        .from('profiles')
        .select('id, email, created_at')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;
      setClients(clientsData || []);

      const { data: subsData, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false});

      if (subsError) throw subsError;

      const { data: sessionsData, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('*')
        .order('last_seen', { ascending: false });

      if (sessionsError) throw sessionsError;

      const { data: devicesData, error: devicesError } = await supabase
        .from('authorized_devices')
        .select('*')
        .order('last_seen', { ascending: false });

      if (devicesError) throw devicesError;
      setDevices(devicesData || []);

      const { data: suspiciousData, error: suspiciousError } = await supabase
        .from('suspicious_activities')
        .select('*')
        .eq('status', 'new')
        .order('created_at', { ascending: false })
        .limit(20);

      if (suspiciousError) throw suspiciousError;
      setSuspiciousActivities(suspiciousData || []);

      const activeCount = (subsData || []).filter((s: any) => s.status === 'active').length;
      const onlineCount = (sessionsData || []).filter((s: any) => s.is_online).length;
      const revenue = (subsData || []).reduce((sum: number, s: any) => sum + Number(s.amount), 0);
      
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const expiringCount = (subsData || []).filter((s: any) => {
        const endDate = new Date(s.end_date);
        return s.status === 'active' && endDate > now && endDate <= sevenDaysFromNow;
      }).length;
      
      const expiredCount = (subsData || []).filter((s: any) => {
        const endDate = new Date(s.end_date);
        return endDate <= now;
      }).length;

      setStats({
        totalClients: clientsData?.length || 0,
        activeSubscriptions: activeCount,
        onlineUsers: onlineCount,
        totalRevenue: revenue,
        expiringIn7Days: expiringCount,
        expired: expiredCount
      });

    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subscriptions' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_sessions' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'authorized_devices' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'suspicious_activities' }, loadData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleBlockDevice = async (deviceId: string) => {
    try {
      const { error } = await supabase
        .from('authorized_devices')
        .update({ status: 'blocked' })
        .eq('id', deviceId);

      if (error) throw error;
      toast.success('Dispositivo bloqueado');
      loadData();
    } catch (error: any) {
      toast.error('Erro ao bloquear dispositivo');
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      const { error } = await supabase
        .from('authorized_devices')
        .delete()
        .eq('id', deviceId);

      if (error) throw error;
      toast.success('Dispositivo removido');
      loadData();
    } catch (error: any) {
      toast.error('Erro ao remover dispositivo');
    }
  };

  const handleBlockSuspiciousActivity = async (activityId: string, ipAddress: string) => {
    try {
      const { error: activityError } = await supabase
        .from('suspicious_activities')
        .update({ status: 'blocked' })
        .eq('id', activityId);

      if (activityError) throw activityError;

      const { error: blacklistError } = await supabase
        .from('ip_blacklist')
        .insert({
          ip_address: ipAddress,
          reason: 'Atividade suspeita detectada',
          blocked_by: user?.id
        });

      if (blacklistError && blacklistError.code !== '23505') throw blacklistError;

      toast.success('IP bloqueado com sucesso');
      loadData();
    } catch (error: any) {
      toast.error('Erro ao bloquear IP');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'blocked': return 'bg-destructive text-destructive-foreground';
      case 'suspicious': return 'bg-yellow-500 text-black';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Shield className="h-10 w-10 text-primary" />
                Painel Administrativo
              </h1>
              <p className="text-muted-foreground mt-2">
                Gerencie clientes, administradores e controle de acesso
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{stats.totalClients}</div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Radio className="h-4 w-4 text-primary animate-pulse" />
                Online Agora
              </CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.onlineUsers}</div>
            </CardContent>
          </Card>

          <Card className="border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.activeSubscriptions}</div>
            </CardContent>
          </Card>

          <Card className="border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Expirando em 7 dias</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{stats.expiringIn7Days}</div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Expirados</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats.expired}</div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                R$ {stats.totalRevenue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="management" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="management">Gerenciamento</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="devices">Dispositivos</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="management" className="space-y-6">
            <div className="grid gap-6">
              <CreateAdminUser />
              <CreateClientWithSubscription />
              <ManualClientApproval />
            </div>
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Lista de Clientes ({clients.length})
                </CardTitle>
                <CardDescription>Emails de todos os clientes cadastrados</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {clients.map((client) => (
                      <div
                        key={client.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{client.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Cadastrado em: {new Date(client.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Seus Dispositivos Autorizados
                    </CardTitle>
                    <CardDescription>
                      Dispositivos que podem acessar sua conta ({devices.filter(d => d.status === 'active').length}/{devices.length})
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={loadData}>
                    Atualizar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {devices.map((device) => (
                      <div
                        key={device.id}
                        className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Monitor className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-lg">{device.ip_address}</p>
                              <Badge className={getStatusColor(device.status)}>
                                {device.status === 'active' ? 'Ativo' : device.status === 'blocked' ? 'Bloqueado' : 'Suspeito'}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {device.status === 'active' && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleBlockDevice(device.id)}
                              >
                                Bloquear
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDevice(device.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Navegador:</span>
                            <span className="font-medium">{device.browser || 'Desconhecido'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Sistema:</span>
                            <span className="font-medium">{device.os || 'Desconhecido'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Dispositivo:</span>
                            <span className="font-medium">{device.device_type || 'Desconhecido'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Último acesso:</span>
                            <span className="font-medium">
                              {new Date(device.last_seen).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Score:</span>
                            <span className="font-bold text-primary">{device.score}/100</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                          <p className="break-all">User-Agent: {device.user_agent}</p>
                        </div>
                      </div>
                    ))}

                    {devices.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        Nenhum dispositivo autorizado
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Atividades Suspeitas Detectadas
                </CardTitle>
                <CardDescription>
                  Registro de tentativas de acesso não autorizado - Total: {suspiciousActivities.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {suspiciousActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="p-6 rounded-lg border-2 border-destructive/20 bg-destructive/5 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-bold text-lg text-destructive mb-2">{activity.ip_address}</p>
                            <Badge className={getSeverityColor(activity.severity)}>
                              {activity.severity.toUpperCase()}
                            </Badge>
                            <Badge className="ml-2 bg-destructive text-destructive-foreground">
                              {activity.activity_type}
                            </Badge>
                          </div>
                          {activity.status === 'new' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleBlockSuspiciousActivity(activity.id, activity.ip_address)}
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Bloquear IP
                            </Button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="bg-background/50 p-4 rounded-lg">
                            <p className="text-sm font-semibold mb-2">Motivo:</p>
                            <p className="text-sm">{activity.reason}</p>
                          </div>

                          {activity.device_info && (
                            <div className="bg-background/50 p-4 rounded-lg">
                              <p className="text-sm font-semibold mb-2">Informações do Dispositivo:</p>
                              <div className="space-y-1 text-sm">
                                <p><span className="text-muted-foreground">Navegador:</span> {activity.device_info.browser}</p>
                                <p><span className="text-muted-foreground">Sistema:</span> {activity.device_info.os}</p>
                                <p><span className="text-muted-foreground">Dispositivo:</span> {activity.device_info.device}</p>
                                {activity.device_info.resolution && (
                                  <p><span className="text-muted-foreground">Resolução:</span> {activity.device_info.resolution}</p>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="text-xs text-muted-foreground">
                            <p>Detectado em: {new Date(activity.created_at).toLocaleString('pt-BR')}</p>
                            {activity.user_agent && (
                              <p className="break-all mt-2">User-Agent: {activity.user_agent}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {suspiciousActivities.length === 0 && (
                      <div className="text-center py-12">
                        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-green-500">Nenhuma atividade suspeita detectada</p>
                        <p className="text-muted-foreground mt-2">Seu sistema está seguro</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
