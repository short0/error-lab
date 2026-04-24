import { Link } from "@tanstack/react-router";
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function Header({ liveMode = false }: { liveMode?: boolean }) {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border bg-card">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          Error Analysis Lab
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {liveMode && (
            <span className="mr-2 inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              Live mode
            </span>
          )}
          <Link
            to="/lab"
            className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            activeProps={{ className: "rounded-md px-2.5 py-1.5 bg-accent text-foreground" }}
          >
            Lab
          </Link>
          <Link
            to="/about"
            className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            activeProps={{ className: "rounded-md px-2.5 py-1.5 bg-accent text-foreground" }}
          >
            About
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
