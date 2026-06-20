<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import api from "@/services/api";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";

const route = useRoute();
const status = ref<"loading" | "success" | "error">("loading");
const message = ref("");

onMounted(async () => {
  const token = route.params.token;
  if (!token) {
    status.value = "error";
    message.value = "Link de verificação inválido.";
    return;
  }

  try {
    const res = await api.get(`/auth/verify-email/${token}`);
    status.value = "success";
    message.value = res.data.message;
  } catch (error: any) {
    status.value = "error";
    message.value =
      error.response?.data?.message ||
      "Link inválido ou expirado. Solicite um novo link.";
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
    <div class="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 text-center border border-slate-200 dark:border-slate-700">
      <LoadingSpinner v-if="status === 'loading'" message="Verificando seu email..." />

      <div v-else-if="status === 'success'" class="py-8">
        <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-check-circle text-3xl text-emerald-600 dark:text-emerald-400"></i>
        </div>
        <h1 class="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">Email Verificado!</h1>
        <p class="text-slate-500 dark:text-slate-400 mb-6">{{ message }}</p>
        <RouterLink
          to="/signin"
          class="inline-block px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-all shadow-lg"
        >
          Ir para o Login
        </RouterLink>
      </div>

      <div v-else class="py-8">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-exclamation-circle text-3xl text-red-500"></i>
        </div>
        <h1 class="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">Falha na Verificação</h1>
        <p class="text-slate-500 dark:text-slate-400 mb-6">{{ message }}</p>
        <RouterLink
          to="/signin"
          class="inline-block px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-all shadow-lg"
        >
          Voltar para o Login
        </RouterLink>
      </div>
    </div>
  </div>
</template>
