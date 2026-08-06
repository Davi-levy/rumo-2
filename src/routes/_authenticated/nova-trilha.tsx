import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { gerarTrilha } from "@/lib/trilha.functions";
import { NIVEIS, type Nivel } from "@/lib/trilha.server";
import { Navbar } from "@/components/Navbar";
import { RevealText } from "@/components/RevealText";
import { PageTransition } from "@/components/PageTransition";

export const Route = createFileRoute("/_authenticated/nova-trilha")({
  component: NovaTrilha,
});

const rotulos: Record<Nivel, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

const sugestoes = ["Python", "JavaScript", "React", "TypeScript", "Rust", "Go", "SQL", "Django"];

const etapas = [
  "Analisando a linguagem",
  "Desenhando os módulos",
  "Escrevendo o conteúdo",
  "Criando os exercícios",
  "Salvando sua trilha",
];

function NovaTrilha() {
  const [linguagem, setLinguagem] = useState("");
  const [nivel, setNivel] = useState<Nivel>("iniciante");
  const [gerando, setGerando] = useState(false);
  const [etapa, setEtapa] = useState(0);
  const gerar = useServerFn(gerarTrilha);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!linguagem.trim()) return;
    setGerando(true);
    setEtapa(0);

    const timer = setInterval(() => setEtapa((s) => Math.min(s + 1, etapas.length - 1)), 9000);

    try {
      const trilha = await gerar({ data: { linguagem: linguagem.trim(), nivel } });

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Sessão expirada.");

      const { data: novaTrilha, error: errTrilha } = await supabase
        .from("trilhas")
        .insert({
          usuario_id: user.user.id,
          linguagem: linguagem.trim(),
          nivel,
          titulo: trilha.titulo,
          descricao: trilha.descricao,
        })
        .select("id")
        .single();
      if (errTrilha || !novaTrilha) throw errTrilha ?? new Error("Falha ao salvar a trilha.");

      const { data: modulos, error: errModulos } = await supabase
        .from("modulos")
        .insert(
          trilha.modulos.map((m, i) => ({
            trilha_id: novaTrilha.id,
            titulo: m.titulo,
            conteudo: m.conteudo,
            ordem: i,
          })),
        )
        .select("id, ordem");
      if (errModulos || !modulos) throw errModulos ?? new Error("Falha ao salvar os módulos.");

      const porOrdem = new Map(modulos.map((m) => [m.ordem, m.id]));
      const exercicios = trilha.modulos.flatMap((m, i) =>
        m.exercicios.map((ex, j) => ({
          modulo_id: porOrdem.get(i)!,
          pergunta: ex.pergunta,
          resposta_esperada: ex.resposta_esperada,
          dica: ex.dica ?? null,
          explicacao: ex.explicacao ?? null,
          ordem: j,
        })),
      );
      const { error: errEx } = await supabase.from("exercicios").insert(exercicios);
      if (errEx) throw errEx;

      toast.success("Trilha criada!");
      navigate({ to: "/trilha/$trilhaId", params: { trilhaId: novaTrilha.id } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao gerar trilha";
      toast.error(/429|rate/i.test(msg) ? "Muitas gerações agora. Tente em instantes." : msg);
      setGerando(false);
    } finally {
      clearInterval(timer);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="max-w-2xl mx-auto px-6 pt-32 pb-24">
          {gerando ? (
            <div className="py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                className="h-12 w-12 border border-border border-t-foreground rounded-full"
              />
              <h1 className="mt-10 font-display text-3xl font-bold">Gerando sua trilha</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Isso leva cerca de um minuto. Não feche a página.
              </p>
              <ul className="mt-10 space-y-3">
                {etapas.map((e, i) => (
                  <li
                    key={e}
                    className={`text-sm transition-colors ${
                      i <= etapa ? "text-foreground" : "text-muted-foreground/40"
                    }`}
                  >
                    {i < etapa ? "— " : i === etapa ? "› " : "  "}
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <h1 className="font-display text-4xl font-bold">
                <RevealText text="Nova trilha" />
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Diga o que você quer aprender. A IA monta os módulos, o conteúdo e os exercícios.
              </p>

              <form onSubmit={submit} className="mt-12 space-y-8">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">
                    Linguagem ou framework
                  </label>
                  <input
                    value={linguagem}
                    onChange={(e) => setLinguagem(e.target.value)}
                    placeholder="Ex: React, Rust, Django..."
                    className="mt-3 w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sugestoes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setLinguagem(s)}
                        className="border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Nível</label>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {NIVEIS.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setNivel(n)}
                        className={`border px-4 py-3 text-sm transition-colors ${
                          nivel === n
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {rotulos[n]}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!linguagem.trim()}
                  className="w-full bg-primary text-primary-foreground py-4 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  Gerar trilha com IA
                </button>
              </form>
            </>
          )}
        </main>
      </PageTransition>
    </div>
  );
}
