// Login.vue
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
  <div
    class="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans bg-slate-100"
  >
    <!-- Background (Tema escolar, mais neutro e claro) -->
    <img
      src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2070&auto=format&fit=crop"
      alt="Ambiente escolar"
      class="absolute inset-0 w-full h-full object-cover z-0"
    />

    <!-- Overlay claro e desfocado para criar uma sensação de vidro e leveza -->
    <div class="absolute inset-0 bg-slate-100/75 backdrop-blur-[2px] z-10"></div>

    <!-- Card -->
    <div
      class="relative z-20 w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-2xl"
    >
      <!-- Logo + título -->
      <div class="flex flex-col items-center justify-center mb-8 gap-4">
        <div
          class="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-3 shadow-sm"
        >
          <img
            src="../../../public/logo.png"
            alt="Logo"
            class="w-full h-full object-contain"
          />
        </div>

        <h1
          class="text-3xl font-extrabold text-slate-800 text-center leading-tight tracking-tight"
        >
          Bem-vindo de volta
        </h1>

        <p class="text-sm text-slate-500 text-center">
          Acesse o seu painel <span class="font-semibold text-emerald-600">LetMeDoIt</span>
        </p>
      </div>

      <!-- Erro -->
      <div
        v-if="errorMessage"
        class="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700"
      >
        <i class="pi pi-exclamation-circle mt-0.5 shrink-0 text-red-500"></i>
        <p class="text-sm font-medium">{{ errorMessage }}</p>
      </div>

      <!-- Form -->
      <form class="space-y-5" @submit.prevent="handleLogin">
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
            E-mail
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="professor@escola.com"
            required
            class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between px-1">
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Senha
            </label>
            <RouterLink
              to="/forgot-password"
              class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Esqueci minha senha
            </RouterLink>
          </div>

          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3.5 mt-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/10 active:scale-[0.98]"
        >
          <span v-if="isLoading" class="flex items-center justify-center gap-2">
            <i class="pi pi-spin pi-spinner text-sm"></i> Entrando...
          </span>
          <span v-else>Entrar</span>
        </button>
      </form>

      <!-- Footer -->
      <div
        class="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500"
      >
        Novo por aqui?
        <RouterLink to="/signup" class="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
          Criar conta
        </RouterLink>
      </div>
    </div>
  </div>
</template>
