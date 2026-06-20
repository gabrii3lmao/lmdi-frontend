<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import { useToast } from "primevue/usetoast";
import { GoogleLogin } from "vue3-google-login";

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const fieldErrors = ref<Record<string, string>>({});

const router = useRouter();
const toast = useToast();

const callbackGoogle = async (response: any) => {
  errorMessage.value = "";
  loading.value = true;
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
      "Não foi possível realizar o cadastro com o Google. Tente novamente mais tarde.";
  } finally {
    loading.value = false;
  }
};

function validateForm(): boolean {
  fieldErrors.value = {};
  if (!name.value.trim()) {
    fieldErrors.value.name = "Informe seu nome.";
  }
  if (!email.value.trim()) {
    fieldErrors.value.email = "Informe seu e-mail.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    fieldErrors.value.email = "E-mail inválido.";
  }
  if (!password.value) {
    fieldErrors.value.password = "Crie uma senha.";
  } else if (password.value.length < 6) {
    fieldErrors.value.password = "Mínimo de 6 caracteres.";
  }
  if (!confirmPassword.value) {
    fieldErrors.value.confirmPassword = "Confirme sua senha.";
  } else if (password.value !== confirmPassword.value) {
    fieldErrors.value.confirmPassword = "As senhas não coincidem.";
  }
  return Object.keys(fieldErrors.value).length === 0;
}

