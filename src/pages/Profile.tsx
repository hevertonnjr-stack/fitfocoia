import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Upload, Save, Mail, IdCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AISupport from "@/components/AISupport";

export default function Profile() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
      setFullName(data.full_name || "");
      setAvatarUrl(data.avatar_url || "");
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      
      loadProfile();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos de senha.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A nova senha e a confirmação devem ser iguais.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter no mínimo 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Senha alterada!",
        description: "Sua senha foi atualizada com sucesso.",
      });
      
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Erro ao alterar senha",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
      </div>

      <div className="grid gap-6">
        {/* Avatar e Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-2xl">
                    {fullName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="avatar-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Alterar Foto
                    </span>
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>

              <div className="flex-1 w-full space-y-4">
                <div>
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="userId" className="flex items-center gap-2">
                    <IdCard className="w-4 h-4" />
                    ID de Usuário
                  </Label>
                  <div className="px-4 py-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="font-mono font-bold text-primary text-lg">
                      {profile?.user_display_id || "Carregando..."}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Seu ID único no FitFoco</p>
                  </div>
                </div>

                <Button onClick={handleUpdateProfile} disabled={loading} className="w-full md:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Informações
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alterar Senha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
              />
            </div>

            <Button onClick={handleChangePassword} disabled={loading} variant="secondary">
              <Lock className="w-4 h-4 mr-2" />
              Alterar Senha
            </Button>
          </CardContent>
        </Card>

        {/* Configurações da Conta */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Status da Assinatura</p>
                <p className="text-sm text-muted-foreground">Sua assinatura está ativa</p>
              </div>
              <Button variant="outline" size="sm">Ver Detalhes</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Notificações</p>
                <p className="text-sm text-muted-foreground">Gerencie suas preferências</p>
              </div>
              <Button variant="outline" size="sm">Configurar</Button>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={signOut} variant="destructive" className="w-full">
                Sair da Conta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Suporte AI */}
        <Card>
          <CardHeader>
            <CardTitle>Suporte Inteligente 24/7</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Converse com nossa IA treinada para te ajudar com treinos, nutrição e dúvidas sobre o FitFoco.
            </p>
            <AISupport />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
