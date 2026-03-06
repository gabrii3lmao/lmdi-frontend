<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import api from "@/services/api";
import { useRoute } from "vue-router";

const route = useRoute();
const name = ref("");
const isMenuOpen = ref(false);

const showSidebar = computed(() => {
  const isPublicPage = route.meta.hideSidebar === true;
  const hasToken = !!localStorage.getItem("token");

  // Só mostra se NÃO for página pública E tiver token
  return !isPublicPage && hasToken;
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleSignout = async () => {
  try {
    await api.post("/auth/signout");
  } catch (error: any) {
    console.error("Erro ao deslogar:", error.message);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/signin";
  }
};

const updateUsername = () => {
  const savedName = localStorage.getItem("username");
  if (savedName) {
    const firstName = savedName.split(" ")[0];
    name.value =
      firstName!.charAt(0).toUpperCase() + firstName!.slice(1).toLowerCase();
  } else {
    name.value = "";
  }
};

watch(
  () => route.path,
  () => {
    updateUsername();
  },
);

onMounted(() => {
  updateUsername();
});
</script>

<template>
  <div v-if="showSidebar">
    <button
      @click="toggleMenu"
      type="button"
      class="fixed top-4 left-4 z-50 inline-flex items-center p-2 text-sm text-gray-400 rounded-lg sm:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all shadow-lg bg-gray-800"
      v-show="!isMenuOpen"
    >
      <i class="pi pi-bars" style="font-size: 1.2rem"></i>
    </button>

    <div
      v-if="isMenuOpen"
      @click="toggleMenu"
      class="fixed inset-0 bg-black/50 z-30 sm:hidden transition-opacity"
    ></div>

    <aside
      id="logo-sidebar"
      :class="[
        'fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out border-r border-gray-700 shadow-2xl sm:shadow-none',
        isMenuOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0',
      ]"
      aria-label="Sidebar"
    >
      <div class="flex flex-col h-full px-3 py-4 overflow-y-auto bg-gray-800">
        <div class="flex items-center justify-between mb-10 px-2">
          <div class="flex items-center">
            <div
              class="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 mr-3"
            >
              <i
                class="pi pi-pencil text-white text-lg"
                style="font-size: 1.5rem"
              ></i>
            </div>
            <span class="text-xl font-bold tracking-tight text-white italic">
              Let me <span class="text-indigo-400">do it</span>
            </span>
          </div>

          <button
            @click="toggleMenu"
            class="sm:hidden text-gray-400 hover:text-white p-2"
          >
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>

        <nav class="flex-1">
          <ul class="space-y-2 font-medium">
            <li>
              <RouterLink
                to="/"
                class="flex items-center p-3 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:text-white group transition-all"
              >
                <i
                  class="pi pi-home text-lg group-hover:text-indigo-400 transition-colors"
                ></i>
                <span class="ms-4">Dashboard</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/classes"
                class="flex items-center p-3 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:text-white group transition-all"
              >
                <i
                  class="pi pi-users text-lg group-hover:text-indigo-400 transition-colors"
                ></i>
                <span class="ms-4">Turmas</span>
              </RouterLink>
            </li>

            <li
              class="pt-4 pb-2 px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest"
            >
              Processamento
            </li>

            <li>
              <RouterLink
                to="/templates"
                class="flex items-center p-3 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:text-white group transition-all"
              >
                <i
                  class="pi pi-file-edit text-lg group-hover:text-indigo-400 transition-colors"
                ></i>
                <span class="ms-4">Modelos de Prova</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/history"
                class="flex items-center p-3 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:text-white group transition-all"
              >
                <i
                  class="pi pi-history text-lg group-hover:text-indigo-400 transition-colors"
                ></i>
                <span class="ms-4">Histórico</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/reports"
                class="flex items-center p-3 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:text-white group transition-all"
              >
                <i
                  class="pi pi-chart-bar text-lg group-hover:text-indigo-400 transition-colors"
                ></i>
                <span class="ms-4">Relatórios</span>
              </RouterLink>
            </li>

            <li class="mt-4">
              <RouterLink
                to="/faq"
                class="flex items-center p-3 text-gray-200 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-300 group transition-all"
              >
                <i
                  class="pi pi-question-circle text-lg group-hover:animate-pulse"
                ></i>
                <span class="ms-4">Central de Ajuda</span>
              </RouterLink>
            </li>
          </ul>
        </nav>

        <div class="mt-auto pt-4 border-t border-gray-700/50">
          <div class="flex items-center p-3 mb-2 bg-gray-900/30 rounded-2xl">
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-sm font-bold shadow-inner"
            >
              {{ name.charAt(0) }}
            </div>
            <div class="ms-3 overflow-hidden">
              <p class="text-sm font-semibold text-gray-100 truncate">
                {{ name }}
              </p>
              <p class="text-xs text-gray-500 uppercase tracking-wider">
                Usuário
              </p>
            </div>
          </div>

          <button
            @click="handleSignout"
            class="w-full flex items-center p-3 text-gray-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 group transition-all duration-200"
          >
            <i
              class="pi pi-sign-out text-lg group-hover:translate-x-1 transition-transform"
            ></i>
            <span class="ms-4 text-sm font-medium">Sair do Sistema</span>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
/* Estilização extra para o logo parecer uma "marca" */
.tracking-tight {
  letter-spacing: -0.025em;
}
</style>
