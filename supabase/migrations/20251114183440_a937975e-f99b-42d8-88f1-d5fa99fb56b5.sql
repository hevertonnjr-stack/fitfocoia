-- Tabela para dispositivos autorizados
CREATE TABLE IF NOT EXISTS public.authorized_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  ip_address text NOT NULL,
  user_agent text NOT NULL,
  device_type text,
  browser text,
  os text,
  screen_resolution text,
  language text,
  score integer DEFAULT 100,
  status text DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'suspicious')),
  first_seen timestamp with time zone DEFAULT now(),
  last_seen timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, ip_address)
);

-- Tabela para atividades suspeitas
CREATE TABLE IF NOT EXISTS public.suspicious_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  user_agent text,
  activity_type text NOT NULL,
  reason text NOT NULL,
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  metadata jsonb,
  status text DEFAULT 'new' CHECK (status IN ('new', 'blocked', 'resolved', 'ignored')),
  device_info jsonb,
  location_info jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabela para blacklist de IPs
CREATE TABLE IF NOT EXISTS public.ip_blacklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text UNIQUE NOT NULL,
  reason text NOT NULL,
  blocked_by uuid,
  blocked_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'removed'))
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_authorized_devices_user_id ON public.authorized_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_authorized_devices_status ON public.authorized_devices(status);
CREATE INDEX IF NOT EXISTS idx_suspicious_activities_ip ON public.suspicious_activities(ip_address);
CREATE INDEX IF NOT EXISTS idx_suspicious_activities_status ON public.suspicious_activities(status);
CREATE INDEX IF NOT EXISTS idx_ip_blacklist_ip ON public.ip_blacklist(ip_address);

-- Enable RLS
ALTER TABLE public.authorized_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suspicious_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_blacklist ENABLE ROW LEVEL SECURITY;

-- RLS Policies para authorized_devices
CREATE POLICY "Admins can view all devices"
  ON public.authorized_devices FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert devices"
  ON public.authorized_devices FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update devices"
  ON public.authorized_devices FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete devices"
  ON public.authorized_devices FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own devices"
  ON public.authorized_devices FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies para suspicious_activities
CREATE POLICY "Admins can view all suspicious activities"
  ON public.suspicious_activities FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert suspicious activities"
  ON public.suspicious_activities FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update suspicious activities"
  ON public.suspicious_activities FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies para ip_blacklist
CREATE POLICY "Admins can manage blacklist"
  ON public.ip_blacklist FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Função para atualizar last_seen em dispositivos
CREATE OR REPLACE FUNCTION update_device_last_seen()
RETURNS trigger AS $$
BEGIN
  NEW.last_seen = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_device_last_seen
  BEFORE UPDATE ON public.authorized_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_device_last_seen();