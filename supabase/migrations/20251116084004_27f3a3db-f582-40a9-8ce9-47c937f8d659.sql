-- Remover políticas e tabelas existentes para recriar corretamente
DROP POLICY IF EXISTS "Usuários podem ver seu próprio progresso" ON public.user_progress;
DROP POLICY IF EXISTS "Usuários podem inserir seu próprio progresso" ON public.user_progress;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio progresso" ON public.user_progress;
DROP POLICY IF EXISTS "Admins podem ver todo progresso" ON public.user_progress;
DROP POLICY IF EXISTS "Usuários podem ver suas conquistas" ON public.user_achievements;
DROP POLICY IF EXISTS "Usuários podem inserir suas conquistas" ON public.user_achievements;
DROP POLICY IF EXISTS "Admins podem ver todas conquistas" ON public.user_achievements;
DROP POLICY IF EXISTS "Usuários podem ver seu histórico de peso" ON public.weight_history;
DROP POLICY IF EXISTS "Usuários podem inserir seu histórico de peso" ON public.weight_history;
DROP POLICY IF EXISTS "Admins podem ver todo histórico de peso" ON public.weight_history;
DROP POLICY IF EXISTS "Usuários podem ver suas calorias diárias" ON public.daily_calories;
DROP POLICY IF EXISTS "Usuários podem inserir suas calorias diárias" ON public.daily_calories;
DROP POLICY IF EXISTS "Usuários podem atualizar suas calorias diárias" ON public.daily_calories;
DROP POLICY IF EXISTS "Admins podem ver todas calorias" ON public.daily_calories;
DROP POLICY IF EXISTS "Usuários podem ver seus treinos" ON public.completed_workouts;
DROP POLICY IF EXISTS "Usuários podem inserir seus treinos" ON public.completed_workouts;
DROP POLICY IF EXISTS "Admins podem ver todos treinos" ON public.completed_workouts;

DROP TRIGGER IF EXISTS update_user_progress_updated_at ON public.user_progress;
DROP TRIGGER IF EXISTS on_user_created_initialize_progress ON auth.users;
DROP FUNCTION IF EXISTS initialize_user_progress();

DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.weight_history CASCADE;
DROP TABLE IF EXISTS public.daily_calories CASCADE;
DROP TABLE IF EXISTS public.completed_workouts CASCADE;

-- Criar tabelas para rastreamento de progresso em tempo real

-- Tabela de progresso do usuário
CREATE TABLE public.user_progress (
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
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de histórico de peso
CREATE TABLE public.weight_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight DECIMAL(5,2) NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de histórico de calorias diárias
CREATE TABLE public.daily_calories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calories INTEGER NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Tabela de treinos completados
CREATE TABLE public.completed_workouts (
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
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
  ON public.user_progress FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies para user_achievements
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all achievements"
  ON public.user_achievements FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies para weight_history
CREATE POLICY "Users can view own weight history"
  ON public.weight_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight history"
  ON public.weight_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all weight history"
  ON public.weight_history FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies para daily_calories
CREATE POLICY "Users can view own daily calories"
  ON public.daily_calories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily calories"
  ON public.daily_calories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily calories"
  ON public.daily_calories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all daily calories"
  ON public.daily_calories FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies para completed_workouts
CREATE POLICY "Users can view own workouts"
  ON public.completed_workouts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts"
  ON public.completed_workouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all workouts"
  ON public.completed_workouts FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_user_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_progress_timestamp
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_user_progress_updated_at();

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

CREATE TRIGGER on_auth_user_created_init_progress
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_progress();