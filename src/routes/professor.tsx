import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/professor")({
  head: () => ({ meta: [{ title: "Painel do Professor — RUMO" }] }),
  component: ProfessorPage,
});

interface Linha {
  user_id: string;
  nome: string;
  email: string;
  total: number;
  acertos: number;
}

function ProfessorPage() {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate({ to: "/login" });
    else if (role !== "professor") navigate({ to: "/dashboard" });
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    if (role !== "professor") return;
    (async () => {
      const [{ data: profiles }, { data: respostas }] = await Promise.all([
        supabase.from("profiles").select("id, nome, email"),
        supabase.from("respostas").select("usuario_id, acertou"),
      ]);

      const stats = new Map<string, { total: number; acertos: number }>();
      (respostas || []).forEach((r) => {
        const cur = stats.get(r.usuario_id) || { total: 0, acertos: 0 };
        cur.total++;
        if (r.acertou) cur.acertos++;
        stats.set(r.usuario_id, cur);
      });

      const rows: Linha[] = (profiles || []).map((p) => {
        const s = stats.get(p.id) || { total: 0, acertos: 0 };
        return { user_id: p.id, nome: p.nome, email: p.email, total: s.total, acertos: s.acertos };
      });

      setLinhas(rows);
      setLoading(false);
    })();
  }, [role]);

  if (authLoading || role !== "professor") return <div className="min-h-screen bg-background" />;

  const totalAlunos = linhas.length;
  const totalExs = linhas.reduce((a, l) => a + l.total, 0);
  const taxaGeral = totalExs ? Math.round((linhas.reduce((a, l) => a + l.acertos, 0) / totalExs) * 100) : 0;

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
            Painel
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Professor</h1>
        </motion.div>

        <div className="grid grid-cols-3 gap-px bg-border mb-16">
          {[
            { label: "Alunos", value: totalAlunos },
            { label: "Exercícios entregues", value: totalExs },
            { label: "Taxa de acerto", value: `${taxaGeral}%` },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="bg-background p-8"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
                {s.label}
              </p>
              <p className="font-display text-4xl font-bold">{s.value}</p>
            </motion.div>
          ))}
        </div>

        <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Alunos
        </h2>

        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 skeleton-shimmer" />
            ))}
          </div>
        ) : linhas.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhum aluno cadastrado ainda.</p>
        ) : (
          <div className="border border-border overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-3 bg-card font-mono text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <div className="col-span-4">Nome</div>
              <div className="col-span-4">Email</div>
              <div className="col-span-2 text-right">Exercícios</div>
              <div className="col-span-2 text-right">Acerto</div>
            </div>
            {linhas.map((l, i) => {
              const taxa = l.total ? Math.round((l.acertos / l.total) * 100) : 0;
              return (
                <motion.div
                  key={l.user_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  className="grid grid-cols-12 px-6 py-4 border-b border-border last:border-b-0 hover:bg-card transition-colors text-sm"
                >
                  <div className="col-span-4 font-medium">{l.nome}</div>
                  <div className="col-span-4 text-muted-foreground truncate">{l.email}</div>
                  <div className="col-span-2 text-right font-mono">{l.total}</div>
                  <div className="col-span-2 text-right font-mono">
                    {l.total ? `${taxa}%` : "—"}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
