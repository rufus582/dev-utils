import { Outlet } from "react-router";
import { SidebarProvider } from "../../ui/sidebar";
import AppSidebar from "./app-sidebar";

const HomeLayout = () => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 50)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className="max-h-[100vh] max-w-[100vw]"
    >
      <AppSidebar />
      <main className="bg-background relative w-full overflow-scroll m-2 ml-0">
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default HomeLayout;
