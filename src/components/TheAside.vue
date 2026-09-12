<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import api from "@/services/api";
import { useRoute } from "vue-router";
import Drawer from "primevue/drawer";
import Avatar from "primevue/avatar";
import { useToast } from "primevue/usetoast";
import { disconnectSocket } from "@/services/socket";
import { clearTerms } from "@/services/terms";
import { useThemeStore } from "@/stores/theme";
import { useSidebarStore } from "@/stores/sidebar";
import logLight from "@/assets/logo1.webp";
import logDark from "@/assets/logo-white.png";

const route = useRoute();
const toast = useToast();
const themeStore = useThemeStore();
const sidebar = useSidebarStore();
const name = ref("");
const userPhoto = ref("");
const isMenuOpen = ref(false);

const logoSrc = computed(() =>
  themeStore.theme === "dark" ? logDark : logLight,
);

function showComingSoon() {
  toast.add({
    severity: "info",
    summary: "Em desenvolvimento",
    detail: "Esta funcionalidade estará disponível em breve!",
    life: 3000,
  });
}

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
    disconnectSocket();
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("userPhoto");
    localStorage.removeItem("supportPromptDismissed");
    clearTerms();
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
  userPhoto.value = localStorage.getItem("userPhoto") ?? "";
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
  "flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-school-500 dark:text-lousa-400 rounded-lg hover:bg-school-50 dark:hover:bg-lousa-700/60 hover:text-school-900 dark:hover:text-lousa-100 group transition-all duration-200 border-l-2 border-transparent";

const activeNavClass = "!text-indigo-600 dark:!text-indigo-400 !bg-indigo-50 dark:!bg-indigo-900/30 !border-borda-500";

const disabledNavItemClass =
  "flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-school-400 dark:text-lousa-500 rounded-lg cursor-default transition-all duration-200 border-l-2 border-transparent w-full text-left";

const comingSoonBadge = "ml-auto text-[9px] font-bold uppercase tracking-wider text-school-400 dark:text-lousa-500 bg-school-100 dark:bg-lousa-700 px-1.5 py-0.5 rounded";

const desktopNavItemClass = computed(
  () =>
    `flex items-center gap-3 py-2.5 text-sm font-medium text-school-500 dark:text-lousa-400 rounded-lg hover:bg-school-50 dark:hover:bg-lousa-700/60 hover:text-school-900 dark:hover:text-lousa-100 group transition-all duration-200 border-l-2 border-transparent ${
      sidebar.collapsed ? "justify-center px-0" : "px-4"
    }`,
);

const desktopDisabledNavItemClass = computed(
  () =>
    `flex items-center gap-3 py-2.5 text-sm font-medium text-school-400 dark:text-lousa-500 rounded-lg cursor-default transition-all duration-200 border-l-2 border-transparent w-full text-left ${
      sidebar.collapsed ? "justify-center px-0" : "px-4"
    }`,
);
</script>

