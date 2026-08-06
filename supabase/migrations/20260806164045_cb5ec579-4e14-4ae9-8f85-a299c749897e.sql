-- Limpa o modelo antigo
DROP TABLE IF EXISTS public.respostas CASCADE;
DROP TABLE IF EXISTS public.exercicios CASCADE;
DROP TABLE IF EXISTS public.trilhas CASCADE;

DO $$ BEGIN
  CREATE TYPE public.nivel_trilha AS ENUM ('iniciante', 'intermediario', 'avancado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- TRILHAS
CREATE TABLE public.trilhas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  linguagem text NOT NULL,
  nivel public.nivel_trilha NOT NULL DEFAULT 'iniciante',
  titulo text NOT NULL,
  descricao text,
  criado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trilhas TO authenticated;
GRANT ALL ON public.trilhas TO service_role;
ALTER TABLE public.trilhas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuario gerencia suas trilhas" ON public.trilhas FOR ALL TO authenticated
  USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);

-- MODULOS
CREATE TABLE public.modulos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trilha_id uuid NOT NULL REFERENCES public.trilhas(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  conteudo text NOT NULL DEFAULT '',
  ordem integer NOT NULL DEFAULT 0,
  criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX modulos_trilha_id_idx ON public.modulos(trilha_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.modulos TO authenticated;
GRANT ALL ON public.modulos TO service_role;
ALTER TABLE public.modulos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuario gerencia modulos das suas trilhas" ON public.modulos FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.trilhas t WHERE t.id = modulos.trilha_id AND t.usuario_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.trilhas t WHERE t.id = modulos.trilha_id AND t.usuario_id = auth.uid()));

-- EXERCICIOS
CREATE TABLE public.exercicios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo_id uuid NOT NULL REFERENCES public.modulos(id) ON DELETE CASCADE,
  pergunta text NOT NULL,
  resposta_esperada text NOT NULL,
  dica text,
  explicacao text,
  ordem integer NOT NULL DEFAULT 0,
  criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX exercicios_modulo_id_idx ON public.exercicios(modulo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exercicios TO authenticated;
GRANT ALL ON public.exercicios TO service_role;
ALTER TABLE public.exercicios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuario gerencia exercicios das suas trilhas" ON public.exercicios FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.modulos m JOIN public.trilhas t ON t.id = m.trilha_id
    WHERE m.id = exercicios.modulo_id AND t.usuario_id = auth.uid()))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.modulos m JOIN public.trilhas t ON t.id = m.trilha_id
    WHERE m.id = exercicios.modulo_id AND t.usuario_id = auth.uid()));

-- RESPOSTAS (progresso)
CREATE TABLE public.respostas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercicio_id uuid NOT NULL REFERENCES public.exercicios(id) ON DELETE CASCADE,
  resposta text NOT NULL,
  acertou boolean NOT NULL DEFAULT false,
  feedback text,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE (usuario_id, exercicio_id)
);
CREATE INDEX respostas_usuario_id_idx ON public.respostas(usuario_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.respostas TO authenticated;
GRANT ALL ON public.respostas TO service_role;
ALTER TABLE public.respostas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuario gerencia suas respostas" ON public.respostas FOR ALL TO authenticated
  USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);

CREATE OR REPLACE FUNCTION public.touch_atualizado_em()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.atualizado_em = now(); RETURN NEW; END; $$;
REVOKE ALL ON FUNCTION public.touch_atualizado_em() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER respostas_touch BEFORE UPDATE ON public.respostas
FOR EACH ROW EXECUTE FUNCTION public.touch_atualizado_em();