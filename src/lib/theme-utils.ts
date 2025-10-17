interface SystemThemeProps {
  theme: "light" | "dark";
  listener: MediaQueryList;
}

export function getSystemTheme(): SystemThemeProps {
  const listener = window.matchMedia("(prefers-color-scheme: dark)");

  return {
    theme: listener.matches ? "dark" : "light",
    listener,
  };
}

export function getSystemThemeChangeEventHandler(
  onThemeChange: (theme: "light" | "dark") => void
) {
  return (ev: MediaQueryListEvent) =>
    onThemeChange(ev.matches ? "dark" : "light");
}
