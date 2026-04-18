<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import api from "@/services/api";

const route = useRoute();
const token = route.params.token;

const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const errorMsg = ref("");
const status = ref("");

async function handleResetPassword() {
  errorMsg.value = "";
  status.value = "";

  if (password.value !== confirmPassword.value) {
    errorMsg.value = "As senhas não coincidem!";
    return;
  }

  try {
    loading.value = true;
    await api.post(`/auth/reset-password/${token}`, {
      password: password.value,
    });
    status.value =
      "Senha alterada com sucesso! Você já pode acessar sua conta.";
    password.value = "";
    confirmPassword.value = "";
  } catch (error) {
    errorMsg.value =
      "Erro ao redefinir senha. O link pode ter expirado ou ser inválido.";
  } finally {
    loading.value = false;
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
        <h2
          class="text-2xl font-extrabold tracking-tight text-white text-center"
        >
          Nova Senha
        </h2>
        <p class="text-sm text-gray-400 mt-2 text-center">
          Crie uma nova senha forte para acessar o sistema.
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="handleResetPassword">
        <div
          v-if="status"
          class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex flex-col gap-3 items-center text-center"
        >
          <i class="pi pi-check-circle text-2xl"></i>
          <p>{{ status }}</p>
          <RouterLink
            to="/signin"
            class="mt-2 w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg font-bold transition-colors"
          >
            Ir para o Login
          </RouterLink>
        </div>

        <div
          v-if="errorMsg"
          class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-3 items-start"
        >
          <i class="pi pi-exclamation-circle mt-0.5"></i>
          <p>{{ errorMsg }}</p>
        </div>

        <template v-if="!status">
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Nova Senha
            </label>
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
                minlength="6"
                class="block w-full pl-10 pr-3 py-2.5 bg-[#0B0F19]/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Confirmar Nova Senha
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"
              >
                <i class="pi pi-lock"></i>
              </div>
              <input
                v-model="confirmPassword"
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
                required
                minlength="6"
                class="block w-full pl-10 pr-3 py-2.5 bg-[#0B0F19]/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center items-center gap-2 py-3 px-4 mt-2 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all active:scale-95"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            {{ loading ? "Alterando..." : "Salvar Nova Senha" }}
          </button>
        </template>
      </form>
    </div>
  </div>
</template>
