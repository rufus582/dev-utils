import { Outlet } from "react-router";
import { SidebarProvider } from "../../ui/sidebar";
import AppSidebar from "./app-sidebar";
import Cookies from "js-cookie";
import AppError from "./app-error";

const HomeLayout = ({ showErrorLayout }: { showErrorLayout?: boolean }) => {
  const sidebarStateCookie = Cookies.get("sidebar_state");

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className="max-h-screen max-w-[100vw]"
      defaultOpen={sidebarStateCookie === "true"}
    >
      <AppSidebar />
      <main className="bg-background relative w-full overflow-scroll m-2 ml-0">
        {showErrorLayout ? <AppError /> : <Outlet />}
      </main>
    </SidebarProvider>
  );
};

export default HomeLayout;
