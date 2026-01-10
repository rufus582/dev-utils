import { getSystemTheme } from "@/lib/theme-utils";
import { useSyncExternalStore } from "react";

const themeSubscriber = (cb: () => void) => {
  const systemTheme = getSystemTheme();
  systemTheme.listener.addEventListener("change", cb);

  return () => systemTheme.listener.removeEventListener("change", cb);
};

const getThemeSnapshot = () => {
  const systemTheme = getSystemTheme();
  return systemTheme.theme;
};

const useSystemTheme = () =>
  useSyncExternalStore(themeSubscriber, getThemeSnapshot);

export { useSystemTheme };
