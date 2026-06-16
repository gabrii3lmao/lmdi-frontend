import { defineStore } from "pinia"
import { ref, watch } from "vue"

type Theme = "light" | "dark"

export const useThemeStore = defineStore("theme", () => {
  const theme = ref<Theme>("light")

  function applyTheme(t: Theme) {
    const root = document.documentElement
    if (t === "dark") {
      root.classList.add("dark", "my-app-dark")
    } else {
      root.classList.remove("dark", "my-app-dark")
    }
  }

  function setTheme(t: Theme) {
    theme.value = t
    localStorage.setItem("theme", t)
    applyTheme(t)
  }

  function toggle() {
    setTheme(theme.value === "light" ? "dark" : "light")
  }

  function init() {
    const stored = localStorage.getItem("theme") as Theme | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const t = stored ?? (prefersDark ? "dark" : "light")
    theme.value = t
    applyTheme(t)
  }

  return { theme, setTheme, toggle, init }
})
