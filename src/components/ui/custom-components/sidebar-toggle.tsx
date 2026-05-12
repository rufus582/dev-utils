import SidebarToggleIcon from "#icons/pages/page-header/sidebar-toggle-icon";
import { Tooltip } from "#ui/custom-components/tooltip-wrapper";
import { useSidebar } from "#ui/sidebar";
import { cn } from "@/lib/utils";

const SidebarToggle = () => {
  const { toggleSidebar, open } = useSidebar();

  return (
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
        type="button"
      >
        <SidebarToggleIcon />
      </button>
    </Tooltip>
  );
};

export { SidebarToggle };
