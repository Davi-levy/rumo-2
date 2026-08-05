import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — RUMO" },
      { name: "description", content: "Acesse sua conta na RUMO." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tipo, setTipo] = useState<"aluno" | "professor">("aluno");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) navigate({ to: "/dashboard" });
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) toast.error(error);
      else toast.success("Bem-vindo de volta.");
    } else {
      const { error } = await signUp(nome, email, password, tipo);
      if (error) toast.error(error);
      else toast.success("Conta criada. Você já está logado.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="absolute top-8 left-8">
        <Link to="/" className="font-display text-lg font-bold tracking-[0.3em]">
          RUMO
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold mb-2">
            {mode === "login" ? "Entrar" : "Criar conta"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? "Acesse sua trilha de estudos." : "Comece sua jornada agora."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {mode === "signup" && (
              <motion.div
                key="nome"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Field label="Nome" value={nome} onChange={setNome} required />
              </motion.div>
            )}
          </AnimatePresence>

          <Field label="Email" type="email" value={email} onChange={setEmail} required />
          <Field label="Senha" type="password" value={password} onChange={setPassword} required minLength={6} />




          <button
            type="submit"
            disabled={loading}
            className="ripple-btn w-full py-4 bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block w-4 h-4 border-2 border-background border-t-transparent rounded-full"
              />
            ) : mode === "login" ? (
              "Entrar"
            ) : (
              "Criar conta"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {mode === "login" ? "Ainda não tem conta? " : "Já tem conta? "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-foreground hover:underline underline-offset-4"
          >
            {mode === "login" ? "Criar conta" : "Entrar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className="w-full bg-input border border-border px-4 py-3 text-foreground focus:outline-none focus:border-foreground transition-colors"
      />
    </div>
  );
}
