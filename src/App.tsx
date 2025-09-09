import RouterProvider from "./routes/routes";
import { ThemeProvider } from "./store/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="max-h-[100vh] max-w-[100vw]">
        <RouterProvider />
      </div>
    </ThemeProvider>
  );
}

export default App;
