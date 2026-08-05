import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { saveAnswer } from "@/lib/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/exercicio/$id")({
  head: () => ({
    meta: [
      { title: "Exercício — RUMO" },
      { name: "description", content: "Resolva o exercício e receba feedback instantâneo da IA." },
      { property: "og:title", content: "Exercício — RUMO" },
      { property: "og:description", content: "Resolva o exercício e receba feedback instantâneo da IA." },
    ],
  }),
  component: ExercicioPage,
});

interface Ex {
  id: string;
  enunciado: string;
  resposta_correta: string;
  trilha_id: string;
  trilha: { nome: string } | null;
}

function ExercicioPage() {
  const { id } = Route.useParams();
  const [ex, setEx] = useState<Ex | null>(null);
  const [resposta, setResposta] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<{ texto: string; acertou: boolean } | null>(null);
  const [typed, setTyped] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);


  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("exercicios")
        .select("id, enunciado, resposta_correta, trilha_id, trilha:trilhas(nome)")
        .eq("id", id)
        .maybeSingle();
      setEx(data as unknown as Ex);
    })();
  }, [id]);

  // typewriter effect
  useEffect(() => {
    if (!feedback) return;
    setTyped("");
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setTyped(feedback.texto.slice(0, i));
      if (i >= feedback.texto.length && intervalRef.current) clearInterval(intervalRef.current);
    }, 18);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [feedback]);

  const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, " ").replace(/['"]/g, "");

  const handleSubmit = async () => {
    if (!ex || !resposta.trim()) return;
    setEnviando(true);
    setFeedback(null);

    // simulate IA latency
    await new Promise((r) => setTimeout(r, 900));

    const acertou = normalize(resposta).includes(normalize(ex.resposta_correta).slice(0, 8)) ||
      normalize(resposta) === normalize(ex.resposta_correta);

    const texto = acertou
      ? `Excelente. Sua resposta está correta — você demonstrou compreensão clara do conceito. Continue praticando para fixar o aprendizado e avance para o próximo exercício.`
      : `Sua resposta precisa de ajustes. Revise o enunciado com atenção e considere a estrutura esperada. Dica: a resposta esperada começa com "${ex.resposta_correta.slice(0, 12)}…". Tente novamente quando se sentir pronto.`;

    saveAnswer({
      exercicio_id: ex.id,
      resposta,
      feedback_ia: texto,
      acertou,
      criado_em: new Date().toISOString(),
    });

    setFeedback({ texto, acertou });
    setEnviando(false);
    if (acertou) toast.success("Resposta correta!");
  };



  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        {ex?.trilha_id && (
          <Link
            to="/trilha/$trilhaId"
            params={{ trilhaId: ex.trilha_id }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← {ex.trilha?.nome ?? "Trilha"}
          </Link>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">
            Exercício
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-bold leading-snug mb-12 text-balance">
            {ex?.enunciado ?? "—"}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Sua resposta
          </label>
          <textarea
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            disabled={enviando}
            rows={8}
            className="w-full bg-input border border-border px-5 py-4 font-mono text-sm text-foreground focus:outline-none focus:border-foreground transition-colors resize-y leading-relaxed"
            placeholder="Digite sua resposta aqui…"
          />
          <button
            onClick={handleSubmit}
            disabled={enviando || !resposta.trim()}
            className="ripple-btn px-8 py-3 bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-3"
          >
            {enviando ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-3 h-3 border-2 border-background border-t-transparent rounded-full"
                />
                Analisando…
              </>
            ) : (
              "Enviar para análise"
            )}
          </button>
        </motion.div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-12 pl-6 border-l-2 border-foreground"
            >
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
                Feedback IA · {feedback.acertou ? "Correto" : "Revisar"}
              </div>
              <p className="text-foreground leading-relaxed">
                {typed}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="inline-block w-2 h-5 bg-foreground ml-1 align-middle"
                />
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
