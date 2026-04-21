// Cadastro.vue
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

const router = useRouter();

async function handleSignup() {
  loading.value = true;
  errorMessage.value = "";

  try {
    await api.post("/auth/signup", {
      name: name.value,
      email: email.value,
      password: password.value,
    });
    router.push("/signin");
  } catch (error: any) {
    if (error.response?.data) {
      const data = error.response.data;

      if (data.details) {
        errorMessage.value = data.error || "Verifique os dados preenchidos.";
      } else {
        errorMessage.value = data.error || data.message || "Erro ao cadastrar.";
      }
    } else {
      errorMessage.value = "Erro de conexão.";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="min-h-screen flex w-full font-sans bg-[#0B0F19] overflow-x-hidden"
  >
    <!-- LADO ESQUERDO -->
    <div
      class="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 xl:p-16"
    >
      <!-- Background -->
      <img
        src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop"
        alt="Sala de aula"
        class="absolute inset-0 w-full h-full object-cover z-0"
      />

      <!-- Overlay mais leve -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-[#0B0F19]/80 via-[#0B0F19]/60 to-indigo-900/30 z-10"
      ></div>

      <!-- Logo + Nome -->
      <div class="relative z-20 flex items-center gap-5">
        <div
          class="w-24 h-24 xl:w-28 xl:h-28 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center p-4 shadow-[0_0_60px_rgba(99,102,241,0.4)]"
        >
          <img
            src="../../../public/logo.png"
            alt="Logo"
            class="w-full h-full object-contain"
          />
        </div>

        <span
          class="text-5xl xl:text-6xl font-extrabold text-white leading-none"
        >
          Let Me<span class="text-indigo-400">Do It!</span>
        </span>
      </div>

      <!-- Conteúdo -->
      <div class="relative z-20 mt-auto max-w-lg">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-100 text-sm mb-6 opacity-70"
        >
          <i class="pi pi-sparkles text-xs"></i>
          <span>Painel Docente</span>
        </div>

        <h1
          class="text-5xl xl:text-6xl font-extrabold text-white mb-6 leading-tight"
        >
          Automatize a correção das suas provas.
        </h1>

        <p class="text-base xl:text-lg text-gray-100 mb-8 max-w-md">
          Gestão de gabaritos, análise de submissões e acompanhamento em tempo
          real.
        </p>
      </div>
    </div>

    <!-- LADO DIREITO -->
    <div
      class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative"
    >
      <!-- círculo decorativo corrigido -->
      <div
        class="absolute top-0 right-0 w-72 h-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"
      ></div>

      <div class="w-full max-w-md relative z-10">
        <!-- Mobile Logo -->
        <div class="lg:hidden flex flex-col items-center mb-8 gap-4">
          <div
            class="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center p-3 shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          >
            <img
              src="../../../public/logo.png"
              alt="Logo"
              class="w-full h-full object-contain"
            />
          </div>

          <h1 class="text-2xl font-bold text-white text-center">
            LetMe<span class="text-indigo-400">DoIt</span>
          </h1>
        </div>

        <!-- Título -->
        <div class="mb-8 text-center lg:text-left">
          <h2 class="text-3xl font-extrabold text-white">Crie sua conta</h2>
          <p class="text-gray-400 mt-2">Preencha seus dados.</p>
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
        <form class="space-y-5" @submit.prevent="handleSignup">
          <input
            v-model="name"
            type="text"
            placeholder="Seu nome"
            required
            class="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />

          <input
            v-model="email"
            type="email"
            placeholder="email@exemplo.com"
            required
            class="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />

          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
          >
            {{ loading ? "Registrando..." : "Criar Conta" }}
          </button>
        </form>

        <!-- Footer -->
        <div
          class="mt-10 pt-6 border-t border-white/5 text-center text-sm text-gray-400"
        >
          Já possui uma conta?
          <RouterLink
            to="/signin"
            class="text-indigo-400 hover:text-indigo-300"
          >
            Entrar
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
