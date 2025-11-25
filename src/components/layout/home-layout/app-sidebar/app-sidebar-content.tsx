import { ChevronDown } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/custom-components/tooltip-wrapper";
import { AnimatePresence, motion } from "motion/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import sidebarStyles from "./app-sidebar-content.module.css";
import type { RouteDefinition } from "@/routes/route-definitions";
import { useEffect, useEffectEvent, useMemo } from "react";
import { useImmer } from "use-immer";

interface IAppSidebarContentProps {
  sidebarContentDefinitions: RouteDefinition[];
  activePathDefinition: number;
  navigate: (routeDefinition: Partial<RouteDefinition>) => void;
}

const CATEGORY_UNCATEGORISED = "Uncategorised";

const AppSidebarContent = ({
  sidebarContentDefinitions,
  activePathDefinition,
  navigate: handleNavigation,
}: IAppSidebarContentProps) => {
  const { open: sidebarOpen } = useSidebar();

  const initialSidebarContentState: Record<string, boolean> = useMemo(
    () => ({}),
    []
  );
  const sidebarContentCategories: string[] = [];
  sidebarContentDefinitions.forEach((definition) => {
    const category = definition.category ?? CATEGORY_UNCATEGORISED;
    if (!sidebarContentCategories.includes(category)) {
      sidebarContentCategories.push(category);

      if (initialSidebarContentState[category] === undefined)
        initialSidebarContentState[category] = true;
    }
  });

  const [sidebarContentState, setSidebarContentState] = useImmer(
    initialSidebarContentState
  );

  const openAllCategories = useEffectEvent(() => {
    if (!sidebarOpen)
      setTimeout(() => {
        setSidebarContentState(initialSidebarContentState);
      }, 1000);
  });
  useEffect(openAllCategories, [openAllCategories, sidebarOpen]);

  const handleCategoryOpenChange = (category: string, open: boolean) => {
    setSidebarContentState((prevState) => {
      prevState[category] = open;
    });
  };

  return (
    <>
      {sidebarContentCategories.sort().map((category) => {
        const categoryDefinitions = sidebarContentDefinitions.filter(
          (definition) =>
            (category === CATEGORY_UNCATEGORISED && !definition.category) ||
            category === definition.category
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
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 duration-300" />
                      </CollapsibleTrigger>
                    </SidebarGroupLabel>
                  </motion.div>
                )}
              </AnimatePresence>
              <CollapsibleContent className={sidebarStyles.CollapsibleContent}>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {categoryDefinitions.map((contentItem) => (
                      <Tooltip
                        hidden={sidebarOpen}
                        key={contentItem.definitionId}
                        content={contentItem.displayable}
                        asChild
                        delayDuration={0}
                        side="right"
                        variant="secondary"
                      >
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            className="cursor-pointer"
                            onClick={() => handleNavigation(contentItem)}
                            isActive={
                              activePathDefinition === contentItem.definitionId
                            }
                          >
                            <>
                              {contentItem.icon}
                              <span>{contentItem.displayable}</span>
                            </>
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