<template>
  <div v-if="showSidebar">
    <header
      class="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-lousa-800 border-b border-school-200 dark:border-lousa-700 z-40 flex items-center justify-between px-4 sm:hidden"
    >
      <div class="flex items-center gap-3">
        <button
          @click="toggleMenu"
          type="button"
          class="p-2 text-school-500 dark:text-lousa-400 hover:bg-school-100 dark:hover:bg-lousa-700 rounded-xl transition-all focus:outline-none"
        >
          <i class="pi pi-bars text-xl"></i>
        </button>
        <img :src="logoSrc" alt="" class="h-7 w-auto" />
        <span class="text-sm font-bold text-school-900 dark:text-lousa-100 tracking-tighter">
          LetMe<span class="text-indigo-500">DoIt</span>
        </span>
      </div>

      <Avatar
        :image="userPhoto || undefined"
        :label="userPhoto ? '' : (name.charAt(0) || 'P')"
        shape="circle"
        class="!bg-indigo-100 !text-indigo-600 !border !border-borda-200 !font-bold"
        style="width: 2rem; height: 2rem"
      />
    </header>

    <Drawer
      v-model:visible="isMenuOpen"
      position="left"
      :blockScroll="true"
      :showCloseIcon="false"
      class="sm:hidden !border-none !p-0 !bg-transparent !shadow-none"
      :pt="{
        mask: { class: 'bg-school-900/50 dark:bg-lousa-950/70 backdrop-blur-sm' },
      }"
    >
      <template #container="{ closeCallback }">
        <div
          class="w-64 h-dvh bg-white dark:bg-lousa-800 border-r border-school-200 dark:border-lousa-700 shadow-2xl flex flex-col overflow-hidden"
        >
          <div
            class="h-20 flex items-center justify-between px-6 border-b border-school-100 dark:border-lousa-700 shrink-0"
          >
            <RouterLink
              to="/dashboard"
              class="flex items-center gap-3 group outline-none"
              @click="closeCallback"
            >
              <img :src="logoSrc" alt="" class="h-8 w-auto" />
              <div class="flex flex-col">
                <span class="text-lg font-extrabold text-school-800 dark:text-lousa-100 tracking-tighter leading-tight">
                  LetMe<span class="text-indigo-500">DoIt</span>
                </span>
                <span class="text-[10px] uppercase tracking-[0.2em] text-school-400 dark:text-lousa-500 font-bold">
                  Painel Docente
                </span>
              </div>
            </RouterLink>

            <button
              @click="closeCallback"
              class="text-school-400 hover:text-school-600 dark:text-lousa-500 dark:hover:text-lousa-300 p-2"
            >
              <i class="pi pi-times text-lg"></i>
            </button>
          </div>

          <nav class="flex-1 overflow-y-auto py-4 px-4 custom-scrollbar min-h-0">
            <div class="mb-6">
              <h3
                class="px-4 text-[0.6rem] font-bold text-school-900 dark:text-lousa-200 uppercase tracking-widest mb-3"
              >
                Principal
              </h3>
              <ul class="space-y-1">
                <li>
                  <RouterLink
                    to="/dashboard"
                    :class="navItemClass"
                    :active-class="activeNavClass"
                    @click="closeCallback"
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
                    @click="closeCallback"
                  >
                    <i class="pi pi-users text-base"></i>
                    <span>Suas Turmas</span>
                  </RouterLink>
                </li>
              </ul>
            </div>

            <div class="mb-6">
              <h3
                class="px-4 text-[0.6rem] font-bold text-school-900 dark:text-lousa-200 uppercase tracking-widest mb-3"
              >
                Gestão de Provas
              </h3>
              <ul class="space-y-1">
                <li>
                  <RouterLink
                    to="/templates"
                    :class="navItemClass"
                    :active-class="activeNavClass"
                    @click="closeCallback"
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
                    @click="closeCallback"
                  >
                    <i class="pi pi-images text-base"></i>
                    <span>Submissões</span>
                  </RouterLink>
                </li>
              </ul>
            </div>

            <div class="mb-6">
              <h3
                class="px-4 text-[0.6rem] font-bold text-school-900 dark:text-lousa-200 uppercase tracking-widest mb-3"
              >
                Análise
              </h3>
              <ul class="space-y-1">
                <li>
                  <RouterLink
                    to="/analytics"
                    :class="navItemClass"
                    :active-class="activeNavClass"
                  >
                    <i class="pi pi-chart-pie text-base"></i>
                    <span>Desempenho</span>
                  </RouterLink>
                </li>
                <li>
                  <button
                    @click="showComingSoon"
                    :class="disabledNavItemClass"
                  >
                    <i class="pi pi-history text-base"></i>
                    <span>Histórico</span>
                    <span :class="comingSoonBadge">Em breve</span>
                  </button>
                </li>
              </ul>
            </div>

            <div class="mb-6">
              <h3
                class="px-4 text-[0.6rem] font-bold text-school-900 dark:text-lousa-200 uppercase tracking-widest mb-3"
              >
                Suporte
              </h3>
              <ul class="space-y-1">
                <li>
                  <RouterLink
                    to="/faq"
                    :class="navItemClass"
                    :active-class="activeNavClass"
                    @click="closeCallback"
                  >
                    <i class="pi pi-question-circle text-base"></i>
                    <span>Dúvidas</span>
                  </RouterLink>
                </li>
                <li>
                  <button
                    @click="showComingSoon"
                    :class="disabledNavItemClass"
                  >
                    <i class="pi pi-info-circle text-base"></i>
                    <span>Contato</span>
                    <span :class="comingSoonBadge">Em breve</span>
                  </button> 
                </li>
              </ul>
            </div>

            <div class="mb-6">
              <h3
                class="px-4 text-[0.6rem] font-bold text-school-900 dark:text-lousa-200 uppercase tracking-widest mb-3"
              >
                Conta
              </h3>
              <ul class="space-y-1">
                <li>
                  <RouterLink
                    to="/settings"
                    :class="navItemClass"
                    :active-class="activeNavClass"
                    @click="closeCallback"
                  >
                    <i class="pi pi-cog text-base"></i>
                    <span>Configurações</span>
                  </RouterLink>
                </li>
              </ul>
            </div>
          </nav>

        <div class="account-footer p-4 border-t border-school-100 dark:border-lousa-700 bg-school-50 dark:bg-lousa-800/50 shrink-0">
          <div class="flex items-center gap-3 mb-4 px-2">
            <Avatar
              :image="userPhoto || undefined"
              :label="userPhoto ? '' : (name.charAt(0) || 'P')"
              shape="circle"
              class="!bg-indigo-100 dark:!bg-indigo-900/40 !text-indigo-600 dark:!text-indigo-400 !border !border-borda-200 dark:!border-borda-700 !font-bold"
              style="width: 2.25rem; height: 2.25rem"
            />
            <div class="flex flex-col min-w-0">
              <span class="text-school-800 dark:text-lousa-100 text-sm font-semibold truncate">
                {{ name || "Professor" }}
              </span>
              <span class="text-school-500 dark:text-lousa-400 text-xs"> Docente </span>
            </div>
          </div>

          <button
            @click="handleSignout"
            class="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-school-500 dark:text-lousa-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
          >
              <i class="pi pi-sign-out"></i>
              <span>Encerrar Sessão</span>
            </button>
          </div>
        </div>
      </template>
    </Drawer>

    <aside
      class="hidden sm:flex fixed top-0 left-0 z-50 h-screen bg-white dark:bg-lousa-800 border-r border-school-200 dark:border-lousa-700 shadow-sm flex-col transition-[width] duration-300 ease-in-out"
      :class="sidebar.collapsed ? 'w-16' : 'w-64'"
    >
      <div
        class="h-20 flex items-center border-b border-school-100 dark:border-lousa-700 shrink-0"
        :class="sidebar.collapsed ? 'justify-center px-2' : 'justify-between px-6'"
      >
        <RouterLink
          v-if="!sidebar.collapsed"
          to="/dashboard"
          class="flex items-center gap-3 group outline-none"
        >
          <img :src="logoSrc" alt="" class="h-8 w-auto" />
          <div class="flex flex-col">
            <span class="text-lg font-extrabold text-school-800 dark:text-lousa-100 tracking-tighter leading-tight">
              LetMe<span class="text-indigo-500">DoIt</span>
            </span>
            <span class="text-[10px] uppercase tracking-[0.2em] text-school-400 dark:text-lousa-500 font-bold">
              Painel Docente
            </span>
          </div>
        </RouterLink>

        <button
          @click="sidebar.toggle"
          type="button"
          :title="sidebar.collapsed ? 'Expandir menu' : 'Recolher menu'"
          class="flex items-center justify-center p-2 rounded-lg text-school-400 dark:text-lousa-500 hover:text-school-700 dark:hover:text-lousa-200 hover:bg-school-100 dark:hover:bg-lousa-700 transition-colors focus:outline-none"
        >
          <i :class="['pi', sidebar.collapsed ? 'pi-angle-right' : 'pi-angle-left']"></i>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto py-6 custom-scrollbar min-h-0" :class="sidebar.collapsed ? 'px-2' : 'px-4'">
        <div class="mb-6">
          <h3
            v-if="!sidebar.collapsed"
            class="px-4 text-[10px] font-bold text-school-900 dark:text-lousa-200 uppercase tracking-widest mb-3"
          >
            Principal
          </h3>
          <ul class="space-y-1">
            <li>
              <RouterLink
                to="/dashboard"
                :class="desktopNavItemClass"
                :active-class="activeNavClass"
                :title="sidebar.collapsed ? 'Dashboard' : undefined"
              >
                <i class="pi pi-desktop text-base"></i>
                <span v-if="!sidebar.collapsed">Dashboard</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/classes"
                :class="desktopNavItemClass"
                :active-class="activeNavClass"
                :title="sidebar.collapsed ? 'Suas Turmas' : undefined"
              >
                <i class="pi pi-users text-base"></i>
                <span v-if="!sidebar.collapsed">Suas Turmas</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="mb-6">
          <h3
            v-if="!sidebar.collapsed"
            class="px-4 text-[10px] font-bold text-school-900 dark:text-lousa-200 uppercase tracking-widest mb-3"
          >
            Gestão de Provas
          </h3>
          <ul class="space-y-1">
            <li>
              <RouterLink
                to="/templates"
                :class="desktopNavItemClass"
                :active-class="activeNavClass"
                :title="sidebar.collapsed ? 'Gabaritos' : undefined"
              >
                <i class="pi pi-file-check text-base"></i>
                <span v-if="!sidebar.collapsed">Gabaritos</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/submissions"
                :class="desktopNavItemClass"
                :active-class="activeNavClass"
                :title="sidebar.collapsed ? 'Submissões' : undefined"
              >
                <i class="pi pi-images text-base"></i>
                <span v-if="!sidebar.collapsed">Submissões</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="mb-6">
          <h3
            v-if="!sidebar.collapsed"
            class="px-4 text-[10px] font-bold text-school-900 dark:text-lousa-200 uppercase tracking-widest mb-3"
          >
            Análise
          </h3>
          <ul class="space-y-1">
            <li>
              <RouterLink
                to="/analytics"
                :class="desktopNavItemClass"
                :active-class="activeNavClass"
                :title="sidebar.collapsed ? 'Desempenho' : undefined"
              >
                <i class="pi pi-chart-pie text-base"></i>
                <span v-if="!sidebar.collapsed">Desempenho</span>
              </RouterLink>
            </li>
            <li>
              <button
                @click="showComingSoon"
                :class="desktopDisabledNavItemClass"
                :title="sidebar.collapsed ? 'Histórico' : undefined"
              >
                <i class="pi pi-history text-base"></i>
                <span v-if="!sidebar.collapsed">Histórico</span>
                <span v-if="!sidebar.collapsed" :class="comingSoonBadge">Em breve</span>
              </button>
            </li>
          </ul>
        </div>

        <div class="mb-6">
          <h3
            v-if="!sidebar.collapsed"
            class="px-4 text-[10px] font-bold text-school-900 dark:text-lousa-200 uppercase tracking-widest mb-3"
          >
            Suporte
          </h3>
          <ul class="space-y-1">
            <li>
              <RouterLink
                to="/faq"
                :class="desktopNavItemClass"
                :active-class="activeNavClass"
                :title="sidebar.collapsed ? 'Dúvidas' : undefined"
              >
                <i class="pi pi-question-circle text-base"></i>
                <span v-if="!sidebar.collapsed">Dúvidas</span>
              </RouterLink>
            </li>
            <li>
              <button
                @click="showComingSoon"
                :class="desktopDisabledNavItemClass"
                :title="sidebar.collapsed ? 'Contato' : undefined"
              >
                <i class="pi pi-info-circle text-base"></i>
                <span v-if="!sidebar.collapsed">Contato</span>
                <span v-if="!sidebar.collapsed" :class="comingSoonBadge">Em breve</span>
              </button>
            </li>
          </ul>
        </div>

        <div class="mb-6">
          <h3
            v-if="!sidebar.collapsed"
            class="px-4 text-[10px] font-bold text-school-900 dark:text-lousa-200 uppercase tracking-widest mb-3"
          >
            Conta
          </h3>
          <ul class="space-y-1">
            <li>
              <RouterLink
                to="/settings"
                :class="desktopNavItemClass"
                :active-class="activeNavClass"
                :title="sidebar.collapsed ? 'Configurações' : undefined"
              >
                <i class="pi pi-cog text-base"></i>
                <span v-if="!sidebar.collapsed">Configurações</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>

          <div
            class="account-footer border-t border-school-100 dark:border-lousa-700 bg-school-50 dark:bg-lousa-800/50 shrink-0"
            :class="sidebar.collapsed ? 'p-2' : 'p-4'"
          >
        <div
          class="flex items-center gap-3 mb-4"
          :class="sidebar.collapsed ? 'justify-center px-0' : 'px-2'"
        >
          <Avatar
            :image="userPhoto || undefined"
            :label="userPhoto ? '' : (name.charAt(0) || 'P')"
            shape="circle"
            class="!bg-indigo-100 dark:!bg-indigo-900/40 !text-indigo-600 dark:!text-indigo-400 !border !border-borda-200 dark:!border-borda-700 !font-bold"
            style="width: 2.25rem; height: 2.25rem"
          />
          <div v-if="!sidebar.collapsed" class="flex flex-col min-w-0">
            <span class="text-school-800 dark:text-lousa-100 text-sm font-semibold truncate">
              {{ name || "Professor" }}
            </span>
            <span class="text-school-500 dark:text-lousa-400 text-xs"> Docente </span>
          </div>
        </div>

        <button
          @click="handleSignout"
          :title="sidebar.collapsed ? 'Encerrar Sessão' : undefined"
          class="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-school-500 dark:text-lousa-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
        >
          <i class="pi pi-sign-out"></i>
          <span v-if="!sidebar.collapsed">Encerrar Sessão</span>
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
  background: rgba(0, 0, 0, 0.1); /* Ajustado para tema claro */
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2); /* Ajustado para tema claro */
}

/* Mobile padding is handled via .page-content in main.css */

/* Hover animation for sidebar icons */
nav a i.pi,
nav button i.pi,
.account-footer button i.pi {
  transition: transform 0.2s ease, color 0.2s ease;
}

nav a:hover i.pi,
nav button:hover i.pi,
.account-footer button:hover i.pi {
  transform: scale(1.15) translateX(2px);
}
</style>
