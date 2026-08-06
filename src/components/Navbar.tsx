import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function sair() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold tracking-[0.3em]">
          RUMO
        </Link>
        <div className="flex items-center gap-8 text-sm">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
                activeProps={{ className: "text-foreground" }}
              >
                Trilhas
              </Link>
              <button
                onClick={sair}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
