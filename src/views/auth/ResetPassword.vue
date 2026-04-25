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
      src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop"
      alt="Biblioteca Escolar"
      class="absolute inset-0 w-full h-full object-cover z-0"
    />

    <div class="absolute inset-0 bg-[#0B0F19]/85 backdrop-blur-sm z-10"></div>

    <div
      class="relative z-20 w-full max-w-md bg-[#111827]/80 backdrop-blur-xl ring-1 ring-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl animate-in fade-in zoom-in duration-500"
    >
      <div class="flex flex-col items-center justify-center mb-8">
        <div
          class="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-4"
        >
          <i class="pi pi-shield text-3xl text-indigo-400"></i>
        </div>

        <h2
          class="text-2xl font-extrabold tracking-tight text-white text-center"
        >
          Nova Senha
        </h2>
        <p class="text-sm text-gray-400 mt-2 text-center">
          Quase lá! Escolha uma senha segura para voltar aos estudos.
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="handleResetPassword">
        <div
          v-if="status"
          class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex flex-col gap-4 items-center text-center animate-in slide-in-from-top-2"
        >
          <div
            class="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center"
          >
            <i class="pi pi-check text-xl"></i>
          </div>
          <p class="font-medium">{{ status }}</p>
          <RouterLink
            to="/signin"
            class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20"
          >
            Fazer Login
          </RouterLink>
        </div>

        <div
          v-if="errorMsg"
          class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-3 items-center animate-in shake-x"
        >
          <i class="pi pi-exclamation-triangle"></i>
          <p>{{ errorMsg }}</p>
        </div>

        <template v-if="!status">
          <div class="space-y-4">
            <div class="space-y-1.5">
              <label
                for="password"
                class="text-[10px] uppercase font-bold text-gray-500 ml-1"
                >Nova Senha</label
              >
              <div class="relative">
                <i
                  class="pi pi-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                ></i>
                <input
                  v-model="password"
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  required
                  minlength="6"
                  class="w-full pl-11 pr-4 py-3 bg-[#0B0F19]/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label
                for="confirmPassword"
                class="text-[10px] uppercase font-bold text-gray-500 ml-1"
                >Confirmar Senha</label
              >
              <div class="relative">
                <i
                  class="pi pi-lock-open absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                ></i>
                <input
                  v-model="confirmPassword"
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                  required
                  minlength="6"
                  class="w-full pl-11 pr-4 py-3 bg-[#0B0F19]/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center items-center gap-2 py-3.5 mt-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            {{ loading ? "Salvando..." : "Redefinir Senha" }}
          </button>
        </template>
      </form>

      <div v-if="!status" class="mt-8 text-center">
        <RouterLink
          to="/signin"
          class="text-sm text-gray-500 hover:text-indigo-400 transition-colors"
        >
          <i class="pi pi-arrow-left text-[10px] mr-1"></i> Voltar para o login
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake-x {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}
.animate-in.shake-x {
  animation: shake-x 0.2s ease-in-out 0s 2;
}
</style>
