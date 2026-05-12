import { TanStackDevtools } from "@tanstack/react-devtools";
import {
  createRootRoute,
  HeadContent,
  Scripts,
  useLoaderData,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { Provider as ReduxProvider } from "react-redux";
import PageLayout from "#/components/layout/page-layout/page-layout";
import AppError from "#components/layout/page-layout/app-error.tsx";
import store from "#store/redux";
import { ThemeProvider } from "#store/theme-provider";
import { Toaster } from "#ui/sonner.tsx";
import appCss from "@/styles.css?url";

const getSidebarState = createIsomorphicFn().server(() => {
  const sidebarState = getCookie("sidebar_state");
  const theme = getCookie("ui-theme-resolved");

  return {
    sidebarState,
    theme: theme as "dark" | "light",
  };
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "DevUtils",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  errorComponent: ({ error }) => <AppError error={error} />,
  notFoundComponent: () => <AppError isNotFound />,
  loader: () => getSidebarState(),
});

function RootDocument() {
  const theme = useLoaderData({ from: "__root__", select: (s) => s?.theme });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: This is needed to avoid theme flicker on page load
          dangerouslySetInnerHTML={{
            __html:
              "(function (){try{const theme = localStorage.getItem('ui-theme-resolved');if(theme){document.documentElement.classList.add(theme);}}catch(e){}})();",
          }}
        />
      </head>
      <body className="">
        <ReduxProvider store={store}>
          <ThemeProvider defaultTheme={theme ?? "dark"} storageKey="ui-theme">
            <Toaster closeButton richColors />
            <PageLayout />
          </ThemeProvider>
        </ReduxProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