async function handleSignup() {
  errorMessage.value = "";
  if (!validateForm()) return;

  loading.value = true;

  try {
    const res = await api.post("/auth/signup", {
      name: name.value,
      email: email.value,
      password: password.value,
    });
    successMessage.value = res.data.message || "Conta criada! Verifique seu email antes de fazer login.";
    toast.add({
      severity: "success",
      summary: "Conta criada!",
      detail: successMessage.value,
      life: 6000,
    });
    setTimeout(() => router.push("/signin"), 2000);
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
  <div class="min-h-screen flex w-full font-sans bg-slate-50 dark:bg-slate-900 overflow-hidden">
    <div
      class="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 xl:p-16"
    >
      <img
        src="@/assets/cadastro.webp"
        alt="Sala de aula"
        class="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div
        class="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/80 to-slate-900/90 z-10"
      ></div>

      <div
        class="absolute inset-0 z-[5] opacity-[0.04]"
        style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 24px 24px;"
      ></div>

      <div class="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent z-20"></div>

      <div class="relative z-20 flex items-center gap-4">
        <div
          class="w-32 h-auto xl:w-48 xl:h-auto rounded-2xl flex items-center justify-center p-3"
        >
          <img
            src="@/assets/logo-white.png"
            alt="Logo"
            class="w-full h-auto object-contain"
          />
        </div>

        <span
          class="text-4xl xl:text-5xl font-extrabold text-white leading-none tracking-tight"
        >
          Let Me<span class="text-emerald-400">Do It!</span>
        </span>
      </div>

      <div class="relative z-20 mt-auto max-w-lg">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold mb-6 shadow-sm"
        >
          <i class="pi pi-sparkles text-[10px]"></i>
          <span>Painel Docente</span>
        </div>

        <h1
          class="text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight"
        >
          Automatize a correção das suas provas.
        </h1>

        <p
          class="text-base xl:text-lg text-emerald-100/80 mb-8 max-w-md font-medium"
        >
          Gestão de gabaritos, análise de submissões e acompanhamento em tempo
          real para professores.
        </p>
      </div>
    </div>

    <div
      class="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-16 lg:px-24 xl:px-32 relative shadow-[-8px_0_30px_rgba(0,0,0,0.08)] bg-gradient-to-l from-slate-50 via-slate-50 to-emerald-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20"
    >
      <div
        class="absolute top-0 right-0 w-72 h-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"
      ></div>

      <div class="w-full max-w-sm mx-auto relative z-10">
        <div class="lg:hidden flex flex-col items-center mb-8 gap-4">
          <div
            class="w-22 h-22 rounded-2xl flex items-center justify-center p-3 shadow-sm"
          >
            <img
              src="@/assets/logo1.webp"
              alt="Logo"
              class="w-16 h-22 object-contain"
            />
          </div>
          <h1
            class="text-4xl font-extrabold text-slate-800 dark:text-slate-100 text-center tracking-tight"
          >
            LetMe<span class="text-emerald-600 dark:text-emerald-400">DoIt</span>
          </h1>
        </div>

          <div class="mb-8 text-center sm:text-left">
            <h2
              class="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight"
            >
              Crie sua conta
            </h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Preencha seus dados para começar.
            </p>
          </div>

          <div
            v-if="successMessage"
            class="mb-6 flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
          >
            <i class="pi pi-check-circle mt-0.5 shrink-0 text-emerald-500"></i>
            <p class="text-sm font-medium">{{ successMessage }}</p>
          </div>

          <div
            v-if="errorMessage"
            class="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400"
          >
            <i
              class="pi pi-exclamation-circle mt-0.5 shrink-0 text-red-500"
            ></i>
            <p class="text-sm font-medium">{{ errorMessage }}</p>
          </div>

          <form class="space-y-5" @submit.prevent="handleSignup">
            <div>
              <label
                class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1"
              >
                Nome completo
              </label>
              <input
                v-model="name"
                type="text"
                placeholder="Ex: Prof. Carlos Silva"
                required
                class="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                :class="fieldErrors.name ? 'border-red-300 dark:border-red-700 focus:ring-red-500/20' : ''"
              />
              <p v-if="fieldErrors.name" class="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
                <i class="pi pi-exclamation-circle text-[10px]"></i>
                {{ fieldErrors.name }}
              </p>
            </div>

            <div>
              <label
                class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1"
              >
                E-mail institucional
              </label>
              <input
                v-model="email"
                type="email"
                placeholder="carlos.silva@escola.com"
                required
                class="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                :class="fieldErrors.email ? 'border-red-300 dark:border-red-700 focus:ring-red-500/20' : ''"
              />
              <p v-if="fieldErrors.email" class="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
                <i class="pi pi-exclamation-circle text-[10px]"></i>
                {{ fieldErrors.email }}
              </p>
            </div>

            <div>
              <label
                class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1"
              >
                Senha
              </label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  required
                  class="w-full px-4 py-3 pr-11 bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  :class="fieldErrors.password ? 'border-red-300 dark:border-red-700 focus:ring-red-500/20' : ''"
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

            <div>
              <label
                class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1"
              >
                Confirmar Senha
              </label>
              <div class="relative">
                <input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  required
                  class="w-full px-4 py-3 pr-11 bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  :class="fieldErrors.confirmPassword ? 'border-red-300 dark:border-red-700 focus:ring-red-500/20' : ''"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
                  :aria-label="showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'"
                >
                  <i :class="['pi text-sm', showConfirmPassword ? 'pi-eye-slash' : 'pi-eye']"></i>
                </button>
              </div>
              <p v-if="fieldErrors.confirmPassword" class="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
                <i class="pi pi-exclamation-circle text-[10px]"></i>
                {{ fieldErrors.confirmPassword }}
              </p>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3.5 mt-2 rounded-xl font-bold text-white bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/10 active:scale-[0.98]"
            >
              <span
                v-if="loading"
                class="flex items-center justify-center gap-2"
              >
                <i class="pi pi-spin pi-spinner text-sm"></i> Criando conta...
              </span>
              <span v-else>Criar Conta</span>
            </button>
          </form>

          <div class="relative my-7">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-3 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium">
                Ou
              </span>
            </div>
          </div>

          <div class="flex justify-center w-full transform transition-all hover:scale-[1.02] active:scale-[0.98]">
            <GoogleLogin :callback="callbackGoogle" :button-config="{text: 'signup_with' }" />
          </div>

          <div
            class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400"
          >
            Já possui uma conta?
            <RouterLink
              to="/signin"
              class="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              Entrar
            </RouterLink>
          </div>
      </div>
    </div>
  </div>
</template>
