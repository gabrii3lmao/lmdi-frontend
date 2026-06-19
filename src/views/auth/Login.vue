<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import api from "@/services/api";
import { useRouter } from "vue-router";
import { GoogleLogin } from "vue3-google-login";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");
const fieldErrors = ref<Record<string, string>>({});
const router = useRouter();

const callbackGoogle = async (response: any) => {
  errorMessage.value = "";
  isLoading.value = true;
  try {
    const res = await api.post("/auth/google", {
      credential: response.credential,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.user.name);
    localStorage.setItem("userId", res.data.user.id);

    router.push("/dashboard");
  } catch (error) {
    errorMessage.value =
      "Não foi possível realizar o login com o Google. Tente novamente mais tarde.";
  } finally {
    isLoading.value = false;
  }
};

function validateForm(): boolean {
  fieldErrors.value = {};
  if (!email.value.trim()) {
    fieldErrors.value.email = "Informe seu e-mail.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    fieldErrors.value.email = "E-mail inválido.";
  }
  if (!password.value) {
    fieldErrors.value.password = "Informe sua senha.";
  }
  return Object.keys(fieldErrors.value).length === 0;
}

async function handleLogin() {
  errorMessage.value = "";
  if (!validateForm()) return;

  isLoading.value = true;

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

    router.push("/dashboard");
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
    image: "/app-screenshot-turma.png",
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
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 5000);
};

onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000);
});

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
});
</script>

<template>
  <div class="min-h-screen w-full flex font-sans bg-slate-50 dark:bg-slate-900 overflow-hidden">
    <div
      class="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-16 lg:px-24 xl:px-32 relative z-10 shadow-[4px_0_30px_rgba(0,0,0,0.08)] bg-gradient-to-r from-slate-50 via-slate-50 to-emerald-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20"
    >
      <div
        class="absolute top-0 right-0 w-72 h-72 -translate-y-1/3 translate-x-1/3 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"
      ></div>

      <div class="w-full max-w-sm mx-auto relative z-10">
        <div class="flex items-center gap-3 mb-10">
          <span class="text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Let Me <span class="text-emerald-600 dark:text-emerald-400">Do It!</span>
          </span>
        </div>

        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 tracking-tight">
            Bem-vindo de volta
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            Insira suas credenciais para acessar o seu painel de gestão.
          </p>
        </div>

        <div
          v-if="errorMessage"
          class="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400 transition-all"
        >
          <i class="pi pi-exclamation-circle mt-0.5 shrink-0 text-red-500"></i>
          <p class="text-sm font-medium">{{ errorMessage }}</p>
        </div>

        <form class="space-y-5" @submit.prevent="handleLogin">
          <div>
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              E-mail
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              required
              class="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              :class="fieldErrors.email ? 'border-red-300 dark:border-red-700 focus:ring-red-500/20 focus:border-red-500' : ''"
            />
            <p v-if="fieldErrors.email" class="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
              <i class="pi pi-exclamation-circle text-[10px]"></i>
              {{ fieldErrors.email }}
            </p>
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Senha
              </label>
              <RouterLink
                to="/forgot-password"
                class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                Esqueceu a senha?
              </RouterLink>
            </div>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                class="w-full px-4 py-3 pr-11 bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
                :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
              >
                <i :class="['pi text-sm', showPassword ? 'pi-eye-slash' : 'pi-eye']"></i>
              </button>
            </div>
            <p v-if="fieldErrors.password" class="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
              <i class="pi pi-exclamation-circle text-[10px]"></i>
              {{ fieldErrors.password }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3.5 mt-2 rounded-xl font-bold text-white bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/10 active:scale-[0.98] flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <i v-if="isLoading" class="pi pi-spin pi-spinner text-sm"></i>
            <span>{{ isLoading ? "Entrando..." : "Entrar na conta" }}</span>
          </button>
        </form>

        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-3 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium"
              >Ou</span
            >
          </div>
        </div>

        <div
          class="flex justify-center w-full transform transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <GoogleLogin :callback="callbackGoogle" :button-config="{text: 'continue_with'}"/>
        </div>

        <p class="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Ainda não tem uma conta?
          <RouterLink
            to="/signup"
            class="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            Cadastre-se grátis
          </RouterLink>
        </p>
      </div>
    </div>

    <div
      class="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 lg:p-20 bg-emerald-950"
    >
      <div class="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent z-10"></div>

      <img
        src="/cadastro.jpg"
        alt="Background"
        class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay z-0"
      />
      <div
        class="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/80 to-slate-900/90 z-0"
      ></div>

      <div
        class="absolute inset-0 z-[5] opacity-[0.04]"
        style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 24px 24px;"
      ></div>

      <div class="relative z-10 w-full max-w-2xl flex flex-col items-center self-center my-auto">
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
