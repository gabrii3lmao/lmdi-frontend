// Cadastro.vue
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref(""); // Estado para a flash message

const router = useRouter();

async function handleSignup() {
  loading.value = true;
  errorMessage.value = ""; // Limpa erros anteriores

  try {
    await api.post("/auth/signup", {
      name: name.value,
      email: email.value,
      password: password.value,
    });
    router.push("/signin");
  } catch (error: any) {
    console.error("Erro no cadastro: ", error);

    // Tratamento de erro do backend (incluindo Zod)
    if (error.response?.data) {
      const data = error.response.data;

      // Se houver detalhes do Zod, podemos formatar ou exibir a mensagem principal
      if (data.details) {
        errorMessage.value =
          data.error || "Verifique os dados preenchidos e tente novamente.";
        console.log("Detalhes de validação:", data.details); // Útil para debugar os campos exatos
      } else {
        errorMessage.value =
          data.error || data.message || "Erro ao realizar o cadastro.";
      }
    } else {
      errorMessage.value = "Erro de conexão. Tente novamente mais tarde.";
    }
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
        <h2 class="text-2xl font-extrabold tracking-tight text-white">
          Crie sua conta
        </h2>
        <p class="text-sm text-gray-400 mt-1">
          Junte-se ao <span class="font-bold text-indigo-400">LetMeDoIt</span>
        </p>
      </div>

      <div
        v-if="errorMessage"
        class="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 animate-in fade-in slide-in-from-top-2"
      >
        <i class="pi pi-exclamation-circle mt-0.5"></i>
        <p class="text-sm font-medium">{{ errorMessage }}</p>
      </div>

      <form class="space-y-5" @submit.prevent="handleSignup">
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-300 mb-1.5"
            >Seu Nome</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"
            >
              <i class="pi pi-user"></i>
            </div>
            <input
              v-model="name"
              type="text"
              id="name"
              placeholder="Professor João"
              required
              class="block w-full pl-10 pr-3 py-2.5 bg-[#0B0F19]/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-300 mb-1.5"
            >Endereço de E-mail</label
          >
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

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-300 mb-1.5"
            >Sua Senha</label
          >
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
              class="block w-full pl-10 pr-3 py-2.5 bg-[#0B0F19]/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all sm:text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center items-center gap-2 py-3 px-4 mt-2 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111827] focus:ring-indigo-500 disabled:opacity-50 transition-all active:scale-95"
        >
          <i v-if="loading" class="pi pi-spin pi-spinner"></i>
          {{ loading ? "Registrando..." : "Criar Conta" }}
        </button>
      </form>

      <div
        class="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-400"
      >
        Já possui uma conta?
        <RouterLink
          to="/signin"
          class="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Faça login
        </RouterLink>
      </div>
    </div>
  </div>
</template>
