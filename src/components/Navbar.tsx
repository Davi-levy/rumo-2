import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function Navbar() {
  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1 font-display text-xl font-bold tracking-[0.3em]">
          <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          <span className="logo-outline">RUMO</span>
        </Link>
        <div className="flex items-center gap-8 text-sm">
          <Link
            to="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
            activeProps={{ className: "text-foreground" }}
          >
            Trilhas
          </Link>
        </div>
      </div>
  </nav>
  );
}
