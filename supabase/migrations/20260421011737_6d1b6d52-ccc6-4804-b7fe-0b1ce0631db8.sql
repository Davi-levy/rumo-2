
-- Enum role
CREATE TYPE public.app_role AS ENUM ('aluno', 'professor');

-- profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles selecionável por todos autenticados" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuário atualiza próprio profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Usuário insere próprio profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Roles visíveis para autenticados" ON public.user_roles
  FOR SELECT TO authenticated USING (true);

-- security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.email
  );

  user_role := COALESCE((NEW.raw_user_meta_data->>'tipo')::public.app_role, 'aluno'::public.app_role);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, user_role);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- trilhas
CREATE TABLE public.trilhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.trilhas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trilhas visíveis para autenticados" ON public.trilhas
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Professores gerenciam trilhas" ON public.trilhas
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'professor'))
  WITH CHECK (public.has_role(auth.uid(), 'professor'));

-- exercicios
CREATE TABLE public.exercicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trilha_id UUID NOT NULL REFERENCES public.trilhas(id) ON DELETE CASCADE,
  enunciado TEXT NOT NULL,
  resposta_correta TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.exercicios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Exercícios visíveis para autenticados" ON public.exercicios
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Professores gerenciam exercícios" ON public.exercicios
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'professor'))
  WITH CHECK (public.has_role(auth.uid(), 'professor'));

-- respostas
CREATE TABLE public.respostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercicio_id UUID NOT NULL REFERENCES public.exercicios(id) ON DELETE CASCADE,
  resposta TEXT NOT NULL,
  feedback_ia TEXT,
  acertou BOOLEAN NOT NULL DEFAULT false,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.respostas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Aluno vê suas respostas" ON public.respostas
  FOR SELECT TO authenticated USING (auth.uid() = usuario_id OR public.has_role(auth.uid(), 'professor'));
CREATE POLICY "Aluno cria respostas" ON public.respostas
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = usuario_id);

-- seed data
INSERT INTO public.trilhas (id, nome, descricao, ordem) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Python Básico', 'Fundamentos da linguagem Python: variáveis, tipos e estruturas.', 1),
  ('22222222-2222-2222-2222-222222222222', 'Lógica de Programação', 'Pensamento computacional, algoritmos e resolução de problemas.', 2),
  ('33333333-3333-3333-3333-333333333333', 'Desenvolvimento Web', 'HTML, CSS e JavaScript para construir suas primeiras páginas.', 3);

INSERT INTO public.exercicios (trilha_id, enunciado, resposta_correta, ordem) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Crie uma variável chamada nome e atribua o valor "Rumo".', 'nome = "Rumo"', 1),
  ('11111111-1111-1111-1111-111111111111', 'Escreva um print que mostre o resultado de 7 multiplicado por 6.', 'print(7 * 6)', 2),
  ('11111111-1111-1111-1111-111111111111', 'Crie uma lista chamada cores com três cores em string.', 'cores = ["preto", "branco", "cinza"]', 3),
  ('22222222-2222-2222-2222-222222222222', 'Descreva em uma linha como inverter uma string.', 'usar slicing s[::-1]', 1),
  ('22222222-2222-2222-2222-222222222222', 'Qual estrutura usar para repetir um bloco N vezes?', 'for', 2),
  ('33333333-3333-3333-3333-333333333333', 'Qual tag HTML usamos para o maior título?', 'h1', 1),
  ('33333333-3333-3333-3333-333333333333', 'Qual propriedade CSS muda a cor do texto?', 'color', 2);
