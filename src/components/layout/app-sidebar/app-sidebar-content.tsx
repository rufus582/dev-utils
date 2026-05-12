import { AnimatePresence, motion } from "motion/react";
import { useEffect, useEffectEvent, useMemo } from "react";
import { useImmer } from "use-immer";
import { Icon } from "#icons/huge-icon";
import { ArrowDownIcon } from "#icons/ui";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "#ui/collapsible";
import { Tooltip } from "#ui/custom-components/tooltip-wrapper";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "#ui/sidebar";
import type { RouteCatalogItem } from "#hooks/use-route-catalog";
import sidebarStyles from "./app-sidebar-content.module.css";

interface IAppSidebarContentProps {
  sidebarContentRoutes: RouteCatalogItem[];
  activeRouteId: string;
  navigate: (routeDefinition: Partial<RouteCatalogItem>) => void;
}

const CATEGORY_UNCATEGORISED = "Uncategorised";

const AppSidebarContent = ({
  sidebarContentRoutes,
  activeRouteId,
  navigate: handleNavigation,
}: IAppSidebarContentProps) => {
  const { open: sidebarOpen } = useSidebar();

  const initialSidebarContentState: Record<string, boolean> = useMemo(
    () => ({}),
    [],
  );
  const sidebarContentCategories: string[] = [];
  sidebarContentRoutes.forEach((route) => {
    const category = route.sidebar?.category ?? CATEGORY_UNCATEGORISED;
    if (!sidebarContentCategories.includes(category)) {
      sidebarContentCategories.push(category);

      if (initialSidebarContentState[category] === undefined)
        initialSidebarContentState[category] = true;
    }
  });

  const [sidebarContentState, setSidebarContentState] = useImmer(
    initialSidebarContentState,
  );

  const openAllCategories = useEffectEvent(() => {
    if (!sidebarOpen)
      setTimeout(() => {
        setSidebarContentState(initialSidebarContentState);
      }, 500);
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: openAllCategories must be called when sidebar state changes
  useEffect(openAllCategories, [sidebarOpen]);

  const handleCategoryOpenChange = (category: string, open: boolean) => {
    setSidebarContentState((prevState) => {
      prevState[category] = open;
    });
  };

  return (
    <>
      {sidebarContentCategories.sort().map((category) => {
        const categoryDefinitions = sidebarContentRoutes.filter(
          (route) =>
            (category === CATEGORY_UNCATEGORISED && !route.sidebar?.category) ||
            category === route.sidebar?.category,
        );
        return (
          <Collapsible
            key={category}
            defaultOpen
            className="group/collapsible"
            onOpenChange={(open) => handleCategoryOpenChange(category, open)}
            open={sidebarContentState[category]}
          >
            <SidebarGroup className="p-0 px-2">
              <AnimatePresence initial={false}>
                {sidebarOpen && (
                  <motion.div
                    initial={{
                      scaleY: 0,
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      scaleY: 1,
                      height: "2rem",
                      opacity: 1,
                    }}
                    exit={{
                      scaleY: 0,
                      height: 0,
                      opacity: 0,
                      marginBottom: 0,
                    }}
                    transition={{
                      type: "spring",
                      damping: 20,
                    }}
                  >
                    <SidebarGroupLabel asChild>
                      <CollapsibleTrigger className="w-full flex hover:bg-muted cursor-pointer">
                        {category}
                        <Icon
                          icon={ArrowDownIcon}
                          className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 duration-300"
                        />
                      </CollapsibleTrigger>
                    </SidebarGroupLabel>
                  </motion.div>
                )}
              </AnimatePresence>
              <CollapsibleContent
                className={sidebarStyles.CollapsibleContent}
                data-sidebar-state={sidebarOpen ? "expanded" : "collapsed"}
              >
                <SidebarGroupContent>
                  <SidebarMenu>
                    {categoryDefinitions.map((contentItem) => (
                      <Tooltip
                        hidden={sidebarOpen}
                        key={contentItem.routeId}
                        content={contentItem.title ?? ""}
                        asChild
                        delayDuration={0}
                        side="right"
                        variant="secondary"
                      >
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            className="cursor-pointer active:scale-98 transition-all"
                            onClick={() => handleNavigation(contentItem)}
                            isActive={
                              activeRouteId === contentItem.routeId
                            }
                          >
                            {contentItem.sidebar?.icon}
                            <span>{contentItem.sidebar?.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </Tooltip>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        );
      })}
    </>
  );
};

export default AppSidebarContent;
