import { Icon } from "@/components/icons/huge-icon";
import { SettingsIcon } from "@/components/icons/pages";
import { useLocation } from "react-router";
import { routeDefinitions } from "@/routes/route-definitions";
import { Separator } from "@/components/ui/separator";
import type React from "react";
import SettingsDialog from "@/components/layout/header/settings-dialog";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { PWAProviderContext } from "@/store/pwa-provider";
import { AnimatePresence, motion } from "motion/react";
import { SidebarToggle } from "@/components/ui/custom-components/sidebar-toggle";

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

  const { needRefresh } = useContext(PWAProviderContext);

  return (
    <>
      <div className="w-full flex pb-4 pt-4 justify-between">
        <SidebarToggle />
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
