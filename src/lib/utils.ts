import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const copyToClipboard = async (value: string): Promise<string | undefined> => {
  try {
    if (!navigator.clipboard) {
      return "Browser don't have support for native clipboard.";
    }

    if (!value) {
      return "No value to copy to clipboard"
    }

    await navigator.clipboard.writeText(value);
  } catch (error) {
    if (error instanceof DOMException) {
      return error.message
    }
    return "Unable to copy text to clipboard"
  }
};
