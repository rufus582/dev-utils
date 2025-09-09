import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTheme } from "@/store/theme-provider";
import { Moon, Sparkle, Sun } from "lucide-react";
import { Tooltip } from "./tooltip-wrapper";

const TOOLTIP_DELAY = 300

const ThemeToggle = (props: {
  className?: string;
  variant?: "default" | "outline";
}) => {
  const { setTheme, theme } = useTheme();

  return (
    <ToggleGroup
      onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
      type="single"
      {...props}
    >
      <Tooltip content="Dark Theme" delayDuration={TOOLTIP_DELAY} asChild>
        <ToggleGroupItem
          value="dark"
          aria-label="Toggle dark theme"
          data-state={theme === "dark" ? "on" : "off"}
        >
          <Moon className="h-4 w-4" />
        </ToggleGroupItem>
      </Tooltip>
      <Tooltip content="System Theme" delayDuration={TOOLTIP_DELAY} asChild>
        <ToggleGroupItem
          value="system"
          aria-label="Toggle system theme"
          data-state={theme === "system" ? "on" : "off"}
        >
          <Sparkle className="h-4 w-4" />
        </ToggleGroupItem>
      </Tooltip>
      <Tooltip content="Light Theme" delayDuration={TOOLTIP_DELAY} asChild>
        <ToggleGroupItem
          value="light"
          aria-label="Toggle light theme"
          data-state={theme === "light" ? "on" : "off"}
        >
          <Sun className="h-4 w-4" />
        </ToggleGroupItem>
      </Tooltip>
    </ToggleGroup>
  );
};

export default ThemeToggle;
