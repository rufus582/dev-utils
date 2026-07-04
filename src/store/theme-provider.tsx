/* eslint-disable react-refresh/only-export-components */

import { useLiveQuery } from "dexie-react-hooks";
import { createContext, useContext, useEffect } from "react";
import { useIsClient } from "#hooks/use-client.ts";
import { useSystemTheme } from "#hooks/use-system-theme";
import { settingsOps } from "./indexed-db/settings";

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
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const isClient = useIsClient();
  const settings = useLiveQuery(settingsOps.get);

  let theme = settings?.theme || defaultTheme;
  if (isClient) {
    theme =
      settings?.theme ||
      (window.localStorage.getItem(storageKey) as Theme) ||
      defaultTheme;
  }

  const setTheme = async (theme: Theme) => {
    if (theme) {
      if (isClient) window.localStorage.setItem(storageKey, theme);
      await settingsOps.update({ theme });
    }
  };

  const systemTheme = useSystemTheme();

  useEffect(() => {
    const resolvedTheme = getResolvedTheme(theme, systemTheme);
    setGlobalTheme(resolvedTheme);
    window.localStorage.setItem(`${storageKey}-resolved`, resolvedTheme);
    document.cookie = `${`${storageKey}-resolved`}=${resolvedTheme}; path=/; max-age=${60 * 60 * 24 * 7}`;
  }, [theme, systemTheme, storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, settings?.theme || theme);
  }, [settings?.theme, theme, storageKey]);

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
