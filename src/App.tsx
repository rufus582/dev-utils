import { getCurrentEnvironment } from "./lib/utils";
import RouterProvider from "./routes/routes";
import { ThemeProvider } from "./store/theme-provider";

function App() {
  const currentEnv = getCurrentEnvironment();
  let pageTitle = "DevUtils";
  if (currentEnv === "development") {
    pageTitle += " Alpha";
  } else if (currentEnv === "preview") {
    pageTitle += " Beta";
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <title>{pageTitle}</title>
      <div className="max-h-[100vh] max-w-[100vw]">
        <RouterProvider />
      </div>
    </ThemeProvider>
  );
}

export default App;
