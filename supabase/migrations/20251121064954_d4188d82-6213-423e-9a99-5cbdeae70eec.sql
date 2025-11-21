-- ============================================
-- MIGRATION: Correção Crítica de Segurança RLS
-- Data: 2025-11-21
-- Descrição: Adiciona políticas DENY explícitas para bloquear 
-- acesso anônimo a TODAS as tabelas sensíveis
-- ============================================

-- 1. CRÍTICO: Proteger emails e dados pessoais na tabela profiles
DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON public.profiles;
CREATE POLICY "Deny anonymous access to profiles"
  ON public.profiles
  FOR ALL
  TO anon
  USING (false);

-- 2. CRÍTICO: Proteger informações de pagamento e assinaturas
DROP POLICY IF EXISTS "Deny anonymous access to subscriptions" ON public.subscriptions;
CREATE POLICY "Deny anonymous access to subscriptions"
  ON public.subscriptions
  FOR ALL
  TO anon
  USING (false);

-- 3. CRÍTICO: Proteger IPs e fingerprints de dispositivos
DROP POLICY IF EXISTS "Deny anonymous access to authorized_devices" ON public.authorized_devices;
CREATE POLICY "Deny anonymous access to authorized_devices"
  ON public.authorized_devices
  FOR ALL
  TO anon
  USING (false);

-- 4. CRÍTICO: Proteger dados de blacklist de segurança
DROP POLICY IF EXISTS "Deny anonymous access to ip_blacklist" ON public.ip_blacklist;
CREATE POLICY "Deny anonymous access to ip_blacklist"
  ON public.ip_blacklist
  FOR ALL
  TO anon
  USING (false);

-- 5. CRÍTICO: Proteger logs de atividades suspeitas
DROP POLICY IF EXISTS "Deny anonymous access to suspicious_activities" ON public.suspicious_activities;
CREATE POLICY "Deny anonymous access to suspicious_activities"
  ON public.suspicious_activities
  FOR ALL
  TO anon
  USING (false);

-- 6. IMPORTANTE: Proteger roles e permissões de usuários
DROP POLICY IF EXISTS "Deny anonymous access to user_roles" ON public.user_roles;
CREATE POLICY "Deny anonymous access to user_roles"
  ON public.user_roles
  FOR ALL
  TO anon
  USING (false);

-- 7. IMPORTANTE: Proteger sessões de usuários
DROP POLICY IF EXISTS "Deny anonymous access to user_sessions" ON public.user_sessions;
CREATE POLICY "Deny anonymous access to user_sessions"
  ON public.user_sessions
  FOR ALL
  TO anon
  USING (false);

-- 8. IMPORTANTE: Proteger logs de atividades
DROP POLICY IF EXISTS "Deny anonymous access to user_activity_logs" ON public.user_activity_logs;
CREATE POLICY "Deny anonymous access to user_activity_logs"
  ON public.user_activity_logs
  FOR ALL
  TO anon
  USING (false);

-- 9. IMPORTANTE: Proteger conversas com AI
DROP POLICY IF EXISTS "Deny anonymous access to ai_chat_messages" ON public.ai_chat_messages;
CREATE POLICY "Deny anonymous access to ai_chat_messages"
  ON public.ai_chat_messages
  FOR ALL
  TO anon
  USING (false);

-- 10. IMPORTANTE: Proteger dados de progresso do usuário
DROP POLICY IF EXISTS "Deny anonymous access to user_progress" ON public.user_progress;
CREATE POLICY "Deny anonymous access to user_progress"
  ON public.user_progress
  FOR ALL
  TO anon
  USING (false);

-- 11. IMPORTANTE: Proteger histórico de peso
DROP POLICY IF EXISTS "Deny anonymous access to weight_history" ON public.weight_history;
CREATE POLICY "Deny anonymous access to weight_history"
  ON public.weight_history
  FOR ALL
  TO anon
  USING (false);

-- 12. IMPORTANTE: Proteger dados de calorias diárias
DROP POLICY IF EXISTS "Deny anonymous access to daily_calories" ON public.daily_calories;
CREATE POLICY "Deny anonymous access to daily_calories"
  ON public.daily_calories
  FOR ALL
  TO anon
  USING (false);

-- 13. IMPORTANTE: Proteger histórico de treinos
DROP POLICY IF EXISTS "Deny anonymous access to completed_workouts" ON public.completed_workouts;
CREATE POLICY "Deny anonymous access to completed_workouts"
  ON public.completed_workouts
  FOR ALL
  TO anon
  USING (false);

-- 14. Proteger desafios diários
DROP POLICY IF EXISTS "Deny anonymous access to daily_challenges" ON public.daily_challenges;
CREATE POLICY "Deny anonymous access to daily_challenges"
  ON public.daily_challenges
  FOR ALL
  TO anon
  USING (false);

-- 15. Proteger conquistas de usuários
DROP POLICY IF EXISTS "Deny anonymous access to user_achievements" ON public.user_achievements;
CREATE POLICY "Deny anonymous access to user_achievements"
  ON public.user_achievements
  FOR ALL
  TO anon
  USING (false);

-- 16. Proteger pontos e gamificação
DROP POLICY IF EXISTS "Deny anonymous access to user_points" ON public.user_points;
CREATE POLICY "Deny anonymous access to user_points"
  ON public.user_points
  FOR ALL
  TO anon
  USING (false);