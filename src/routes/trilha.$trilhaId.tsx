import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { getProgress } from "@/lib/progress";

export const Route = createFileRoute("/trilha/$trilhaId")({
  head: () => ({
    meta: [
      { title: "Trilha — RUMO" },
      { name: "description", content: "Exercícios da trilha de programação, um passo por vez." },
      { property: "og:title", content: "Trilha — RUMO" },
      { property: "og:description", content: "Exercícios da trilha de programação, um passo por vez." },
    ],
  }),
  component: TrilhaPage,
});

function TrilhaPage() {
  const { trilhaId } = Route.useParams();
  const [trilha, setTrilha] = useState<{ nome: string; descricao: string } | null>(null);
  const [exs, setExs] = useState<Array<{ id: string; enunciado: string; ordem: number; feito: boolean; acertou: boolean }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: t }, { data: e }] = await Promise.all([
        supabase.from("trilhas").select("nome, descricao").eq("id", trilhaId).maybeSingle(),
        supabase.from("exercicios").select("id, enunciado, ordem").eq("trilha_id", trilhaId).order("ordem"),
      ]);
      const progresso = getProgress();
      setTrilha(t);
      setExs(
        (e || []).map((x) => ({
          ...x,
          feito: !!progresso[x.id],
          acertou: progresso[x.id]?.acertou === true,
        }))
      );
      setLoading(false);
    })();
  }, [trilhaId]);


  if (authLoading || !user) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 mb-16"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{trilha?.nome ?? "—"}</h1>
          <p className="text-muted-foreground text-lg">{trilha?.descricao}</p>
        </motion.div>

        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 skeleton-shimmer" />
            ))}
          </div>
        ) : (
          <div className="border border-border">
            {exs.map((ex, i) => (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to="/exercicio/$id"
                  params={{ id: ex.id }}
                  className="flex items-center gap-6 px-6 py-6 border-b border-border last:border-b-0 hover:bg-card transition-colors group"
                >
                  <span className="font-mono text-xs text-muted-foreground w-8">
                    {String(ex.ordem).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <p className="text-foreground group-hover:translate-x-1 transition-transform">
                      {ex.enunciado}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {ex.feito ? (ex.acertou ? "✓ ACERTOU" : "REVISAR") : "PENDENTE"}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
