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
      (firstName as string).charAt(0).toUpperCase() +
      (firstName as string).slice(1).toLowerCase();
  } else {
    name.value = "";
  }
};

watch(
  () => route.path,
  () => {
    updateUsername();
    isMenuOpen.value = false; // Fecha o menu ao navegar no mobile
  },
);

onMounted(() => {
  updateUsername();
});

const navItemClass =
  "flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-400 rounded-lg hover:bg-white/5 hover:text-gray-200 group transition-all duration-200 border-l-2 border-transparent";

const activeNavClass = "!text-indigo-400 !bg-indigo-500/10 !border-indigo-500";
</script>

<template>
  <div v-if="showSidebar">
    <header
      class="fixed top-0 left-0 right-0 h-16 bg-[#111827] border-b border-white/5 z-40 flex items-center justify-between px-4 sm:hidden"
    >
      <div class="flex items-center gap-3">
        <button
          @click="toggleMenu"
          type="button"
          class="p-2 text-gray-400 hover:bg-white/10 rounded-xl transition-all focus:outline-none"
        >
          <i class="pi pi-bars text-xl"></i>
        </button>
        <span class="text-lg font-bold text-white tracking-tighter">
          LetMe<span class="text-indigo-500">DoIt</span>
        </span>
      </div>

      <div
        class="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/20"
      >
        {{ name.charAt(0) || "P" }}
      </div>
    </header>

    <div
      v-if="isMenuOpen"
      @click="toggleMenu"
      class="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-sm z-40 sm:hidden"
    ></div>

    <aside
      :class="[
        'fixed top-0 left-0 z-50 w-64 h-screen bg-[#111827] border-r border-white/5 shadow-2xl flex flex-col transition-transform duration-300',
        isMenuOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0',
      ]"
    >
      <div
        class="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0"
      >
        <RouterLink
          to="/"
          class="flex flex-col justify-center group outline-none"
        >
          <div class="flex items-baseline gap-1">
            <span
              class="text-2xl font-extrabold tracking-tighter text-gray-100 transition-colors group-hover:text-white"
            >
              LetMe<span class="text-indigo-500">DoIt</span>
            </span>
            <span
              class="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:bg-indigo-400 group-hover:scale-125 transition-all duration-200"
            ></span>
          </div>

          <span
            class="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-0.5 font-bold"
          >
            Painel Docente
          </span>
        </RouterLink>

        <button
          @click="toggleMenu"
          class="sm:hidden text-gray-400 hover:text-white p-2"
        >
          <i class="pi pi-times text-lg"></i>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <div class="mb-6">
          <h3
            class="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3"
          >
            Principal
          </h3>
          <ul class="space-y-1">
            <li>
              <RouterLink
                to="/"
                :class="navItemClass"
                :active-class="activeNavClass"
              >
                <i class="pi pi-desktop text-base"></i>
                <span>Dashboard</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/classes"
                :class="navItemClass"
                :active-class="activeNavClass"
              >
                <i class="pi pi-users text-base"></i>
                <span>Suas Turmas</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="mb-6">
          <h3
            class="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3"
          >
            Gestão de Provas
          </h3>
          <ul class="space-y-1">
            <li>
              <RouterLink
                to="/templates"
                :class="navItemClass"
                :active-class="activeNavClass"
              >
                <i class="pi pi-file-check text-base"></i>
                <span>Gabaritos</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/submissions"
                :class="navItemClass"
                :active-class="activeNavClass"
              >
                <i class="pi pi-images text-base"></i>
                <span>Submissões</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="mb-6">
          <h3
            class="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3"
          >
            Análise
          </h3>
          <ul class="space-y-1">
            <li>
              <RouterLink
                to="/reports"
                :class="navItemClass"
                :active-class="activeNavClass"
              >
                <i class="pi pi-chart-pie text-base"></i>
                <span>Desempenho</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/history"
                :class="navItemClass"
                :active-class="activeNavClass"
              >
                <i class="pi pi-history text-base"></i>
                <span>Histórico</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="mb-6">
          <h3
            class="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3"
          >
            Suporte
          </h3>
          <ul class="space-y-1">
            <li>
              <RouterLink
                to="/faq"
                :class="navItemClass"
                :active-class="activeNavClass"
              >
                <i class="pi pi-question-circle text-base"></i>
                <span>FAQ</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="p-4 border-t border-white/5 bg-[#0D121F]">
        <div class="flex items-center gap-3 mb-4 px-2">
          <div
            class="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold"
          >
            {{ name.charAt(0) || "P" }}
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-gray-200 text-sm font-semibold truncate">
              {{ name || "Professor" }}
            </span>
            <span class="text-gray-500 text-xs"> Docente </span>
          </div>
        </div>

        <button
          @click="handleSignout"
          class="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-transparent hover:border-red-400/20"
        >
          <i class="pi pi-sign-out"></i>
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Garante que o conteúdo das páginas não fique sob a Topbar no mobile */
:deep(main),
:deep(.page-container) {
  @media (max-width: 639px) {
    padding-top: 4rem; /* h-16 */
  }
}
</style>
