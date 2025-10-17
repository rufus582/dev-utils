import { useCallback, useEffect, useState } from "react";
import HomePage from "./components/pages/HomePage/HomePage";
import { Toaster } from "./components/ui/sonner";
import { useIsMobile } from "./hooks/use-mobile";
import { getCurrentEnvironment } from "./lib/utils";
import RouterProvider from "./routes/routes";
import { ThemeProvider } from "./store/theme-provider";
import { getSystemTheme } from "./lib/theme-utils";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const isMobile = useIsMobile();

  const currentEnv = getCurrentEnvironment();
  let pageTitle = "DevUtils";
  if (currentEnv === "development") {
    pageTitle += " Alpha";
  } else if (currentEnv === "preview") {
    pageTitle += " Beta";
  }

  const onThemeChange = useCallback((ev: MediaQueryListEvent) => {
    setTheme(ev.matches ? "dark" : "light");
  }, []);

  useEffect(() => {
    const systemTheme = getSystemTheme();
    systemTheme.listener.addEventListener("change", onThemeChange);
    setTheme(systemTheme.theme);

    return () =>
      systemTheme.listener.removeEventListener("change", onThemeChange);
  }, [onThemeChange]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster closeButton richColors />
      <link rel="icon" type="image/svg+xml" href={`/logo-${theme}.svg`} />
      <title>{pageTitle}</title>
      <div className="h-[100vh] w-[100vw] max-h-[100vh] max-w-[100vw]">
        {isMobile ? <HomePage isMobile /> : <RouterProvider />}
      </div>
    </ThemeProvider>
  );
}

export default App;
