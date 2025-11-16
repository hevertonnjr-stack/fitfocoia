-- Adicionar campo user_id único para cada usuário
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_display_id TEXT UNIQUE;

-- Criar função para gerar ID único de exibição
CREATE OR REPLACE FUNCTION generate_user_display_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id TEXT;
  counter INT := 0;
BEGIN
  LOOP
    -- Gerar ID no formato FITXXXX
    new_id := 'FIT' || LPAD(floor(random() * 9999 + 1)::TEXT, 4, '0');
    
    -- Verificar se já existe
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_display_id = new_id) THEN
      RETURN new_id;
    END IF;
    
    counter := counter + 1;
    IF counter > 100 THEN
      RAISE EXCEPTION 'Could not generate unique ID after 100 attempts';
    END IF;
  END LOOP;
END;
$$;

-- Atualizar usuários existentes sem ID
UPDATE public.profiles 
SET user_display_id = generate_user_display_id() 
WHERE user_display_id IS NULL;

-- Criar trigger para gerar ID automaticamente em novos usuários
CREATE OR REPLACE FUNCTION set_user_display_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_display_id IS NULL THEN
    NEW.user_display_id := generate_user_display_id();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_set_user_display_id ON public.profiles;
CREATE TRIGGER trigger_set_user_display_id
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_user_display_id();

-- Criar tabela para mensagens de chat IA
CREATE TABLE IF NOT EXISTS public.ai_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para ai_chat_messages
CREATE POLICY "Users can view own messages" ON public.ai_chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON public.ai_chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all messages" ON public.ai_chat_messages
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));