<script setup lang="ts">
import { ref } from "vue";
import api from "@/services/api";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();

async function handleLogin() {
  try {
    const response = await api.post("/auth/signin", {
      email: email.value,
      password: password.value,
    });

    const { token, username } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    router.push("/");
    console.log("Logado com sucesso");
  } catch (error) {
    alert("Falha no login: Verifique suas credenciais.");
  }
}
</script>

<template>
  <div
    class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2
        class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white"
      >
        Entre na sua conta
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form
        class="space-y-6"
        action="#"
        method="POST"
        @submit.prevent="handleLogin"
      >
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-100"
            >Endereço de E-mail</label
          >
          <div class="mt-2">
            <input
              v-model="email"
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              required="true"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm/6 font-medium text-gray-100"
              >Sua Senha</label
            >
            <div class="text-sm">
              <RouterLink
                to="forgot-password"
                class="font-semibold text-indigo-400 hover:text-indigo-300"
                >Esqueceu da senha?</RouterLink
              >
            </div>
          </div>
          <div class="mt-2">
            <input
              v-model="password"
              type="password"
              name="password"
              id="password"
              autocomplete="current-password"
              required="true"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Entrar
          </button>
        </div>
      </form>
      <p class="mt-10 text-center text-sm/6 text-gray-400">
        Não tem uma conta?
        <RouterLink
          to="/signup"
          class="font-semibold text-indigo-400 hover:text-indigo-300"
          >Registre-se!</RouterLink
        >
      </p>
    </div>
  </div>
</template>
