import { type RegisteredRouter, useRouter } from "@tanstack/react-router";
import type React from "react";

export type CommandCatalogItem = {
  id: string;
  routeId: string;
  label: string;
  icon: React.ReactNode;
  keywords?: string[];
  to: string;
  search?: object;
};

export function getCommandCatalog(
  router: RegisteredRouter,
): CommandCatalogItem[] {
  const routes = router.routesByPath;

  return Object.keys(routes).flatMap((path) => {
    const route = routes[path as keyof typeof routes];
    const staticData = route.options.staticData;
    const command = staticData?.command;
    const sidebar = staticData?.sidebar;
    const title = staticData?.title;

    if (!sidebar && !command?.entries?.length) return [];

    if (command?.entries?.length) {
      return command.entries.map((entry) => ({
        id: `${route.id}-${entry.id}`,
        routeId: route.id,
        label: entry.label,
        icon: entry.icon,
        keywords: entry.keywords,
        to: route.fullPath,
        search: entry.search,
      }));
    }

    if (!sidebar) return [];

    return [
      {
        id: route.id,
        routeId: route.id,
        label: command?.label ?? title ?? sidebar.label,
        icon: sidebar.icon,
        keywords: command?.keywords,
        to: route.fullPath,
        search: command?.search ?? sidebar.search,
      },
    ];
  });
}

export function useCommandCatalog() {
  const router = useRouter();

  return getCommandCatalog(router);
}
