import { useSidebar } from "@/components/ui/sidebar";
import { useLocation } from "react-router";
import { routeDefinitions } from "@/routes/route-definitions";
import { Separator } from "@/components/ui/separator";
import type React from "react";
import { Tooltip } from "@/components/ui/custom-components/tooltip-wrapper";
import SidebarToggleIcon from "@/components/icons/sidebar-toggle-icon";
import SettingsDialog from "@/components/layout/header/settings-dialog";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";

const Header = ({
  title,
  separator,
}: {
  title?: React.ReactNode;
  separator?: boolean;
}) => {
  const location = useLocation();

  const routeDefinition = routeDefinitions.find(
    (route) => route.path === location.pathname
  );

  const { toggleSidebar, open } = useSidebar();

  return (
    <>
      <div className="w-full flex pb-4 pt-4 justify-between">
        <Tooltip
          variant="secondary"
          content={`${open ? "Close" : "Open"} Sidebar`}
          asChild
        >
          <button
            className="p-2 cursor-pointer hover:bg-accent dark:hover:bg-accent/50 rounded-xl"
            onClick={toggleSidebar}
          >
            <SidebarToggleIcon isOpen={open} />
          </button>
        </Tooltip>
        <span className="font-bold text-2xl text-primary">
          {title ?? routeDefinition?.displayable}
        </span>
        <SettingsDialog
          trigger={
            <Button size="icon" variant="outline" className="my-auto mr-2">
              <SettingsIcon strokeWidth="2" />
            </Button>
          }
        />
      </div>
      {separator && (
        <div className="grid grid-cols-1">
          <Separator className="mb-4" />
        </div>
      )}
    </>
  );
};

export default Header;
