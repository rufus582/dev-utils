import {
  CodeSquareIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import { routeDefinitions } from "@/routes/route-definitions";
import { NavLink } from "react-router";
import { useState } from "react";

const AppSidebar = () => {
  const [activePathDefinition, setActivePathDefinition] = useState<number>()

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer"
              asChild
            >
              <NavLink to="/" viewTransition>
                {
                  () => {
                    setActivePathDefinition(-1)
                    return (
                      <>
                        <CodeSquareIcon />{" "}
                        <span className="text-base font-semibold">Dev-Utils.</span>
                      </>
                    )
                  }
                }
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Utils</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routeDefinitions.map((route) => (
                <SidebarMenuItem key={route.definitionId}>
                  <SidebarMenuButton
                    asChild
                    isActive={activePathDefinition === route.definitionId}
                  >
                    <NavLink to={route.path} viewTransition>
                      {({isActive}) => {
                        if (isActive) {
                          setActivePathDefinition(route.definitionId)
                        }
                        return (
                          <>
                            {route.icon}
                            <span>{route.displayable}</span>
                          </>
                        );
                      }}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
