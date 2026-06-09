import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import type React from "react";
import { routeTree } from './routeTree.gen'

export type SidebarPlace = 'header' | 'content' | 'footer'

export type SidebarActionProps = {
  isActive: boolean
  fullPath: string
  routeId: string
}

export type AppRouteStaticData = {
  title?: string
  sidebar?: {
    label: string
    icon: React.ReactNode
    place: SidebarPlace
    category?: string
    keywords?: string[]
    order: number
    action?: (props: SidebarActionProps) => React.ReactNode
  }
}

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }

  interface StaticDataRouteOption extends AppRouteStaticData {}
}
