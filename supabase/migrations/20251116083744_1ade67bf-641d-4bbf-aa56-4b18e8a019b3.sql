-- Criar tabelas para rastreamento de progresso em tempo real

-- Tabela de progresso do usuário
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight DECIMAL(5,2) DEFAULT 0,
  calories_burned INTEGER DEFAULT 0,
  steps INTEGER DEFAULT 0,
  active_minutes INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  total_workouts INTEGER DEFAULT 0,
  weight_lost DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Tabela de conquistas do usuário
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de histórico de peso
CREATE TABLE IF NOT EXISTS public.weight_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight DECIMAL(5,2) NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de histórico de calorias diárias
CREATE TABLE IF NOT EXISTS public.daily_calories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calories INTEGER NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Tabela de treinos completados
CREATE TABLE IF NOT EXISTS public.completed_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  calories_burned INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_calories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_workouts ENABLE ROW LEVEL SECURITY;

-- Policies para user_progress
CREATE POLICY "Usuários podem ver seu próprio progresso"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seu próprio progresso"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio progresso"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todo progresso"
  ON public.user_progress FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies para user_achievements
CREATE POLICY "Usuários podem ver suas conquistas"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas conquistas"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas conquistas"
  ON public.user_achievements FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies para weight_history
CREATE POLICY "Usuários podem ver seu histórico de peso"
  ON public.weight_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seu histórico de peso"
  ON public.weight_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todo histórico de peso"
  ON public.weight_history FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies para daily_calories
CREATE POLICY "Usuários podem ver suas calorias diárias"
  ON public.daily_calories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas calorias diárias"
  ON public.daily_calories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas calorias diárias"
  ON public.daily_calories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas calorias"
  ON public.daily_calories FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies para completed_workouts
CREATE POLICY "Usuários podem ver seus treinos"
  ON public.completed_workouts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus treinos"
  ON public.completed_workouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos treinos"
  ON public.completed_workouts FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para inicializar progresso do usuário
CREATE OR REPLACE FUNCTION initialize_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_created_initialize_progress
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_progress();