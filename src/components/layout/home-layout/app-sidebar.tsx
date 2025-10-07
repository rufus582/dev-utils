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

const AppSidebar = () => {
  const [activePathDefinition, setActivePathDefinition] = useState<number>(-1);
  const sidebarContentDefinitions = routeDefinitions.filter(
    (def) => def.sidebarPlace === "content"
  );
  const sidebarFooterDefinition = routeDefinitions.find(
    (def) => def.sidebarPlace === "footer"
  );

  const shouldAnimate = import.meta.env.VITE_PAGE_TRANSITION_ANIMATIONS === "true";

  const navigate = useNavigate();
  const { open } = useSidebar();

  const handleNavigation = (routeDefinition: Partial<RouteDefinition>) => {
    setActivePathDefinition(
      routeDefinition.definitionId === undefined
        ? -1
        : routeDefinition.definitionId
    );
    navigate(routeDefinition.path ?? "/", { viewTransition: shouldAnimate });
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
                <SidebarMenuItem key={contentItem.definitionId}>
                  <SidebarMenuButton
                    className="cursor-pointer"
                    onClick={() => handleNavigation(contentItem)}
                    isActive={activePathDefinition === contentItem.definitionId}
                  >
                    <>
                      {contentItem.icon}
                      <span>{contentItem.displayable}</span>
                    </>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="overflow-hidden rounded-xl">
          {sidebarFooterDefinition && (
            <SidebarMenuItem>
              <SidebarMenuButton
                className="hover:font-semibold rounded-xl cursor-pointer"
                size={open ? "lg" : "default"}
                isActive={
                  activePathDefinition === sidebarFooterDefinition.definitionId
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
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
