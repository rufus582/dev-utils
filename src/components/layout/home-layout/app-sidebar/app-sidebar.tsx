import { CodeSquareIcon } from "lucide-react";
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
} from "../../../ui/sidebar";
import {
  routeDefinitions,
  type RouteDefinition,
} from "@/routes/route-definitions";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { settingsOps } from "@/store/indexed-db/settings";
import { Tooltip } from "@/components/ui/custom-components/tooltip-wrapper";
import DevUtilsCommandPrompt from "../command-prompt/command";
import { AnimatePresence, motion } from "motion/react";
import AppSidebarContent from "./app-sidebar-content";

const AppSidebar = () => {
  const [activePathDefinition, setActivePathDefinition] = useState<number>(-1);
  const sidebarContentDefinitions = routeDefinitions.filter(
    (def) => def.sidebarPlace === "content"
  );
  const sidebarFooterDefinition = routeDefinitions.find(
    (def) => def.sidebarPlace === "footer"
  );

  const settings = useLiveQuery(settingsOps.get);

  const navigate = useNavigate();
  const { open: sidebarOpen } = useSidebar();

  const handleNavigation = (routeDefinition: Partial<RouteDefinition>) => {
    setActivePathDefinition(
      routeDefinition.definitionId === undefined
        ? -1
        : routeDefinition.definitionId
    );
    navigate(routeDefinition.path ?? "/", {
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
              onClick={() => handleNavigation({ definitionId: -1, path: "/" })}
            >
              <>
                <CodeSquareIcon />
                <span className="text-base font-semibold">Dev-Utils.</span>
              </>
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
          activePathDefinition={activePathDefinition}
          sidebarContentDefinitions={sidebarContentDefinitions}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="overflow-hidden rounded-xl">
          {sidebarFooterDefinition && (
            <Tooltip
              hidden={sidebarOpen}
              content={sidebarFooterDefinition.displayable}
              asChild
              delayDuration={0}
              side="right"
              variant="secondary"
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="hover:font-semibold rounded-xl cursor-pointer"
                  size={sidebarOpen ? "lg" : "default"}
                  isActive={
                    activePathDefinition ===
                    sidebarFooterDefinition.definitionId
                  }
                  onClick={() => handleNavigation(sidebarFooterDefinition)}
                >
                  <>
                    {sidebarFooterDefinition.icon}
                    <span className="transition-all delay-100 duration-150">
                      {sidebarFooterDefinition.displayable}
                    </span>
                  </>
                </SidebarMenuButton>
                <SidebarMenuAction asChild>
                  {sidebarFooterDefinition.actionElement?.({
                    definition: sidebarFooterDefinition,
                    isActive:
                      activePathDefinition ===
                      sidebarFooterDefinition.definitionId,
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
