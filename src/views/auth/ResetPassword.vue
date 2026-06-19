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
    class="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans bg-gradient-to-br from-emerald-50 via-white to-slate-100 dark:from-emerald-950 dark:via-slate-900 dark:to-slate-950"
  >
    <div
      class="absolute top-0 right-0 w-[32rem] h-[32rem] translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-400/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none"
    ></div>
    <div
      class="absolute bottom-0 left-0 w-[24rem] h-[24rem] -translate-x-1/4 translate-y-1/4 rounded-full bg-emerald-300/10 dark:bg-emerald-600/5 blur-3xl pointer-events-none"
    ></div>

    <div
      class="relative z-20 w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700 rounded-3xl p-8 sm:p-10 shadow-2xl"
    >
      <div class="flex flex-col items-center justify-center mb-8">
        <div
          class="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-800 rounded-2xl flex items-center justify-center mb-4"
        >
          <i class="pi pi-shield text-3xl text-emerald-600 dark:text-emerald-400"></i>
        </div>

        <h2
          class="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 text-center"
        >
          Nova Senha
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center font-medium">
          Quase lá! Escolha uma nova senha segura para voltar ao portal.
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="handleResetPassword">
        <div
          v-if="status"
          class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex flex-col gap-4 items-center text-center"
        >
          <div
            class="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400"
          >
            <i class="pi pi-check text-xl"></i>
          </div>
          <p class="font-semibold leading-relaxed">{{ status }}</p>
          <RouterLink
            to="/signin"
            class="w-full py-3 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-600/10 text-center"
          >
            Fazer Login
          </RouterLink>
        </div>

        <div
          v-if="errorMsg"
          class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex gap-3 items-center"
        >
          <i class="pi pi-exclamation-triangle text-red-500"></i>
          <p class="font-medium">{{ errorMsg }}</p>
        </div>

        <template v-if="!status">
          <div class="space-y-4">
            <div class="space-y-1.5">
              <label
                for="password"
                class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1"
                >Nova Senha</label
              >
              <div class="relative">
                <i
                  class="pi pi-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm"
                ></i>
                <input
                  v-model="password"
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  required
                  minlength="6"
                  class="w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label
                for="confirmPassword"
                class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1"
                >Confirmar Senha</label
              >
              <div class="relative">
                <i
                  class="pi pi-lock-open absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm"
                ></i>
                <input
                  v-model="confirmPassword"
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                  required
                  minlength="6"
                  class="w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center items-center gap-2 py-3.5 mt-4 rounded-xl font-bold text-white bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-50 transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/10"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            {{ loading ? "Salvando..." : "Redefinir Senha" }}
          </button>
        </template>
      </form>

      <div v-if="!status" class="mt-8 text-center border-t border-slate-100 dark:border-slate-700 pt-6">
        <RouterLink
          to="/signin"
          class="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
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
