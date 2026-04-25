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
    class="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans"
  >
    <!-- Background (tema escolar, mais neutro) -->
    <img
      src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2070&auto=format&fit=crop"
      alt="Ambiente escolar"
      class="absolute inset-0 w-full h-full object-cover z-0"
    />

    <!-- Overlay forte para legibilidade -->
    <div class="absolute inset-0 bg-[#0B0F19]/85 z-10"></div>

    <!-- Card -->
    <div
      class="relative z-20 w-full max-w-md bg-[#111827]/80 backdrop-blur-xl ring-1 ring-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl"
    >
      <!-- Logo + título -->
      <div class="flex flex-col items-center justify-center mb-10 gap-4">
        <div
          class="w-24 h-24 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center p-4 shadow-[0_0_60px_rgba(99,102,241,0.4)]"
        >
          <img
            src="../../../public/logo.png"
            alt="Logo"
            class="w-full h-full object-contain"
          />
        </div>

        <h1
          class="text-3xl font-extrabold text-white text-center leading-tight"
        >
          Bem-vindo de volta
        </h1>

        <p class="text-sm text-gray-400 text-center">
          Acesse o <span class="font-semibold text-indigo-400">LetMeDoIt</span>
        </p>
      </div>

      <!-- Erro -->
      <div
        v-if="errorMessage"
        class="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
      >
        <i class="pi pi-exclamation-circle mt-0.5"></i>
        <p class="text-sm">{{ errorMessage }}</p>
      </div>

      <!-- Form -->
      <form class="space-y-5" @submit.prevent="handleLogin">
        <div>
          <input
            v-model="email"
            type="email"
            placeholder="E-mail"
            required
            class="w-full px-4 py-3 bg-[#0B0F19]/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between px-1">
            <span class="text-transparent">.</span>
            <RouterLink
              to="/forgot-password"
              class="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Esqueci minha senha
            </RouterLink>
          </div>

          <input
            v-model="password"
            type="password"
            placeholder="Senha"
            required
            class="w-full px-4 py-3 bg-[#0B0F19]/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3.5 mt-2 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
        >
          <span v-if="isLoading" class="flex items-center justify-center gap-2">
            <i class="pi pi-spin pi-spinner text-sm"></i> Entrando...
          </span>
          <span v-else>Entrar</span>
        </button>
      </form>

      <!-- Footer -->
      <div
        class="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-400"
      >
        Novo por aqui?
        <RouterLink to="/signup" class="text-indigo-400 hover:text-indigo-300">
          Criar conta
        </RouterLink>
      </div>
    </div>
  </div>
</template>
