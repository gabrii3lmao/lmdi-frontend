<script setup lang="ts">
import router from "@/router";
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
  } catch (error: any) {
    errorMsg.value =
      error.response?.data?.error || "Erro ao processar solicitação.";
  } finally {
    loading.value = false;
    router.push("/")
  }
}
</script>

<template>
  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <!-- Cabeçalho -->
    <div class="text-center">
      <h2 class="mt-10 text-2xl/9 font-bold tracking-tight text-white">
        Envie o seu E-mail
      </h2>

      <p class="mt-1 text-sm text-white font-medium">
        Enviaremos um link contendo o serviço de recuperação de senha
      </p>
    </div>

    <!-- Formulário -->
    <form class="mt-8 space-y-6" @submit.prevent="handleForgotPassword">
      <!-- Mensagens -->
      <div class="space-y-2 text-center">
        <p v-if="message" class="text-green-400 text-sm font-medium">
          {{ message }}
        </p>

        <p v-if="errorMsg" class="text-red-400 text-sm font-medium">
          {{ errorMsg }}
        </p>
      </div>

      <!-- Campo de e-mail -->
      <div>
        <label for="email" class="block text-sm/6 font-medium text-gray-100">
          Seu Endereço de E-mail
        </label>

        <div class="mt-2">
          <input
            v-model="email"
            type="email"
            id="email"
            name="email"
            autocomplete="email"
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
          {{ loading ? "Enviando..." : "Enviar E-mail" }}
        </button>
      </div>
    </form>
  </div>
</template>
    