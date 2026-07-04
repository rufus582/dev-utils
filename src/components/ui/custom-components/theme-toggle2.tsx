import { HugeiconsIcon } from "@hugeicons/react";
import { MoonIcon, Sun01Icon } from "@hugeicons/core-free-icons";
import { ToggleGroup, ToggleGroupItem } from "#ui/toggle-group";
import { useTheme } from "@/store/theme-provider";
import { Tooltip } from "./tooltip-wrapper";

const TOOLTIP_DELAY = 0;
const TOOLTIP_VARIANT = "secondary";

const ThemeToggle = (props: {
  className?: string;
  variant?: "default" | "outline";
}) => {
  const { setTheme, theme, isSystemTheme } = useTheme();

  return (
    <ToggleGroup onValueChange={setTheme} type="single" {...props}>
      <Tooltip
        content="Dark Theme"
        delayDuration={TOOLTIP_DELAY}
        asChild
        variant={TOOLTIP_VARIANT}
      >
        <ToggleGroupItem
          value="dark"
          aria-label="Toggle dark theme"
          data-state={theme === "dark" && !isSystemTheme ? "on" : "off"}
        >
          <HugeiconsIcon icon={MoonIcon} className="h-4 w-4" />
        </ToggleGroupItem>
      </Tooltip>
      <Tooltip
        content="System Theme"
        delayDuration={TOOLTIP_DELAY}
        asChild
        variant={TOOLTIP_VARIANT}
      >
        <ToggleGroupItem
          value="system"
          aria-label="Toggle system theme"
          data-state={isSystemTheme ? "on" : "off"}
        >
          <HugeiconsIcon icon={Sun01Icon} className="h-4 w-4" />
        </ToggleGroupItem>
      </Tooltip>
      <Tooltip
        content="Light Theme"
        delayDuration={TOOLTIP_DELAY}
        asChild
        variant={TOOLTIP_VARIANT}
      >
        <ToggleGroupItem
          value="light"
          aria-label="Toggle light theme"
          data-state={theme === "light" && !isSystemTheme ? "on" : "off"}
        >
          <HugeiconsIcon icon={Sun01Icon} className="h-4 w-4" />
        </ToggleGroupItem>
      </Tooltip>
    </ToggleGroup>
  );
};

export default ThemeToggle;
