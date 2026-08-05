GRANT SELECT ON public.trilhas TO anon;
GRANT SELECT ON public.exercicios TO anon;

DROP POLICY IF EXISTS "Trilhas visiveis para todos" ON public.trilhas;
CREATE POLICY "Trilhas visiveis publicamente" ON public.trilhas FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Exercicios visiveis para todos" ON public.exercicios;
CREATE POLICY "Exercicios visiveis publicamente" ON public.exercicios FOR SELECT TO anon, authenticated USING (true);