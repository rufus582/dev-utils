import { useLocation, useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, motion } from "motion/react";
import DevUtilsCommandPrompt from "#components/layout/command-prompt/command";
import {
  type RouteCatalogItem,
  useRouteCatalog,
} from "#hooks/use-route-catalog";
import AppLogo from "#icons/app-logo";
import { cn, getCurrentEnvironment } from "#lib/utils.ts";
import { Tooltip } from "#ui/custom-components/tooltip-wrapper";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "#ui/sidebar";
import { settingsOps } from "@/store/indexed-db/settings";
import AppSidebarContent from "./app-sidebar-content";

const VERSION_TAG = {
  production: "",
  preview: "beta",
  development: "alpha",
}[getCurrentEnvironment()];

const MotionSidebarMenuBadge = motion.create(SidebarMenuBadge);

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
          <SidebarMenuItem className="active:scale-98 transition-all">
            <SidebarMenuButton
              className="cursor-pointer rounded-3xl"
              onClick={() => handleNavigation({ routeId: "", fullPath: "/" })}
            >
              <AppLogo className="stroke-foreground" />
              <span className="text-base font-semibold">Dev-Utils.</span>
            </SidebarMenuButton>
            <AnimatePresence initial={false}>
              {VERSION_TAG && sidebarOpen && (
                <MotionSidebarMenuBadge
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "rounded-3xl bg-muted text-muted-foreground font-mono text-[0.6rem] uppercase border border-border px-2",
                    "peer-data-[active=true]/menu-button:text-muted-foreground peer-hover/menu-button:text-muted-foreground",
                  )}
                >
                  {VERSION_TAG}
                </MotionSidebarMenuBadge>
              )}
            </AnimatePresence>
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
                <AnimatePresence initial={false}>
                  {sidebarOpen && (
                    <SidebarMenuAction asChild>
                      {sidebarFooterRoutes.sidebar?.action?.({
                        fullPath: sidebarFooterRoutes.fullPath,
                        routeId: sidebarFooterRoutes.routeId,
                        isActive: curPath === sidebarFooterRoutes.routeId,
                      })}
                    </SidebarMenuAction>
                  )}
                </AnimatePresence>
              </SidebarMenuItem>
            </Tooltip>
          )}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail className="after:left-1.5 hover:after:bg-transparent group-data-[side=left]:right-0 w-2 " />
    </Sidebar>
  );
};

export default AppSidebar;
