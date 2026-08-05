GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO supabase_auth_admin;
GRANT USAGE ON SCHEMA private TO supabase_auth_admin;

INSERT INTO public.profiles (id, nome, email)
SELECT u.id, COALESCE(u.raw_user_meta_data->>'nome', split_part(u.email, '@', 1)), u.email
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, COALESCE(NULLIF(u.raw_user_meta_data->>'tipo',''), 'aluno')::public.app_role
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id
WHERE r.user_id IS NULL;