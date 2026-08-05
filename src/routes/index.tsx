import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { RevealText } from "@/components/RevealText";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RUMO — Aprenda a programar com IA" },
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
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(circle at center, black 30%, transparent 70%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 border border-border text-xs font-mono text-muted-foreground mb-8"
          >
            <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
            PLATAFORMA DE ESTUDOS
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] text-balance">
            <RevealText text="Aprenda a programar" />
            <br />
            <RevealText text="com o apoio da IA" delay={0.5} className="text-muted-foreground" />
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
            Tudo que você precisa para evoluir.
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
          <div className="font-display font-bold tracking-[0.3em] text-foreground">RUMO</div>
          <div>© {new Date().getFullYear()} — Plataforma de estudos de programação.</div>
        </div>
      </footer>
    </div>
  );
}
