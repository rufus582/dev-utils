import { useLocation, useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, motion } from "motion/react";
import AppLogo from "#icons/app-logo";
import { Tooltip } from "#ui/custom-components/tooltip-wrapper";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "#ui/sidebar";
import { settingsOps } from "@/store/indexed-db/settings";
import DevUtilsCommandPrompt from "#components/layout/command-prompt/command";
import AppSidebarContent from "./app-sidebar-content";
import {
  type RouteCatalogItem,
  useRouteCatalog,
} from "#hooks/use-route-catalog";

const AppSidebar = () => {
  const routeCatalog = useRouteCatalog();

  const curPath = useLocation({
    select: (loc) => loc.pathname,
  });

  const sidebarContentRoutes = routeCatalog.filter(
    (r) => r.sidebar?.place === "content",
  );
  const sidebarFooterRoutes = routeCatalog.find(
    (r) => r.sidebar?.place === "footer",
  );

  const settings = useLiveQuery(settingsOps.get);

  const navigate = useNavigate();
  const { open: sidebarOpen } = useSidebar();

  const handleNavigation = (route: Partial<RouteCatalogItem>) => {
    navigate({
      to: route.fullPath,
      viewTransition: settings?.pageTransition,
    });
  };

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer"
              onClick={() => handleNavigation({ routeId: "", fullPath: "/" })}
            >
              <AppLogo className="stroke-foreground" />
              <span className="text-base font-semibold">Dev-Utils.</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="group-data-[state=collapsed]:gap-0">
        <SidebarMenu className="px-2">
          <SidebarMenuItem>
            <AnimatePresence initial={false}>
              {sidebarOpen && (
                <motion.div
                  initial={{
                    scaleY: 0,
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{
                    scaleY: 1,
                    height: "2.5rem",
                    opacity: 1,
                  }}
                  exit={{
                    scaleY: 0,
                    height: 0,
                    opacity: 0,
                  }}
                  transition={{
                    type: "spring",
                    damping: 20,
                  }}
                >
                  <DevUtilsCommandPrompt showSearchBar className="h-10" />
                </motion.div>
              )}
            </AnimatePresence>
          </SidebarMenuItem>
        </SidebarMenu>
        <AppSidebarContent
          navigate={handleNavigation}
          activeRouteId={curPath}
          sidebarContentRoutes={sidebarContentRoutes}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="overflow-hidden rounded-xl">
          {sidebarFooterRoutes && (
            <Tooltip
              hidden={sidebarOpen}
              content={sidebarFooterRoutes.sidebar?.label ?? ""}
              asChild
              delayDuration={0}
              side="right"
              variant="secondary"
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="rounded-xl cursor-pointer active:scale-98 transition-transform"
                  size={sidebarOpen ? "lg" : "default"}
                  isActive={curPath === sidebarFooterRoutes.routeId}
                  onClick={() => handleNavigation(sidebarFooterRoutes)}
                >
                  {sidebarFooterRoutes.sidebar?.icon}
                  <span className="transition-all delay-100 duration-150">
                    {sidebarFooterRoutes.sidebar?.label}
                  </span>
                </SidebarMenuButton>
                <SidebarMenuAction asChild>
                  {sidebarFooterRoutes.sidebar?.action?.({
                    fullPath: sidebarFooterRoutes.fullPath,
                    routeId: sidebarFooterRoutes.routeId,
                    isActive: curPath === sidebarFooterRoutes.routeId,
                  })}
                </SidebarMenuAction>
              </SidebarMenuItem>
            </Tooltip>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
