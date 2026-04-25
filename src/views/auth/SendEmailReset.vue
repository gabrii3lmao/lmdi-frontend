<script setup lang="ts">
import api from "@/services/api";
import { ref } from "vue";

const email = ref("");
const loading = ref(false);
const message = ref("");
const errorMsg = ref("");

async function handleForgotPassword() {
  message.value = "";
  errorMsg.value = "";

  try {
    loading.value = true;
    await api.post("/auth/forgot-password", {
      email: email.value,
    });

    message.value =
      "Se o e-mail estiver cadastrado, você receberá um link em breve! Verifique também sua caixa de spam.";
    email.value = "";
  } catch (error: any) {
    errorMsg.value =
      error.response?.data?.error || "Erro ao processar solicitação.";
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
      src="https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=2068&auto=format&fit=crop"
      alt="Materiais de estudo"
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
          <i class="pi pi-key text-3xl text-indigo-400"></i>
        </div>

        <h2
          class="text-2xl font-extrabold tracking-tight text-white text-center"
        >
          Esqueceu a senha?
        </h2>
        <p class="text-sm text-gray-400 mt-2 text-center leading-relaxed">
          Não se preocupe! Informe seu e-mail e enviaremos as instruções de
          recuperação.
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="handleForgotPassword">
        <div
          v-if="message"
          class="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex flex-col gap-4 items-center text-center animate-in slide-in-from-bottom-2"
        >
          <div
            class="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center"
          >
            <i class="pi pi-send text-xl"></i>
          </div>
          <p class="font-medium">{{ message }}</p>
          <RouterLink
            to="/signin"
            class="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10"
          >
            Voltar para o Login
          </RouterLink>
        </div>

        <div
          v-if="errorMsg"
          class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-3 items-center animate-in shake-x"
        >
          <i class="pi pi-exclamation-circle"></i>
          <p>{{ errorMsg }}</p>
        </div>

        <template v-if="!message">
          <div class="space-y-1.5">
            <label
              for="email"
              class="text-[13px] uppercase font-bold text-gray-500 ml-1"
            >
              E-mail de Acesso
            </label>
            <div class="relative">
              <i
                class="pi pi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
              ></i>
              <input
                v-model="email"
                type="email"
                id="email"
                placeholder="exemplo@escola.com"
                required
                class="w-full pl-11 pr-4 py-3 bg-[#0B0F19]/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center items-center gap-2 py-3.5 mt-2 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            {{ loading ? "Enviando link..." : "Recuperar Acesso" }}
          </button>
        </template>
      </form>

      <div
        v-if="!message"
        class="mt-8 text-center border-t border-white/5 pt-6"
      >
        <RouterLink
          to="/signin"
          class="text-sm font-medium text-gray-500 hover:text-indigo-400 transition-all flex items-center justify-center gap-2"
        >
          <i class="pi pi-arrow-left text-[10px]"></i> Voltar ao Login
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
