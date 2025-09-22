/* eslint-disable react-refresh/only-export-components */
import { getSystemTheme } from "@/lib/utils";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  isSystemTheme: boolean;
};

const initialState: ThemeProviderState = {
  theme: "" as ResolvedTheme,
  setTheme: () => null,
  isSystemTheme: false,
};

const setGlobalTheme = (theme: ResolvedTheme) => {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const initTheme = (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  const [theme, setTheme] = useState<Theme>(initTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(
    initTheme !== "system" ? initTheme : getSystemTheme()
  );

  const setSystemTheme = (newSystemTheme: ResolvedTheme) => {
    setGlobalTheme(newSystemTheme);
    setResolvedTheme(newSystemTheme);
  };

  useEffect(() => {
    const systemTheme = getSystemTheme(
      setSystemTheme,
      theme === "system" ? "add" : "remove"
    );

    setSystemTheme(theme === "system" ? systemTheme : theme);
  }, [theme]);

  const value: ThemeProviderState = {
    theme: resolvedTheme,
    setTheme: (theme: Theme) => {
      if (theme) {
        localStorage.setItem(storageKey, theme);
        setTheme(theme);
      }
    },
    isSystemTheme: theme === "system",
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
