<script setup lang="ts">
import { ref } from "vue";
import api from "@/services/api";
import { useRouter } from "vue-router";
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const router = useRouter();

async function handleLogin() {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await api.post("/auth/signin", {
      email: email.value,
      password: password.value,
    });

    const { id, name, token } = response.data.user;

    localStorage.setItem("token", token);
    localStorage.setItem("username", name);
    localStorage.setItem("userId", id);

    router.push("/");
  } catch (error: any) {
    if (error.response?.data) {
      const data = error.response.data;
      if (data.details) {
        errorMessage.value = data.error || "Dados inválidos.";
      } else {
        errorMessage.value =
          data.error || data.message || "Credenciais incorretas.";
      }
    } else {
      errorMessage.value = "Erro de conexão.";
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen w-full flex font-sans bg-white overflow-hidden">
    <!-- Lado do Formulário (Esquerda) -->
    <div
      class="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-16 lg:px-24 xl:px-32 relative z-10"
    >
      <div class="w-full max-w-sm mx-auto">
        <!-- Logo Header Corrigido -->
        <div class="flex items-center gap-3 mb-10">
          <span class="text-5xl font-extrabold text-slate-900 tracking-tight">
            Let Me <span class="text-emerald-600">Do It!</span>
          </span>
        </div>

        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Bem-vindo de volta
          </h1>
          <p class="text-slate-500 text-sm">
            Insira suas credenciais para acessar o seu painel de gestão.
          </p>
        </div>

        <div
          v-if="errorMessage"
          class="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50/50 border border-red-100 text-red-700 transition-all"
        >
          <i class="pi pi-exclamation-circle mt-0.5 shrink-0 text-red-500"></i>
          <p class="text-sm font-medium">{{ errorMessage }}</p>
        </div>

        <form class="space-y-5" @submit.prevent="handleLogin">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">
              E-mail
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              required
              class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm"
            />
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-slate-700">
                Senha
              </label>
              <RouterLink
                to="/forgot-password"
                class="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Esqueceu a senha?
              </RouterLink>
            </div>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2.5 mt-2 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <i v-if="isLoading" class="pi pi-spin pi-spinner text-sm"></i>
            <span>{{ isLoading ? "Entrando..." : "Entrar na conta" }}</span>
          </button>
        </form>

        <p class="mt-8 text-center text-sm text-slate-500">
          Ainda não tem uma conta?
          <RouterLink
            to="/signup"
            class="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Cadastre-se grátis
          </RouterLink>
        </p>
      </div>
    </div>

    <!-- Lado da Imagem (Direita) -->
    <div
      class="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center p-12 lg:p-20 overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-900 z-0"
      ></div>

      <div class="relative z-10 w-full max-w-2xl flex flex-col items-center">
        <h2
          class="text-3xl font-bold text-white mb-4 text-center leading-tight"
        >
          Gestão inteligente, resultados reais.
        </h2>
        <p class="text-slate-400 text-center mb-10 text-lg max-w-lg">
          Tudo o que você precisa para gerenciar seus processos em um único
          lugar.
        </p>

        <div
          class="w-full rounded-2xl bg-white/5 p-2 backdrop-blur-sm border border-white/10 shadow-2xl transform transition-transform duration-700 hover:scale-[1.02]"
        >
          <img
            src="/app-screenshot.png"
            alt="Interface do LetMeDoIt"
            class="w-full h-auto rounded-xl border border-white/10 shadow-inner"
          />
        </div>
      </div>
    </div>
  </div>
</template>
