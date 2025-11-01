import { CodeSquareIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../../ui/sidebar";
import {
  routeDefinitions,
  type RouteDefinition,
} from "@/routes/route-definitions";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { settingsOps } from "@/store/indexed-db/settings";
import { Tooltip } from "@/components/ui/custom-components/tooltip-wrapper";

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
  const { open } = useSidebar();

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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Utils</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarContentDefinitions.map((contentItem) => (
                <Tooltip
                  hidden={open}
                  key={contentItem.definitionId}
                  content={contentItem.displayable}
                  asChild
                  delayDuration={0}
                  side="right"
                  variant="secondary"
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="cursor-pointer"
                      onClick={() => handleNavigation(contentItem)}
                      isActive={
                        activePathDefinition === contentItem.definitionId
                      }
                    >
                      <>
                        {contentItem.icon}
                        <span>{contentItem.displayable}</span>
                      </>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Tooltip>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="overflow-hidden rounded-xl">
          {sidebarFooterDefinition && (
            <Tooltip
              hidden={open}
              content={sidebarFooterDefinition.displayable}
              asChild
              delayDuration={0}
              side="right"
              variant="secondary"
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="hover:font-semibold rounded-xl cursor-pointer"
                  size={open ? "lg" : "default"}
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
