import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export function Navbar() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

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
                Dashboard
              </Link>
              {role === "professor" && (
                <Link
                  to="/professor"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  activeProps={{ className: "text-foreground" }}
                >
                  Professor
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Entrar
              </Link>
              <Link
                to="/login"
                className="ripple-btn px-4 py-2 bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Começar
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
