import { defineStore } from "pinia"
import { ref } from "vue"

export const useSidebarStore = defineStore("sidebar", () => {
  const collapsed = ref(false)

  function toggle() {
    collapsed.value = !collapsed.value
    localStorage.setItem("sidebarCollapsed", collapsed.value ? "1" : "0")
  }

  function init() {
    collapsed.value = localStorage.getItem("sidebarCollapsed") === "1"
  }

  return { collapsed, toggle, init }
})
