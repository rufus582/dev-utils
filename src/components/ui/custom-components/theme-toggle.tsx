import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTheme } from "@/store/theme-provider";
import { Moon, Sparkle, Sun } from "lucide-react";
import { Tooltip } from "./tooltip-wrapper";

const TOOLTIP_DELAY = 300;

const ThemeToggle = (props: {
  className?: string;
  variant?: "default" | "outline";
}) => {
  const { setTheme, theme, isSystemTheme } = useTheme();

  const onThemeChange = (curTheme: "light" | "dark" | "system") => {
    setTheme(curTheme);

    // Reload page if theme was changed from "system" to "light/dark"
    if (curTheme !== "system" && isSystemTheme) window.location.reload();
  };

  return (
    <ToggleGroup
      onValueChange={(value) =>
        onThemeChange(value as "light" | "dark" | "system")
      }
      type="single"
      {...props}
    >
      <Tooltip content="Dark Theme" delayDuration={TOOLTIP_DELAY} asChild>
        <ToggleGroupItem
          value="dark"
          aria-label="Toggle dark theme"
          data-state={theme === "dark" && !isSystemTheme ? "on" : "off"}
        >
          <Moon className="h-4 w-4" />
        </ToggleGroupItem>
      </Tooltip>
      <Tooltip content="System Theme" delayDuration={TOOLTIP_DELAY} asChild>
        <ToggleGroupItem
          value="system"
          aria-label="Toggle system theme"
          data-state={isSystemTheme ? "on" : "off"}
        >
          <Sparkle className="h-4 w-4" />
        </ToggleGroupItem>
      </Tooltip>
      <Tooltip content="Light Theme" delayDuration={TOOLTIP_DELAY} asChild>
        <ToggleGroupItem
          value="light"
          aria-label="Toggle light theme"
          data-state={theme === "light" && !isSystemTheme ? "on" : "off"}
        >
          <Sun className="h-4 w-4" />
        </ToggleGroupItem>
      </Tooltip>
    </ToggleGroup>
  );
};

export default ThemeToggle;
