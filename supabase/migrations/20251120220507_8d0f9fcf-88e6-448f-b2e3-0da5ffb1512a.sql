-- Bloquear acesso anônimo a dados sensíveis dos usuários
-- Criar políticas que exigem autenticação para visualizar dados

-- 1. Bloquear acesso anônimo a perfis e emails
DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON public.profiles;
CREATE POLICY "Deny anonymous access to profiles"
  ON public.profiles FOR SELECT
  TO anon
  USING (false);

-- 2. Bloquear acesso anônimo a dispositivos autorizados
DROP POLICY IF EXISTS "Deny anonymous access to authorized_devices" ON public.authorized_devices;
CREATE POLICY "Deny anonymous access to authorized_devices"
  ON public.authorized_devices FOR SELECT
  TO anon
  USING (false);

-- 3. Bloquear acesso anônimo a logs de atividade
DROP POLICY IF EXISTS "Deny anonymous access to user_activity_logs" ON public.user_activity_logs;
CREATE POLICY "Deny anonymous access to user_activity_logs"
  ON public.user_activity_logs FOR SELECT
  TO anon
  USING (false);

-- 4. Bloquear acesso anônimo a assinaturas e pagamentos
DROP POLICY IF EXISTS "Deny anonymous access to subscriptions" ON public.subscriptions;
CREATE POLICY "Deny anonymous access to subscriptions"
  ON public.subscriptions FOR SELECT
  TO anon
  USING (false);

-- 5. Bloquear acesso anônimo a atividades suspeitas
DROP POLICY IF EXISTS "Deny anonymous access to suspicious_activities" ON public.suspicious_activities;
CREATE POLICY "Deny anonymous access to suspicious_activities"
  ON public.suspicious_activities FOR SELECT
  TO anon
  USING (false);

-- 6. Bloquear acesso anônimo à lista de IPs bloqueados
DROP POLICY IF EXISTS "Deny anonymous access to ip_blacklist" ON public.ip_blacklist;
CREATE POLICY "Deny anonymous access to ip_blacklist"
  ON public.ip_blacklist FOR SELECT
  TO anon
  USING (false);

-- 7. Bloquear acesso anônimo a sessões de usuários
DROP POLICY IF EXISTS "Deny anonymous access to user_sessions" ON public.user_sessions;
CREATE POLICY "Deny anonymous access to user_sessions"
  ON public.user_sessions FOR SELECT
  TO anon
  USING (false);

-- 8. Bloquear acesso anônimo a roles de usuários
DROP POLICY IF EXISTS "Deny anonymous access to user_roles" ON public.user_roles;
CREATE POLICY "Deny anonymous access to user_roles"
  ON public.user_roles FOR SELECT
  TO anon
  USING (false);

-- 9. Bloquear acesso anônimo a progresso de usuários (dados de saúde)
DROP POLICY IF EXISTS "Deny anonymous access to user_progress" ON public.user_progress;
CREATE POLICY "Deny anonymous access to user_progress"
  ON public.user_progress FOR SELECT
  TO anon
  USING (false);

-- 10. Bloquear acesso anônimo a histórico de peso
DROP POLICY IF EXISTS "Deny anonymous access to weight_history" ON public.weight_history;
CREATE POLICY "Deny anonymous access to weight_history"
  ON public.weight_history FOR SELECT
  TO anon
  USING (false);

-- 11. Bloquear acesso anônimo a calorias diárias
DROP POLICY IF EXISTS "Deny anonymous access to daily_calories" ON public.daily_calories;
CREATE POLICY "Deny anonymous access to daily_calories"
  ON public.daily_calories FOR SELECT
  TO anon
  USING (false);

-- 12. Bloquear acesso anônimo a treinos completados
DROP POLICY IF EXISTS "Deny anonymous access to completed_workouts" ON public.completed_workouts;
CREATE POLICY "Deny anonymous access to completed_workouts"
  ON public.completed_workouts FOR SELECT
  TO anon
  USING (false);

-- 13. Bloquear acesso anônimo a desafios diários
DROP POLICY IF EXISTS "Deny anonymous access to daily_challenges" ON public.daily_challenges;
CREATE POLICY "Deny anonymous access to daily_challenges"
  ON public.daily_challenges FOR SELECT
  TO anon
  USING (false);

-- 14. Bloquear acesso anônimo a conquistas
DROP POLICY IF EXISTS "Deny anonymous access to user_achievements" ON public.user_achievements;
CREATE POLICY "Deny anonymous access to user_achievements"
  ON public.user_achievements FOR SELECT
  TO anon
  USING (false);

-- 15. Bloquear acesso anônimo a pontos de usuários
DROP POLICY IF EXISTS "Deny anonymous access to user_points" ON public.user_points;
CREATE POLICY "Deny anonymous access to user_points"
  ON public.user_points FOR SELECT
  TO anon
  USING (false);

-- 16. Bloquear acesso anônimo a mensagens de chat AI (conversas privadas)
DROP POLICY IF EXISTS "Deny anonymous access to ai_chat_messages" ON public.ai_chat_messages;
CREATE POLICY "Deny anonymous access to ai_chat_messages"
  ON public.ai_chat_messages FOR SELECT
  TO anon
  USING (false);