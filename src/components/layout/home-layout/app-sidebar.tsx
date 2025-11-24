import { ChevronDown, CodeSquareIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../../ui/sidebar";
import {
  routeDefinitions,
  type RouteDefinition,
} from "@/routes/route-definitions";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { settingsOps } from "@/store/indexed-db/settings";
import { Tooltip } from "@/components/ui/custom-components/tooltip-wrapper";
import DevUtilsCommandPrompt from "./command-prompt/command";
import { AnimatePresence, motion } from "motion/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import sidebarStyles from "./app-sidebar.module.css"

const CATEGORY_UNCATEGORISED = "Uncategorised";

const AppSidebar = () => {
  const [activePathDefinition, setActivePathDefinition] = useState<number>(-1);
  const sidebarContentDefinitions = routeDefinitions.filter(
    (def) => def.sidebarPlace === "content"
  );
  const sidebarFooterDefinition = routeDefinitions.find(
    (def) => def.sidebarPlace === "footer"
  );

  const sidebarContentCategories: string[] = [];
  sidebarContentDefinitions.forEach((definition) => {
    const category = definition.category ?? CATEGORY_UNCATEGORISED;
    if (!sidebarContentCategories.includes(category))
      sidebarContentCategories.push(category);
  });

  const settings = useLiveQuery(settingsOps.get);

  const navigate = useNavigate();
  const { open: sidebarOpen } = useSidebar();

  const handleNavigation = (routeDefinition: Partial<RouteDefinition>) => {
    setActivePathDefinition(
      routeDefinition.definitionId === undefined
        ? -1
        : routeDefinition.definitionId
    );
    navigate(routeDefinition.path ?? "/", {
      viewTransition: settings?.pageTransition,
    });
  };

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer"
              onClick={() => handleNavigation({ definitionId: -1, path: "/" })}
            >
              <>
                <CodeSquareIcon />
                <span className="text-base font-semibold">Dev-Utils.</span>
              </>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          <SidebarMenuItem>
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
                    height: "2.5rem",
                    opacity: 1,
                  }}
                  exit={{
                    scaleY: 0,
                    height: 0,
                    opacity: 0,
                  }}
                  transition={{
                    type: "spring",
                    damping: 20,
                  }}
                >
                  <DevUtilsCommandPrompt showSearchBar className="h-10" />
                </motion.div>
              )}
            </AnimatePresence>
          </SidebarMenuItem>
        </SidebarMenu>
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
                                activePathDefinition ===
                                contentItem.definitionId
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
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="overflow-hidden rounded-xl">
          {sidebarFooterDefinition && (
            <Tooltip
              hidden={sidebarOpen}
              content={sidebarFooterDefinition.displayable}
              asChild
              delayDuration={0}
              side="right"
              variant="secondary"
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="hover:font-semibold rounded-xl cursor-pointer"
                  size={sidebarOpen ? "lg" : "default"}
                  isActive={
                    activePathDefinition ===
                    sidebarFooterDefinition.definitionId
                  }
                  onClick={() => handleNavigation(sidebarFooterDefinition)}
                >
                  <>
                    {sidebarFooterDefinition.icon}
                    <span className="transition-all delay-100 duration-150">
                      {sidebarFooterDefinition.displayable}
                    </span>
                  </>
                </SidebarMenuButton>
                <SidebarMenuAction asChild>
                  {sidebarFooterDefinition.actionElement?.({
                    definition: sidebarFooterDefinition,
                    isActive:
                      activePathDefinition ===
                      sidebarFooterDefinition.definitionId,
                  })}
                </SidebarMenuAction>
              </SidebarMenuItem>
            </Tooltip>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
