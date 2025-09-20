import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

type EnvironmentType = "development" | "preview" | "production";
export function getCurrentEnvironment(): EnvironmentType {
  return (process.env.VERCEL_ENV || "development") as EnvironmentType;
}

export const copyToClipboard = async (
  value: string
): Promise<string | undefined> => {
  try {
    if (!navigator.clipboard) {
      return "Browser doesn't have support for native clipboard.";
    }

    if (!value) {
      return "No value to copy to clipboard";
    }

    await navigator.clipboard.writeText(value);
  } catch (error) {
    if (error instanceof DOMException) {
      return error.message;
    }
    return "Unable to copy text to clipboard";
  }
};

export const getClipboardText = async () => {
  return new Promise<string>((resolve, reject) => {
    if (!window.navigator.clipboard) {
      return reject("Browser doesn't have support for native clipboard.");
    }

    window.navigator.clipboard
      .readText()
      .then((value) => resolve(value))
      .catch((error) => reject(error));
  });
};

export const openLinkInNewTab = (
  link: string,
  isWidelyAvailable: boolean = true
) => {
  if (getCurrentEnvironment() !== "production" || isWidelyAvailable) {
    window.open(link);
  } else {
    toast.info("This is still a work in progress!");
  }
};
