import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — RUMO" }] }),
  component: Dashboard,
});

interface Trilha {
  id: string;
  nome: string;
  descricao: string;
  ordem: number;
  total: number;
  feitos: number;
  acertos: number;
}

interface Atividade {
  id: string;
  resposta: string;
  acertou: boolean;
  criado_em: string;
  exercicio: { enunciado: string; trilha: { nome: string } } | null;
}

function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: trilhasData }, { data: exsData }, { data: respsData }, { data: ativsData }] =
        await Promise.all([
          supabase.from("trilhas").select("*").order("ordem"),
          supabase.from("exercicios").select("id, trilha_id"),
          supabase.from("respostas").select("exercicio_id, acertou").eq("usuario_id", user.id),
          supabase
            .from("respostas")
            .select("id, resposta, acertou, criado_em, exercicio:exercicios(enunciado, trilha:trilhas(nome))")
            .eq("usuario_id", user.id)
            .order("criado_em", { ascending: false })
            .limit(5),
        ]);

      const exsByTrilha: Record<string, string[]> = {};
      (exsData || []).forEach((e) => {
        exsByTrilha[e.trilha_id] = [...(exsByTrilha[e.trilha_id] || []), e.id];
      });

      const respMap = new Map<string, boolean>();
      (respsData || []).forEach((r) => respMap.set(r.exercicio_id, r.acertou));

      const merged: Trilha[] = (trilhasData || []).map((t) => {
        const ids = exsByTrilha[t.id] || [];
        const feitos = ids.filter((id) => respMap.has(id)).length;
        const acertos = ids.filter((id) => respMap.get(id) === true).length;
        return { ...t, total: ids.length, feitos, acertos };
      });

      setTrilhas(merged);
      setAtividades((ativsData as unknown as Atividade[]) || []);
      setLoading(false);
    })();
  }, [user]);

  if (authLoading || !user) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Dashboard
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            Olá, {profile?.nome ?? "aluno"} <span className="inline-block">👋</span>
          </h1>
        </motion.div>

        <section className="mb-20">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-6">
            Trilhas disponíveis
          </h2>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-48 skeleton-shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {trilhas.map((t, i) => {
                const pct = t.total ? Math.round((t.feitos / t.total) * 100) : 0;
                const firstUnfinished = t.feitos < t.total;
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <Link
                      to="/trilha/$trilhaId"
                      params={{ trilhaId: t.id }}
                      className="block p-8 border border-border hover:border-foreground transition-colors duration-300 group h-full"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <span className="font-mono text-xs text-muted-foreground">
                          {String(t.ordem).padStart(2, "0")}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {t.feitos}/{t.total}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform">
                        {t.nome}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                        {t.descricao}
                      </p>
                      <div className="space-y-2">
                        <div className="h-px bg-border relative overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                            className="absolute inset-y-0 left-0 bg-foreground"
                          />
                        </div>
                        <div className="flex justify-between text-xs font-mono text-muted-foreground">
                          <span>{pct}%</span>
                          <span>{firstUnfinished ? "continuar →" : "concluído"}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-6">
            Últimas atividades
          </h2>
          {atividades.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhuma atividade ainda. Comece uma trilha.</p>
          ) : (
            <div className="border border-border">
              {atividades.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-6 px-6 py-4 border-b border-border last:border-b-0"
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      a.acertou ? "bg-foreground" : "bg-muted-foreground"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{a.exercicio?.enunciado ?? "—"}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {a.exercicio?.trilha?.nome} · {new Date(a.criado_em).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {a.acertou ? "ACERTOU" : "REVISAR"}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
