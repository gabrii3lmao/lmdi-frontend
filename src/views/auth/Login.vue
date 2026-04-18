<script setup lang="ts">
import { ref } from "vue";
import api from "@/services/api";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const router = useRouter();

async function handleLogin() {
  isLoading.value = true;
  try {
    const response = await api.post("/auth/signin", {
      email: email.value,
      password: password.value,
    });

    const { id, name, token } = response.data.user;

    // Salvando os dados corretamente (corrigido o bug do userId)
    localStorage.setItem("token", token);
    localStorage.setItem("username", name);
    localStorage.setItem("userId", id);

    router.push("/");
  } catch (error) {
    alert("Falha no login: Verifique suas credenciais.");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div
    class="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans"
  >
    <img
      src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
      alt="Background tech"
      class="absolute inset-0 w-full h-full object-cover z-0"
    />

    <div class="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-md z-10"></div>

    <div
      class="relative z-20 w-full max-w-md bg-[#111827]/80 backdrop-blur-xl ring-1 ring-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl animate-in fade-in zoom-in duration-500"
    >
      <div class="flex flex-col items-center justify-center mb-8">
        <div
          class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4"
        >
          <i class="pi pi-check text-white text-xl font-bold"></i>
        </div>
        <h2 class="text-2xl font-extrabold tracking-tight text-white">
          Bem-vindo de volta
        </h2>
        <p class="text-sm text-gray-400 mt-1">
          Acesse o <span class="font-bold text-indigo-400">LetMeDoIt</span>
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="handleLogin">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-300 mb-1.5"
          >
            E-mail profissional
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"
            >
              <i class="pi pi-envelope"></i>
            </div>
            <input
              v-model="email"
              type="email"
              id="email"
              placeholder="exemplo@escola.com"
              required
              class="block w-full pl-10 pr-3 py-2.5 bg-[#0B0F19]/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label
              for="password"
              class="block text-sm font-medium text-gray-300"
            >
              Sua Senha
            </label>
            <RouterLink
              to="/forgot-password"
              class="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Esqueceu a senha?
            </RouterLink>
          </div>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"
            >
              <i class="pi pi-lock"></i>
            </div>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="••••••••"
              required
              class="block w-full pl-10 pr-3 py-2.5 bg-[#0B0F19]/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full flex justify-center items-center gap-2 py-3 px-4 mt-2 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111827] focus:ring-indigo-500 disabled:opacity-50 transition-all active:scale-95"
        >
          <i v-if="isLoading" class="pi pi-spin pi-spinner"></i>
          {{ isLoading ? "Autenticando..." : "Entrar no Sistema" }}
        </button>
      </form>

      <div class="mt-8">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/10"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-[#111827] text-gray-500">Novo por aqui?</span>
          </div>
        </div>

        <div class="mt-6 text-center">
          <RouterLink
            to="/signup"
            class="w-full flex justify-center items-center py-2.5 px-4 border border-white/10 rounded-xl text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 transition-all"
          >
            Criar uma conta gratuita
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
