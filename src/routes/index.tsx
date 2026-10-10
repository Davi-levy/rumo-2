import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RUMO — Trilhas de programação geradas por IA" },
      { name: "description", content: "Escolha qualquer linguagem ou framework e receba uma trilha de estudos com conteúdo, exercícios e progresso." },
      { property: "og:title", content: "RUMO — Trilhas de programação geradas por IA" },
      { property: "og:description", content: "Conteúdo, exercícios e progresso para qualquer linguagem ou framework." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const linguagens = ["Python", "TypeScript", "Rust", "Go", "React", "SQL", "Java", "Kotlin", "Next.js", "C"];

function GithubMark() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-48 pb-40 px-6 border-b border-border">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.08]">
            Aprenda a programar
            <br />
            <span className="text-muted-foreground">com o apoio da IA</span>
          </h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Trilhas de exercícios com feedback inteligente e personalizado.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Começar agora
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 border border-border text-sm hover:bg-muted transition-colors"
            >
              Ver trilhas
            </Link>
          </div>
        </div>
      </section>

      {/* Bento */}
      <section className="px-6 py-32">
        <div className="max-w-5xl mx-auto">
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">Como funciona</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.1] mb-16 max-w-2xl">
            Tudo o que você precisa para sair do zero.
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bento md:col-span-2">
              <div className="font-mono text-xs text-muted-foreground mb-6">01 — Trilhas</div>
              <h3 className="text-2xl font-medium mb-3">Qualquer linguagem, qualquer framework</h3>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Diga o que quer aprender e o seu nível. A trilha chega organizada em módulos, do básico ao avançado.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {linguagens.map((l) => (
                  <span key={l} className="border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <div className="bento">
              <div className="font-mono text-xs text-muted-foreground mb-6">02 — Exercícios</div>
              <h3 className="text-2xl font-medium mb-3">Correção na hora</h3>
              <p className="text-muted-foreground leading-relaxed">
                Responda e receba um retorno imediato sobre o que acertou e o que falta.
              </p>
            </div>

            <div className="bento">
              <div className="font-mono text-xs text-muted-foreground mb-6">03 — Conteúdo</div>
              <h3 className="text-2xl font-medium mb-3">Explicações com exemplos</h3>
              <p className="text-muted-foreground leading-relaxed">
                Cada módulo traz texto claro e trechos de código para estudar no seu ritmo.
              </p>
            </div>

            <div className="bento md:col-span-2">
              <div className="font-mono text-xs text-muted-foreground mb-6">04 — Progresso</div>
              <h3 className="text-2xl font-medium mb-3">Veja até onde você chegou</h3>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Seu avanço fica salvo na sua conta, trilha por trilha.
              </p>
              <div className="mt-8 h-1.5 w-full bg-secondary overflow-hidden">
                <div className="h-full w-[62%] bg-foreground" />
              </div>
              <div className="mt-3 flex justify-between font-mono text-xs text-muted-foreground">
                <span>Rust para iniciantes</span>
                <span>62%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-display font-bold tracking-[0.3em] text-foreground logo-outline">RUMO</span>
          <a
            href="https://github.com/Davi-levy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-foreground transition-colors"
            aria-label="GitHub do RUMO"
          >
            <GithubMark />
            <span>GitHub do projeto</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
