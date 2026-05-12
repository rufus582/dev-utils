import { type RegisteredRouter, useRouter } from "@tanstack/react-router";
import type { AppRouteStaticData } from "#/router";

export type RouteCatalogItem = {
  routeId: string;
  fullPath: string;
  title?: string;
  sidebar?: AppRouteStaticData["sidebar"];
};

export function getRouteCatalog(router: RegisteredRouter): RouteCatalogItem[] {
  const routes = router.routesByPath;

  return Object.keys(routes).map((path) => {
    const route = routes[path as keyof typeof routes];
    return {
      routeId: route.id,
      fullPath: route.fullPath,
      title: route.options.staticData?.title,
      sidebar: route.options.staticData?.sidebar,
    };
  });
}

export function useRouteCatalog() {
  const router = useRouter();

  return getRouteCatalog(router).filter((route) => route.sidebar);
}
