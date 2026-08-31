import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Github, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RUMO" },
      { name: "description", content: "Trilhas de exercícios com feedback inteligente." },
    ],
  }),
  component: Index,
});

const features = [
  { num: "01", title: "Trilhas", desc: "Caminhos estruturados, do básico ao avançado, organizados por tema." },
  { num: "02", title: "Feedback IA", desc: "Análise instantânea da sua resposta com sugestões personalizadas." },
  { num: "03", title: "Progresso", desc: "Acompanhe sua evolução em cada trilha de forma clara e objetiva." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="relative max-w-5xl mx-auto text-center">
          {/* PLATAFORMA DE ESTUDOS badge removed */}

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] text-balance">
            <span>Aprenda a programar</span>
            <br />
            <span className="text-muted-foreground">com o apoio da IA</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Trilhas de exercícios com feedback inteligente e personalizado.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="mt-12 flex items-center justify-center gap-4"
          >
            <Link
              to="/dashboard"
              className="ripple-btn px-8 py-4 bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Começar agora
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-4 border border-border text-foreground hover:border-foreground transition-colors"
            >
              Ver trilhas
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-32 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-5xl font-bold mb-16 max-w-2xl"
          >
            Tudo que você precisa para progredir
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-px bg-border">
            {features.map((f, i) => (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ backgroundColor: "oklch(0.08 0 0)" }}
                className="bg-background p-10 group cursor-default border border-transparent hover:border-foreground transition-colors duration-300"
              >
                <div className="font-mono text-xs text-muted-foreground mb-8">{f.num}</div>
                <h3 className="font-display text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1 font-display font-bold tracking-[0.3em] text-foreground">
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            <span className="logo-outline">RUMO</span>
          </div>
          <div />
          <a
            href="https://github.com/Davi-levy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-foreground transition-colors"
            aria-label="GitHub do RUMO"
          >
            <Github size={18} />
            <span>GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
