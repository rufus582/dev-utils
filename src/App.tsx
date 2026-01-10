import HomePage from "./components/pages/HomePage/HomePage";
import { Toaster } from "./components/ui/sonner";
import { useIsMobile } from "./hooks/use-mobile";
import { getCurrentEnvironment } from "./lib/utils";
import RouterProvider from "./routes/routes";
import { ThemeProvider } from "./store/theme-provider";

function App() {
  const isMobile = useIsMobile();

  const currentEnv = getCurrentEnvironment();
  let pageTitle = "DevUtils";
  if (currentEnv === "development") {
    pageTitle += " Alpha";
  } else if (currentEnv === "preview") {
    pageTitle += " Beta";
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster closeButton richColors />
      <title>{pageTitle}</title>
      <div className="h-screen w-screen max-h-screen max-w-[100vw]">
        {isMobile ? <HomePage isMobile /> : <RouterProvider />}
      </div>
    </ThemeProvider>
  );
}

export default App;
