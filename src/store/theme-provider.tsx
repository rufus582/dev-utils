/* eslint-disable react-refresh/only-export-components */
import { getSystemTheme } from "@/lib/utils"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"
type ResolvedTheme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  getResolvedTheme: () => ResolvedTheme
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  getResolvedTheme: () => "" as ResolvedTheme
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      root.classList.add(getSystemTheme())
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value: ThemeProviderState = {
    theme,
    setTheme: (theme: Theme) => {
      if (theme) {
        localStorage.setItem(storageKey, theme)
        setTheme(theme)
      }
    },
    getResolvedTheme: () => theme === "system" ? getSystemTheme() : theme
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
