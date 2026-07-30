CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM public, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM public, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- recreate policies against private.has_role
DROP POLICY IF EXISTS "Professores gerenciam trilhas" ON public.trilhas;
CREATE POLICY "Professores gerenciam trilhas" ON public.trilhas FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'professor')) WITH CHECK (private.has_role(auth.uid(), 'professor'));

DROP POLICY IF EXISTS "Professores gerenciam exercícios" ON public.exercicios;
CREATE POLICY "Professores gerenciam exercícios" ON public.exercicios FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'professor')) WITH CHECK (private.has_role(auth.uid(), 'professor'));

DROP POLICY IF EXISTS "Aluno vê suas respostas" ON public.respostas;
CREATE POLICY "Aluno vê suas respostas" ON public.respostas FOR SELECT TO authenticated
  USING (auth.uid() = usuario_id OR private.has_role(auth.uid(), 'professor'));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
REVOKE ALL ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;

-- profiles: own profile only (professors keep access for the dashboard)
DROP POLICY IF EXISTS "Profiles selecionável por todos autenticados" ON public.profiles;
CREATE POLICY "Usuário vê próprio profile" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR private.has_role(auth.uid(), 'professor'));

-- user_roles: own role only (professors may view all); no write access at all
DROP POLICY IF EXISTS "Roles visíveis para autenticados" ON public.user_roles;
CREATE POLICY "Usuário vê próprio papel" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'professor'));
CREATE POLICY "Ninguém insere papéis" ON public.user_roles AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "Ninguém altera papéis" ON public.user_roles AS RESTRICTIVE FOR UPDATE TO authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Ninguém remove papéis" ON public.user_roles AS RESTRICTIVE FOR DELETE TO authenticated USING (false);

-- grants: no anonymous access anywhere
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trilhas TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exercicios TO authenticated;
GRANT SELECT, INSERT ON public.respostas TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;