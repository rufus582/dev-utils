import { useSyncExternalStore } from "react";
import { getSystemTheme } from "#lib/theme-utils";

const themeSubscriber = (cb: () => void) => {
  const systemTheme = getSystemTheme();
  systemTheme.listener.addEventListener("change", cb);

  return () => systemTheme.listener.removeEventListener("change", cb);
};

const getThemeSnapshot = () => {
  const systemTheme = getSystemTheme();
  return systemTheme.theme;
};

const getServerThemeSnapshot = () => "dark" as "light" | "dark";

const useSystemTheme = () =>
  useSyncExternalStore(
    themeSubscriber,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

export { useSystemTheme };
