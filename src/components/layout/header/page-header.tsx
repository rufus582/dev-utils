import { Icon } from "@/components/icons/huge-icon";
import { SettingsIcon } from "@/components/icons/pages";
import { useSidebar } from "@/components/ui/sidebar";
import { useLocation } from "react-router";
import { routeDefinitions } from "@/routes/route-definitions";
import { Separator } from "@/components/ui/separator";
import type React from "react";
import { Tooltip } from "@/components/ui/custom-components/tooltip-wrapper";
import SidebarToggleIcon from "@/components/icons/pages/page-header/sidebar-toggle-icon";
import SettingsDialog from "@/components/layout/header/settings-dialog";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { PWAProviderContext } from "@/store/pwa-provider";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const Header = ({
  title,
  separator,
}: {
  title?: React.ReactNode;
  separator?: boolean;
}) => {
  const location = useLocation();

  const routeDefinition = routeDefinitions.find(
    (route) => route.path === location.pathname,
  );

  const { toggleSidebar, open } = useSidebar();

  const { needRefresh } = useContext(PWAProviderContext);

  return (
    <>
      <div className="w-full flex pb-4 pt-4 justify-between">
        <Tooltip
          variant="secondary"
          content={`${open ? "Close" : "Open"} Sidebar`}
          asChild
        >
          <button
            className={cn(
              "p-2 cursor-pointer hover:bg-accent dark:hover:bg-accent/50 rounded-xl",
              open
                ? "*:*:data-[slot=sidebar-state]:w-1.75 hover:*:*:data-[slot=sidebar-state]:w-0.5 hover:*:*:data-[slot=sidebar-state]:[rx:1px]"
                : "*:*:data-[slot=sidebar-state]:w-0.5 *:*:data-[slot=sidebar-state]:[rx:1px] hover:*:*:data-[slot=sidebar-state]:w-1.75 hover:*:*:data-[slot=sidebar-state]:[rx:2px]",
            )}
            onClick={toggleSidebar}
          >
            <SidebarToggleIcon />
          </button>
        </Tooltip>
        <span className="font-bold text-2xl text-primary">
          {title ?? routeDefinition?.displayable}
        </span>
        <SettingsDialog
          trigger={
            <div className="relative">
              <AnimatePresence initial={false}>
                {needRefresh && (
                  <motion.div
                    initial={{ scale: 0, x: "-50%", y: "50%" }}
                    animate={{ scale: 1, x: 0, y: 0 }}
                    exit={{ scale: 0, x: "-50%", y: "50%" }}
                    transition={{ damping: 5 }}
                    className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-secondary-foreground"
                  />
                )}
              </AnimatePresence>
              <Button size="icon" variant="outline" className="my-auto mr-2">
                <Icon icon={SettingsIcon} strokeWidth={2.5} />
              </Button>
            </div>
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
