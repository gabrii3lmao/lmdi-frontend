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
      firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
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

const navItemClass =
  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 rounded-lg hover:bg-white/5 hover:text-gray-200 group transition-all duration-200 border-l-2 border-transparent";

const activeNavClass = "!text-indigo-400 !bg-indigo-500/10 !border-indigo-500";
</script>

<template>
  <div v-if="showSidebar">
    <!-- botão mobile -->
    <button
      @click="toggleMenu"
      type="button"
      class="fixed top-4 left-4 z-50 inline-flex items-center p-2.5 text-sm text-gray-300 rounded-xl sm:hidden hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-[#111827] border border-white/10 shadow-xl"
      v-show="!isMenuOpen"
    >
      <i class="pi pi-bars text-lg"></i>
    </button>

    <!-- overlay -->
    <div
      v-if="isMenuOpen"
      @click="toggleMenu"
      class="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-sm z-30 sm:hidden"
    ></div>

    <!-- sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 z-40 w-64 h-screen bg-[#111827] border-r border-white/5 shadow-2xl flex flex-col transition-transform duration-300',
        isMenuOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0',
      ]"
    >
      <!-- header -->
      <div
        class="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0"
      >
        <RouterLink to="/" class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center"
          >
            <i class="pi pi-check text-white text-sm"></i>
          </div>
          <span class="text-white font-bold">
            LetMe<span class="text-indigo-400">DoIt</span>
          </span>
        </RouterLink>

        <button @click="toggleMenu" class="sm:hidden text-gray-400">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <!-- conteúdo -->
      <div class="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <!-- principal -->
        <div class="mb-6">
          <h3 class="px-4 text-xs text-gray-500 uppercase mb-3">Principal</h3>
          <ul class="space-y-1">
            <li>
              <RouterLink
                to="/"
                :class="navItemClass"
                :active-class="activeNavClass"
              >
                <i class="pi pi-desktop w-6"></i>
                <span>Dashboard</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/classes"
                :class="navItemClass"
                :active-class="activeNavClass"
              >
                <i class="pi pi-users w-6"></i>
                <span>Suas Turmas</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- provas -->
        <div class="mb-6">
          <h3 class="px-4 text-xs text-gray-500 uppercase mb-3">
            Gestão de Provas
          </h3>
          <ul class="space-y-1">
            <li>
              <RouterLink
                to="/templates"
                :class="navItemClass"
                :active-class="activeNavClass"
              >
                <i class="pi pi-file-check w-6"></i>
                <span>Gabaritos</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/submissions"
                :class="navItemClass"
                :active-class="activeNavClass"
              >
                <i class="pi pi-images w-6"></i>
                <span>Submissões</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- análise -->
        <div class="mb-6">
          <h3 class="px-4 text-xs text-gray-500 uppercase mb-3">Análise</h3>
          <ul class="space-y-1">
            <li>
              <RouterLink
                to="/reports"
                :class="navItemClass"
                :active-class="activeNavClass"
              >
                <i class="pi pi-chart-pie w-6"></i>
                <span>Desempenho</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/history"
                :class="navItemClass"
                :active-class="activeNavClass"
              >
                <i class="pi pi-history w-6"></i>
                <span>Histórico</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- outros -->
        <div class="mb-6">
          <h3 class="px-4 text-xs text-gray-500 uppercase mb-3">Outros</h3>
          <ul class="space-y-1">
            <li>
              <RouterLink
                to="/faq"
                :class="navItemClass"
                :active-class="activeNavClass"
              >
                <i class="pi pi-question-circle w-6"></i>
                <span>FAQ</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- footer -->
      <div class="p-4 border-t border-white/5">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center"
          >
            {{ name.charAt(0) }}
          </div>
          <span class="text-gray-200 text-sm">
            {{ name || "Professor" }}
          </span>
        </div>

        <button
          @click="handleSignout"
          class="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-red-400"
        >
          <i class="pi pi-sign-out"></i>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}
</style>
