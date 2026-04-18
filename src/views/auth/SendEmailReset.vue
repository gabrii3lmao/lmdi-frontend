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
      "Se o e-mail estiver cadastrado, você receberá um link em breve!";
    email.value = ""; // Limpa o input após enviar
  } catch (error: any) {
    errorMsg.value =
      error.response?.data?.error || "Erro ao processar solicitação.";
  } finally {
    loading.value = false;
    // Removido o router.push para que o usuário possa ler a mensagem!
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
          class="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4"
        >
          <i class="pi pi-key text-xl"></i>
        </div>
        <h2
          class="text-2xl font-extrabold tracking-tight text-white text-center"
        >
          Esqueceu a senha?
        </h2>
        <p class="text-sm text-gray-400 mt-2 text-center leading-relaxed">
          Sem problemas. Enviaremos um link seguro para você redefinir seu
          acesso.
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="handleForgotPassword">
        <div
          v-if="message"
          class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex gap-3 items-start"
        >
          <i class="pi pi-check-circle mt-0.5"></i>
          <p>{{ message }}</p>
        </div>

        <div
          v-if="errorMsg"
          class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-3 items-start"
        >
          <i class="pi pi-exclamation-circle mt-0.5"></i>
          <p>{{ errorMsg }}</p>
        </div>

        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-300 mb-1.5"
          >
            Seu E-mail Cadastrado
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
              class="block w-full pl-10 pr-3 py-2.5 bg-[#0B0F19]/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all sm:text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111827] focus:ring-indigo-500 disabled:opacity-50 transition-all active:scale-95"
        >
          <i v-if="loading" class="pi pi-spin pi-spinner"></i>
          {{ loading ? "Enviando..." : "Receber link de recuperação" }}
        </button>
      </form>

      <div class="mt-8 text-center">
        <RouterLink
          to="/signin"
          class="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <i class="pi pi-arrow-left text-xs"></i> Voltar ao Login
        </RouterLink>
      </div>
    </div>
  </div>
</template>
