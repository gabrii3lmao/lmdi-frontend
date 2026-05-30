// Login.vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import api from "@/services/api";
import { useRouter } from "vue-router";
import { GoogleLogin } from "vue3-google-login";

// Lógica de Autenticação
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const router = useRouter();

const callbackGoogle = async (response: any) => {
  errorMessage.value = "";
  isLoading.value = true;
  try {
    const res = await api.post("/auth/google", {
      credential: response.credential,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", JSON.stringify(res.data.user.name));
    localStorage.setItem("userId", JSON.stringify(res.data.user.id));


    router.push("/");
  } catch (error) {
    errorMessage.value =
      "Não foi possível realizar o login com o Google. Tente novamente mais tarde.";
  } finally {
    isLoading.value = false;
  }
};

async function handleLogin() {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await api.post("/auth/signin", {
      email: email.value,
      password: password.value,
    });
    const token = response.data.token;
    const { id, name } = response.data.user;

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

// Lógica do Carrossel
const currentSlide = ref(0);
let slideInterval: ReturnType<typeof setInterval>;

const slides = [
  {
    title: "Gerencie suas turmas de forma simples e eficiente.",
    description:
      "Crie, edite e organize suas turmas com facilidade, tudo em um painel intuitivo e responsivo.",
    image: "/app-screenshot-dashboard.png",
  },
  {
    title: "Revolução na gestão de gabaritos.",
    description:
      "Tudo o que você precisa para gerenciar suas turmas e notas em um único lugar.",
    image: "/app-screenshot-turma.png", // Substitua pelas suas imagens
  },
  {
    title: "Correção automatizada e rápida.",
    description:
      "Poupe horas de trabalho corrigindo centenas de provas em poucos segundos.",
    image: "/app-screenshot-provas.png",
  },
  {
    title: "Análise de desempenho avançada.",
    description:
      "Acompanhe de perto as métricas e o progresso de cada aluno da sua turma.",
    image: "/app-screenshot-alunos.png",
  },
];

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const setSlide = (index: number) => {
  currentSlide.value = index;
  // Reseta o timer ao clicar manualmente para não pular rápido demais
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 5000);
};

onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000); // Muda a imagem a cada 5 segundos
});

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
});
</script>

<template>
  <div class="min-h-screen w-full flex font-sans bg-white overflow-hidden">
    <div
      class="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-16 lg:px-24 xl:px-32 relative z-10"
    >
      <div class="w-full max-w-sm mx-auto">
        <div class="flex items-center gap-3 mb-10">
          <span class="text-5xl font-extrabold text-slate-900 tracking-tight">
            Let Me <span class="text-emerald-600">Do It!</span>
          </span>
        </div>

        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Bem-vindo de volta
          </h1>
          <p class="text-slate-500 text-sm">
            Insira suas credenciais para acessar o seu painel de gestão.
          </p>
        </div>

        <div
          v-if="errorMessage"
          class="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50/50 border border-red-100 text-red-700 transition-all"
        >
          <i class="pi pi-exclamation-circle mt-0.5 shrink-0 text-red-500"></i>
          <p class="text-sm font-medium">{{ errorMessage }}</p>
        </div>

        <form class="space-y-5" @submit.prevent="handleLogin">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">
              E-mail
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              required
              class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm"
            />
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-slate-700">
                Senha
              </label>
              <RouterLink
                to="/forgot-password"
                class="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Esqueceu a senha?
              </RouterLink>
            </div>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2.5 mt-2 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <i v-if="isLoading" class="pi pi-spin pi-spinner text-sm"></i>
            <span>{{ isLoading ? "Entrando..." : "Entrar na conta" }}</span>
          </button>
        </form>

        <p class="text-slate-500 text-sm my-4">Ou</p>

        <GoogleLogin :callback="callbackGoogle" />

        <p class="mt-8 text-center text-sm text-slate-500">
          Ainda não tem uma conta?
          <RouterLink
            to="/signup"
            class="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Cadastre-se grátis
          </RouterLink>
        </p>
      </div>
    </div>

    <div
      class="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 lg:p-20 overflow-hidden bg-emerald-950"
    >
      <img
        src="/cadastro.jpg"
        alt="Background"
        class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay z-0"
      />
      <div
        class="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/80 to-slate-900/90 z-0"
      ></div>

      <div class="relative z-10 w-full max-w-2xl flex flex-col items-center">
        <div
          class="h-32 flex flex-col items-center justify-end mb-6 text-center"
        >
          <h2
            class="text-3xl font-bold text-white mb-3 leading-tight transition-opacity duration-500"
          >
            {{ slides[currentSlide]!.title }}
          </h2>
          <p
            class="text-emerald-100/80 text-lg max-w-lg transition-opacity duration-500"
          >
            {{ slides[currentSlide]!.description }}
          </p>
        </div>

        <div
          class="w-full rounded-2xl bg-white/10 p-2 backdrop-blur-md border border-white/20 shadow-2xl relative"
        >
          <div
            class="relative w-full aspect-video overflow-hidden rounded-xl bg-slate-800 border border-white/10"
          >
            <template v-for="(slide, index) in slides" :key="index">
              <img
                :src="slide.image"
                :alt="slide.title"
                class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                :class="
                  currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                "
              />
            </template>
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <button
            v-for="(_, index) in slides"
            :key="index"
            @click="setSlide(index)"
            class="transition-all duration-500 rounded-full"
            :class="
              currentSlide === index
                ? 'w-8 h-2.5 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
            "
            aria-label="Ir para o slide"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>
