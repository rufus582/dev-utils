import { useEffect, useState } from "react";
import HomePage from "./components/pages/HomePage/HomePage";
import { Toaster } from "./components/ui/sonner";
import { useIsMobile } from "./hooks/use-mobile";
import { getCurrentEnvironment, getSystemTheme } from "./lib/utils";
import RouterProvider from "./routes/routes";
import { ThemeProvider } from "./store/theme-provider";

function App() {
  const [favicon, setFavicon] = useState("/logo-light.svg");
  const isMobile = useIsMobile();

  const currentEnv = getCurrentEnvironment();
  let pageTitle = "DevUtils";
  if (currentEnv === "development") {
    pageTitle += " Alpha";
  } else if (currentEnv === "preview") {
    pageTitle += " Beta";
  }

  useEffect(() => {
    const setCurFavicon = (theme: "light" | "dark") => setFavicon(`/logo-${theme}.svg`);
    const curTheme = getSystemTheme(setCurFavicon);
    setCurFavicon(curTheme);
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster closeButton richColors />
      <link rel="icon" type="image/svg+xml" href={favicon} />
      <title>{pageTitle}</title>
      <div className="h-[100vh] w-[100vw] max-h-[100vh] max-w-[100vw]">
        {isMobile ? <HomePage isMobile /> : <RouterProvider />}
      </div>
    </ThemeProvider>
  );
}

export default App;
