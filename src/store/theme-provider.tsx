/* eslint-disable react-refresh/only-export-components */
import {
  getSystemTheme,
  getSystemThemeChangeEventHandler,
} from "@/lib/theme-utils";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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

  const systemTheme = getSystemTheme();
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(
    initTheme !== "system" ? initTheme : systemTheme.theme
  );

  const setSystemTheme = (newSystemTheme: ResolvedTheme) => {
    setGlobalTheme(newSystemTheme);
    setResolvedTheme(newSystemTheme);
  };

  const onThemeChange = useCallback(
    (ev: MediaQueryListEvent) =>
      getSystemThemeChangeEventHandler(setSystemTheme)(ev),
    []
  );

  useEffect(() => {
    const systemTheme = getSystemTheme();

    if (theme === "system") {
      systemTheme.listener.addEventListener("change", onThemeChange);
      setSystemTheme(systemTheme.theme);
    } else {
      setSystemTheme(theme);
    }

    return () =>
      systemTheme.listener.removeEventListener("change", onThemeChange);
  }, [theme, onThemeChange]);

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
