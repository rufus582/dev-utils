import {
  useMatchRoute,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useRouteCatalog } from "#hooks/use-route-catalog";
import { Icon } from "#icons/huge-icon";
import { SettingsIcon } from "#icons/pages";
import { settingsOps } from "#store/indexed-db/settings.ts";
import { usePWA } from "#store/pwa-provider.tsx";
import { Button } from "#ui/button";
import { SidebarToggle } from "#ui/custom-components/sidebar-toggle";
import { Separator } from "#ui/separator";

const Header = ({
  title,
  separator,
}: {
  title?: React.ReactNode;
  separator?: boolean;
}) => {
  const { needRefresh } = usePWA();

  const navigate = useNavigate();
  const settings = useLiveQuery(settingsOps.get);

  const resolvedPath = useRouterState({
    select: (s) => s.resolvedLocation?.pathname,
  });
  const routeCatalog = useRouteCatalog();
  const route = routeCatalog.find((r) => r.fullPath === resolvedPath);

  const matchRoute = useMatchRoute();
  const isSettingsPage = matchRoute({ to: "/settings", includeSearch: false });

  return (
    <>
      <div className="w-full flex pb-4 pt-4 justify-between">
        <SidebarToggle />
        <span className="font-bold text-2xl text-primary">
          {title ?? route?.title}
        </span>
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
          <Button
            size="icon"
            variant="outline"
            className="my-auto mr-2"
            onClick={() => {
              navigate({
                to: "/settings",
                viewTransition: settings?.pageTransition,
              });
            }}
            disabled={Boolean(isSettingsPage)}
          >
            <Icon icon={SettingsIcon} strokeWidth={2.5} />
          </Button>
        </div>
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
