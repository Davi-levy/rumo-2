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
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 hero-glow" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Trilhas geradas por IA
          </span>

          <h1 className="mt-8 font-serif text-5xl md:text-7xl leading-[1.05] tracking-[-0.03em] text-balance">
            Aprenda a programar
            <br />
            <em className="text-muted-foreground">no seu próprio rumo.</em>
          </h1>

          <p className="mt-8 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Escolha uma linguagem ou framework. A IA monta a trilha com conteúdo, exemplos e exercícios corrigidos na hora.
          </p>

          <div className="mt-10 flex items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-md px-6 py-3 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 active:scale-[0.98] transition"
            >
              Começar agora
            </Link>
            <Link
              to="/dashboard"
              className="rounded-md px-6 py-3 border border-border text-sm hover:bg-muted transition-colors"
            >
              Suas trilhas
            </Link>
          </div>
        </div>

        {/* Window mockup */}
        <div className="relative max-w-3xl mx-auto mt-20 rounded-xl border border-border bg-card overflow-hidden text-left">
          <div className="flex items-center gap-2 px-4 h-10 border-b border-border">
            <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
            <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
            <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
            <span className="ml-3 font-mono text-xs text-muted-foreground">rumo / nova-trilha</span>
          </div>
          <div className="p-6 md:p-8 font-mono text-sm space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">&gt;</span>
              <span>Quero aprender <span className="tag-blue">Rust</span> — nível iniciante</span>
            </div>
            <div className="border-t border-border pt-5 space-y-3">
              {[
                ["01", "Ownership e borrowing", "concluído", "tag-green"],
                ["02", "Structs e enums", "em andamento", "tag-yellow"],
                ["03", "Tratamento de erros", "a seguir", "tag-muted"],
              ].map(([n, t, s, c]) => (
                <div key={n} className="flex items-center justify-between gap-4">
                  <span>
                    <span className="text-muted-foreground mr-3">{n}</span>
                    {t}
                  </span>
                  <span className={c}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bento */}
      <section className="px-6 py-32 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">Como funciona</div>
          <h2 className="font-serif text-4xl md:text-5xl tracking-[-0.02em] leading-[1.1] mb-16 max-w-2xl">
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
                  <span key={l} className="rounded-md border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground">
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
              <div className="mt-8 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
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
          <span className="font-display font-bold tracking-[0.3em] text-foreground">RUMO</span>
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
