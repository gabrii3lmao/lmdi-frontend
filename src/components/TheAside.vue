<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import api from "@/services/api";
import { useRoute } from "vue-router";
import Drawer from "primevue/drawer";
import Avatar from "primevue/avatar";

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

// Atualizado para Tema Claro
const navItemClass =
  "flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-500 rounded-lg hover:bg-slate-50 hover:text-slate-900 group transition-all duration-200 border-l-2 border-transparent";

// Atualizado para Tema Claro (contraste ajustado)
const activeNavClass = "!text-emerald-600 !bg-emerald-50 !border-emerald-500";
</script>

<template>
  <div v-if="showSidebar">
    <header
      class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4 sm:hidden"
    >
      <div class="flex items-center gap-3">
        <button
          @click="toggleMenu"
          type="button"
          class="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all focus:outline-none"
        >
          <i class="pi pi-bars text-xl"></i>
        </button>
        <span class="text-lg font-bold text-slate-900 tracking-tighter">
          LetMe<span class="text-emerald-500">DoIt</span>
        </span>
      </div>

      <Avatar
        :label="name.charAt(0) || 'P'"
        shape="circle"
        class="!bg-emerald-100 !text-emerald-600 !border !border-emerald-200 !font-bold"
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
        mask: { class: 'bg-slate-900/50 backdrop-blur-sm' },
      }"
    >
      <template #container="{ closeCallback }">
        <div
          class="w-64 h-screen bg-white border-r border-slate-200 shadow-2xl flex flex-col"
        >
          <div
            class="h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0"
          >
            <RouterLink
              to="/"
              class="flex flex-col justify-center group outline-none"
              @click="closeCallback"
            >
              <div class="flex items-baseline gap-1">
                <span
                  class="text-2xl font-extrabold tracking-tighter text-slate-800 transition-colors group-hover:text-slate-950"
                >
                  LetMe<span class="text-emerald-500">DoIt</span>
                </span>
                <span
                  class="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:bg-emerald-600 group-hover:scale-125 transition-all duration-200"
                ></span>
              </div>
              <span
                class="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-0.5 font-bold"
              >
                Painel Docente
              </span>
            </RouterLink>

            <button
              @click="closeCallback"
              class="text-slate-400 hover:text-slate-600 p-2"
            >
              <i class="pi pi-times text-lg"></i>
            </button>
          </div>

          <nav class="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
            <div class="mb-6">
              <h3
                class="px-4 text-[0.6rem] font-bold text-slate-900 uppercase tracking-widest mb-3"
              >
                Principal
              </h3>
              <ul class="space-y-1">
                <li>
                  <RouterLink
                    to="/"
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
                class="px-4 text-[0.6rem] font-bold text-slate-900 uppercase tracking-widest mb-3"
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
                class="px-4 text-[0.6rem] font-bold text-slate-900 uppercase tracking-widest mb-3"
              >
                Análises (Em Breve)
              </h3>
              <ul class="space-y-1">
                <li>
                  <RouterLink
                    to="/reports"
                    :class="navItemClass"
                    :active-class="activeNavClass"
                    @click="closeCallback"
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
                    @click="closeCallback"
                  >
                    <i class="pi pi-history text-base"></i>
                    <span>Histórico</span>
                  </RouterLink>
                </li>
              </ul>
            </div>

            <div class="mb-6">
              <h3
                class="px-4 text-[0.6rem] font-bold text-slate-900 uppercase tracking-widest mb-3"
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
                  <RouterLink
                    to="/support"
                    :class="navItemClass"
                    :active-class="activeNavClass"
                    @click="closeCallback"
                  >
                    <i class="pi pi-info-circle text-base"></i>
                    <span>Contato</span>
                  </RouterLink>
                </li>
              </ul>
            </div>
          </nav>

          <div class="p-4 border-t border-slate-100 bg-slate-50">
            <div class="flex items-center gap-3 mb-4 px-2">
              <Avatar
                :label="name.charAt(0) || 'P'"
                shape="circle"
                class="!bg-emerald-100 !text-emerald-600 !border !border-emerald-200 !font-bold"
                style="width: 2.25rem; height: 2.25rem"
              />
              <div class="flex flex-col min-w-0">
                <span class="text-slate-800 text-sm font-semibold truncate">
                  {{ name || "Professor" }}
                </span>
                <span class="text-slate-500 text-xs"> Docente </span>
              </div>
            </div>

            <button
              @click="handleSignout"
              class="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
            >
              <i class="pi pi-sign-out"></i>
              <span>Encerrar Sessão</span>
            </button>
          </div>
        </div>
      </template>
    </Drawer>

    <aside
      class="hidden sm:flex fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-slate-200 shadow-sm flex-col"
    >
      <div
        class="h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0"
      >
        <RouterLink
          to="/"
          class="flex flex-col justify-center group outline-none"
        >
          <div class="flex items-baseline gap-1">
            <span
              class="text-2xl font-extrabold tracking-tighter text-slate-800 transition-colors group-hover:text-slate-950"
            >
              LetMe<span class="text-emerald-500">DoIt</span>
            </span>
            <span
              class="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:bg-emerald-600 group-hover:scale-125 transition-all duration-200"
            ></span>
          </div>

          <span
            class="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-0.5 font-bold"
          >
            Painel Docente
          </span>
        </RouterLink>
      </div>

      <nav class="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <div class="mb-6">
          <h3
            class="px-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-3"
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
            class="px-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-3"
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
            class="px-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-3"
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
            class="px-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-3"
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
                <span>Dúvidas</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/support"
                :class="navItemClass"
                :active-class="activeNavClass"
              >
                <i class="pi pi-info-circle text-base"></i>
                <span>Contato</span>
              </RouterLink> 
            </li>
          </ul>
        </div>
      </nav>

      <div class="p-4 border-t border-slate-100 bg-slate-50">
        <div class="flex items-center gap-3 mb-4 px-2">
          <Avatar
            :label="name.charAt(0) || 'P'"
            shape="circle"
            class="!bg-emerald-100 !text-emerald-600 !border !border-emerald-200 !font-bold"
            style="width: 2.25rem; height: 2.25rem"
          />
          <div class="flex flex-col min-w-0">
            <span class="text-slate-800 text-sm font-semibold truncate">
              {{ name || "Professor" }}
            </span>
            <span class="text-slate-500 text-xs"> Docente </span>
          </div>
        </div>

        <button
          @click="handleSignout"
          class="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
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
  background: rgba(0, 0, 0, 0.1); /* Ajustado para tema claro */
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2); /* Ajustado para tema claro */
}

/* Garante que o conteúdo das páginas não fique sob a Topbar no mobile */
:deep(main),
:deep(.page-container) {
  @media (max-width: 639px) {
    padding-top: 4rem; /* h-16 */
  }
}
</style>
