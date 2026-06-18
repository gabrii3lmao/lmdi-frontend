<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useThemeStore } from "@/stores/theme"

const themeStore = useThemeStore()

const name = ref("")
const email = ref("")

function loadUser() {
  const savedName = localStorage.getItem("username") ?? ""
  const firstName = savedName.split(" ")[0] || ""
  if (firstName) {
    name.value = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
  }
  email.value = localStorage.getItem("userEmail") || "nao-informado@email.com"
}

onMounted(loadUser)
</script>

<template>
  <div
    class="sm:ml-64 min-h-screen bg-slate-50 text-slate-700 p-6 md:p-10 font-sans dark:bg-slate-900 dark:text-slate-300"
  >
    <div class="max-w-3xl 2xl:max-w-4xl mx-auto space-y-8">
      <header>
        <h1
          class="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight"
        >
          Configurações
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Gerencie suas preferências e informações da conta.
        </p>
      </header>

      <section
        class="bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 rounded-2xl p-6 md:p-8 space-y-6"
      >
        <h2
          class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"
        >
          <i class="pi pi-user text-emerald-500"></i>
          Informações do Usuário
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Nome
            </label>
            <input
              :value="name"
              disabled
              class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all cursor-not-allowed"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5"
            >
              E-mail
            </label>
            <input
              :value="email"
              disabled
              class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all cursor-not-allowed"
            />
          </div>
        </div>
      </section>

      <section
        class="bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 rounded-2xl p-6 md:p-8 space-y-6"
      >
        <h2
          class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"
        >
          <i class="pi pi-palette text-emerald-500"></i>
          Aparência
        </h2>

        <p class="text-sm text-slate-500 dark:text-slate-400">
          Escolha o tema de exibição do painel.
        </p>

        <div class="flex items-center gap-4">
          <button
            @click="themeStore.setTheme('light')"
            :class="[
              'flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all font-medium text-sm',
              themeStore.theme === 'light'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 shadow-sm'
                : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
            ]"
          >
            <i class="pi pi-sun text-lg"></i>
            <span>Claro</span>
          </button>

          <button
            @click="themeStore.setTheme('dark')"
            :class="[
              'flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all font-medium text-sm',
              themeStore.theme === 'dark'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 shadow-sm'
                : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
            ]"
          >
            <i class="pi pi-moon text-lg"></i>
            <span>Escuro</span>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
