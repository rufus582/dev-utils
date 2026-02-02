/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
} from "react";
import { settingsOps } from "./indexed-db/settings";
import { useLiveQuery } from "dexie-react-hooks";
import { useSystemTheme } from "@/hooks/use-system-theme";

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

const getResolvedTheme = (theme: Theme, systemTheme: ResolvedTheme) => {
  return theme === "system" ? systemTheme : (theme as ResolvedTheme);
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const settings = useLiveQuery(settingsOps.get);

  const theme =
    settings?.theme ||
    (localStorage.getItem(storageKey) as Theme) ||
    defaultTheme;

  const setTheme = async (theme: Theme) => {
    if (theme) {
      localStorage.setItem(storageKey, theme);
      await settingsOps.update({ theme });
    }
  };

  const systemTheme = useSystemTheme();

  useEffect(() => {
    setGlobalTheme(getResolvedTheme(theme, systemTheme));
  }, [theme, systemTheme]);

  const value: ThemeProviderState = {
    theme: getResolvedTheme(theme, systemTheme),
    setTheme,
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
