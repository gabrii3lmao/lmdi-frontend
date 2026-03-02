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
  if (password.value !== confirmPassword.value) {
    errorMsg.value = "As senhas não coincidem!";
    return;
  }

  try {
    loading.value = true;
    await api.post(`/auth/reset-password/${token}`, {
      password: password.value,
    });
    status.value = "Senha Alterada com sucesso! Você já pode fazer login.";
  } catch (error) {
    errorMsg.value = "Erro ao redefinir senha. O link pode ter expirado.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <!-- Cabeçalho -->
    <div class="text-center">
      <h2 class="mt-10 text-2xl/9 font-bold tracking-tight text-white">
        Redefinir Senha
      </h2>

      <p class="mt-1 text-sm font-medium text-white">
        Informe sua nova senha para concluir o processo
      </p>
    </div>

    <!-- Formulário -->
    <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
      <!-- Mensagens -->
      <div class="space-y-2 text-center">
        <p v-if="status" class="text-green-400 text-sm font-medium">
          {{ status }}
        </p>

        <p v-if="errorMsg" class="text-red-400 text-sm font-medium">
          {{ errorMsg }}
        </p>
      </div>

      <!-- Nova senha -->
      <div>
        <label for="password" class="block text-sm/6 font-medium text-gray-100">
          Nova Senha
        </label>

        <div class="mt-2">
          <input
            v-model="password"
            type="password"
            id="password"
            name="password"
            required
            class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
        </div>
      </div>

      <!-- Confirmar senha -->
      <div>
        <label
          for="confirmPassword"
          class="block text-sm/6 font-medium text-gray-100"
        >
          Confirmar Senha
        </label>

        <div class="mt-2">
          <input
            v-model="confirmPassword"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
        </div>
      </div>

      <!-- Botão -->
      <div>
        <button
          type="submit"
          :disabled="loading"
          class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
        >
          {{ loading ? "Alterando..." : "Redefinir Senha" }}
        </button>
      </div>
    </form>
  </div>
</template>
