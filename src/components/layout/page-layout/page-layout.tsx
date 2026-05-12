import { Outlet, useLoaderData } from "@tanstack/react-router";
import AppSidebar from "#components/layout/app-sidebar/app-sidebar";
import DevUtilsCommandPrompt from "#components/layout/command-prompt/command";
import { SidebarProvider } from "#ui/sidebar";

const PageLayout = () => {
  const sidebarStateCookie = useLoaderData({
    from: "__root__",
    select: (s) => s?.sidebarState,
  });

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className="max-h-screen max-w-[100vw]"
      defaultOpen={
        sidebarStateCookie === "true" || sidebarStateCookie === undefined
      }
    >
      <AppSidebar />
      <main className="bg-background relative w-full overflow-scroll m-2 ml-0">
        <DevUtilsCommandPrompt setupGlobalShortcut />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default PageLayout;
