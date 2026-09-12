import { defineStore } from "pinia"
import { ref } from "vue"

export type ThemePreference = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

export const useThemeStore = defineStore("theme", () => {
  const theme = ref<ThemePreference>("system")
  const isDark = ref(false)

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

  function resolve(preference: ThemePreference): ResolvedTheme {
    if (preference === "system") {
      return mediaQuery.matches ? "dark" : "light"
    }
    return preference
  }

  function applyTheme(preference: ThemePreference = theme.value) {
    const resolved = resolve(preference)
    isDark.value = resolved === "dark"

    const root = document.documentElement
    root.classList.toggle("dark", isDark.value)
    root.classList.toggle("my-app-dark", isDark.value)
  }

  function setTheme(preference: ThemePreference) {
    theme.value = preference
    localStorage.setItem("theme", preference)
    applyTheme(preference)
  }

  function toggle() {
    setTheme(isDark.value ? "light" : "dark")
  }

  function init() {
    const stored = localStorage.getItem("theme") as ThemePreference | null
    theme.value = stored ?? "system"
    applyTheme()

    mediaQuery.addEventListener("change", () => {
      if (theme.value === "system") applyTheme()
    })
  }

  return { theme, isDark, applyTheme, setTheme, toggle, init }
})
