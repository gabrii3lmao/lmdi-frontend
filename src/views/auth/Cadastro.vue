// Cadastro.vue
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

const router = useRouter();

async function handleSignup() {
  loading.value = true;
  errorMessage.value = "";

  try {
    await api.post("/auth/signup", {
      name: name.value,
      email: email.value,
      password: password.value,
    });
    router.push("/signin");
  } catch (error: any) {
    if (error.response?.data) {
      const data = error.response.data;

      if (data.details) {
        errorMessage.value = data.error || "Verifique os dados preenchidos.";
      } else {
        errorMessage.value = data.error || data.message || "Erro ao cadastrar.";
      }
    } else {
      errorMessage.value = "Erro de conexão.";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex w-full font-sans bg-slate-50 dark:bg-slate-900 overflow-x-hidden">
    <!-- LADO ESQUERDO (Imagens e Branding - Visível apenas em Telas Grandes) -->
    <div
      class="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 xl:p-16"
    >
      <!-- Background Escolar -->
      <img
        src="@/assets/cadastro.webp"
        alt="Sala de aula"
        class="absolute inset-0 w-full h-full object-cover z-0"
      />

      <!-- Overlay Escolar (já claro) -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/95 via-white/85 to-emerald-50/50 backdrop-blur-[1px] z-10"
      ></div>

      <div class="relative z-20 flex items-center gap-4">
        <div
          class="w-32 h-auto xl:w-48 xl:h-auto rounded-2xl bg-emerald-500/1 flex items-center justify-center p-3"
        >
          <img
            src="@/assets/logo1.webp"
            alt="Logo"
            class="w-full h-auto object-contain"
          />
        </div>

        <span
          class="text-4xl xl:text-5xl font-extrabold text-slate-800 leading-none tracking-tight"
        >
          Let Me<span class="text-emerald-600">Do It!</span>
        </span>
      </div>

      <!-- Conteúdo de Apoio -->
      <div class="relative z-20 mt-auto max-w-lg">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-6 shadow-sm"
        >
          <i class="pi pi-sparkles text-[10px]"></i>
          <span>Painel Docente</span>
        </div>

        <h1
          class="text-4xl xl:text-5xl font-extrabold text-slate-800 mb-6 leading-tight tracking-tight"
        >
          Automatize a correção das suas provas.
        </h1>

        <p
          class="text-base xl:text-lg text-slate-600 mb-8 max-w-md font-medium"
        >
          Gestão de gabaritos, análise de submissões e acompanhamento em tempo
          real para professores.
        </p>
      </div>
    </div>

    <!-- LADO DIREITO (Formulário de Cadastro) -->
    <div
      class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-slate-50 dark:bg-slate-900"
    >
      <!-- Círculo decorativo -->
      <div
        class="absolute top-0 right-0 w-72 h-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"
      ></div>

      <div class="w-full max-w-md relative z-10">
        <!-- Mobile Logo -->
        <div class="lg:hidden flex flex-col items-center mb-8 gap-4">
          <div
            class="w-22 h-22 rounded-2xl flex items-center justify-center p-3 shadow-sm"
          >
            <img
              src="@/assets/logo1.webp"
              alt="Logo"
              class="w-16 h-22 object-contain"
            />
          </div>
          <h1
            class="text-4xl font-extrabold text-slate-800 dark:text-slate-100 text-center tracking-tight"
          >
            LetMe<span class="text-emerald-600 dark:text-emerald-400">DoIt</span>
          </h1>
        </div>

        <!-- Card de Cadastro -->
        <div
          class="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-3xl p-8 sm:p-10 shadow-xl"
        >
          <!-- Título -->
          <div class="mb-8 text-center sm:text-left">
            <h2
              class="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight"
            >
              Crie sua conta
            </h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Preencha seus dados para começar.
            </p>
          </div>

          <!-- Mensagem de Erro -->
          <div
            v-if="errorMessage"
            class="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400"
          >
            <i
              class="pi pi-exclamation-circle mt-0.5 shrink-0 text-red-500"
            ></i>
            <p class="text-sm font-medium">{{ errorMessage }}</p>
          </div>

          <!-- Formulário -->
          <form class="space-y-5" @submit.prevent="handleSignup">
            <div>
              <label
                class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1"
              >
                Nome completo
              </label>
              <input
                v-model="name"
                type="text"
                placeholder="Ex: Prof. Carlos Silva"
                required
                class="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label
                class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1"
              >
                E-mail institucional
              </label>
              <input
                v-model="email"
                type="email"
                placeholder="carlos.silva@escola.com"
                required
                class="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label
                class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1"
              >
                Senha
              </label>
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                required
                class="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3.5 mt-2 rounded-xl font-bold text-white bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/10 active:scale-[0.98]"
            >
              <span
                v-if="loading"
                class="flex items-center justify-center gap-2"
              >
                <i class="pi pi-spin pi-spinner text-sm"></i> Criando conta...
              </span>
              <span v-else>Criar Conta</span>
            </button>
          </form>

          <!-- Footer -->
          <div
            class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400"
          >
            Já possui uma conta?
            <RouterLink
              to="/signin"
              class="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              Entrar
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
