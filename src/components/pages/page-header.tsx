import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "../ui/custom-components/theme-toggle";
import { useLocation } from "react-router";
import { routeDefinitions } from "@/routes/route-definitions";
import { Separator } from "../ui/separator";
import type React from "react";
import { Tooltip } from "../ui/custom-components/tooltip-wrapper";

const Header = ({title}: {title?: React.ReactNode}) => {
  const location = useLocation()

  const routeDefinition = routeDefinitions.find(route => route.path === location.pathname)
  
  return (
    <>
      <div className="w-full flex pb-4 pt-4 justify-between">
        <Tooltip content="Toggle Sidebar" asChild>
          <SidebarTrigger className="my-auto" />
        </Tooltip>
        <span className="font-bold text-2xl text-primary">
          {title ?? routeDefinition?.displayable}
        </span>
        <ThemeToggle variant="outline" className="my-auto" />
      </div>
      <div className="grid grid-cols-1">
        <Separator className="mb-4" />
      </div>
    </>
  );
};

export default Header
