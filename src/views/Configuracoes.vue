<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useThemeStore } from "@/stores/theme"
import { useToast } from "primevue/usetoast"

const themeStore = useThemeStore()
const toast = useToast()

const name = ref("")
const email = ref("")
const editingName = ref(false)
const editingEmail = ref(false)

const currentPassword = ref("")
const newPassword = ref("")
const confirmNewPassword = ref("")
const changingPassword = ref(false)

function loadUser() {
  const savedName = localStorage.getItem("username") ?? ""
  const firstName = savedName.split(" ")[0] || ""
  if (firstName) {
    name.value = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
  }
  email.value = localStorage.getItem("userEmail") || "nao-informado@email.com"
}

function saveName() {
  editingName.value = false
  toast.add({ severity: "success", summary: "Salvo", detail: "Nome atualizado.", life: 3000 })
}

function saveEmail() {
  editingEmail.value = false
  toast.add({ severity: "success", summary: "Salvo", detail: "E-mail atualizado.", life: 3000 })
}

function handleChangePassword() {
  if (!currentPassword.value || !newPassword.value || !confirmNewPassword.value) {
    toast.add({ severity: "warn", summary: "Atenção", detail: "Preencha todos os campos.", life: 3000 })
    return
  }
  if (newPassword.value.length < 6) {
    toast.add({ severity: "warn", summary: "Atenção", detail: "A nova senha deve ter no mínimo 6 caracteres.", life: 3000 })
    return
  }
  if (newPassword.value !== confirmNewPassword.value) {
    toast.add({ severity: "warn", summary: "Atenção", detail: "As senhas não coincidem.", life: 3000 })
    return
  }
  changingPassword.value = true
  // Simula sucesso — integração com API futura
  setTimeout(() => {
    changingPassword.value = false
    currentPassword.value = ""
    newPassword.value = ""
    confirmNewPassword.value = ""
    toast.add({ severity: "success", summary: "Sucesso", detail: "Senha alterada com sucesso!", life: 3000 })
  }, 1000)
}

onMounted(loadUser)
</script>

<template>
  <div
    class="sm:ml-64 min-h-screen bg-slate-50 text-slate-700 p-6 md:p-10 font-sans dark:bg-slate-900 dark:text-slate-300"
  >
    <div class="max-w-3xl mx-auto space-y-8">
      <header>
        <h1 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          <i class="pi pi-cog text-emerald-500 mr-2"></i>
          Configurações
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Gerencie suas preferências e informações da conta.
        </p>
      </header>

      <!-- Perfil -->
      <section class="bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 rounded-2xl p-6 md:p-8 space-y-6">
        <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i class="pi pi-user text-emerald-500"></i>
          Informações do Usuário
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Nome</label>
            <div class="flex items-center gap-2">
              <input
                v-model="name"
                :disabled="!editingName"
                class="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all"
                :class="editingName ? 'focus:ring-2 focus:ring-emerald-500 border-emerald-300' : 'cursor-default'"
              />
              <button
                v-if="!editingName"
                @click="editingName = true"
                class="p-2.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                title="Editar nome"
              >
                <i class="pi pi-pencil text-sm"></i>
              </button>
              <button
                v-else
                @click="saveName"
                class="p-2.5 text-emerald-600 hover:text-emerald-700 transition-colors"
                title="Salvar nome"
              >
                <i class="pi pi-check text-sm"></i>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">E-mail</label>
            <div class="flex items-center gap-2">
              <input
                v-model="email"
                :disabled="!editingEmail"
                class="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all"
                :class="editingEmail ? 'focus:ring-2 focus:ring-emerald-500 border-emerald-300' : 'cursor-default'"
              />
              <button
                v-if="!editingEmail"
                @click="editingEmail = true"
                class="p-2.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                title="Editar e-mail"
              >
                <i class="pi pi-pencil text-sm"></i>
              </button>
              <button
                v-else
                @click="saveEmail"
                class="p-2.5 text-emerald-600 hover:text-emerald-700 transition-colors"
                title="Salvar e-mail"
              >
                <i class="pi pi-check text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Segurança -->
      <section class="bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 rounded-2xl p-6 md:p-8 space-y-6">
        <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i class="pi pi-shield text-emerald-500"></i>
          Segurança
        </h2>

        <p class="text-sm text-slate-500 dark:text-slate-400">Altere sua senha de acesso ao painel.</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Senha Atual</label>
            <input
              v-model="currentPassword"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Nova Senha</label>
            <input
              v-model="newPassword"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Confirmar</label>
            <input
              v-model="confirmNewPassword"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        <button
          @click="handleChangePassword"
          :disabled="changingPassword"
          class="px-6 py-2.5 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-emerald-600/10 active:scale-95 text-sm"
        >
          <span v-if="changingPassword" class="flex items-center gap-2">
            <i class="pi pi-spin pi-spinner"></i> Alterando...
          </span>
          <span v-else>Alterar Senha</span>
        </button>
      </section>

      <!-- Aparência -->
      <section class="bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 rounded-2xl p-6 md:p-8 space-y-6">
        <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i class="pi pi-palette text-emerald-500"></i>
          Aparência
        </h2>

        <p class="text-sm text-slate-500 dark:text-slate-400">Escolha o tema de exibição do painel.</p>

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
