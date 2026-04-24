import { useEffect, useState, useCallback } from "react";

export type Theme = "light" | "dark";
const KEY = "eal:theme";

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  if (t === "dark") document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    try {
      const stored = (localStorage.getItem(KEY) as Theme | null) ?? "light";
      setTheme(stored);
      applyTheme(stored);
    } catch {
      applyTheme("light");
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem(KEY, next);
      } catch {
        // ignore
      }
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
