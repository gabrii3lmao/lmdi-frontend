<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useThemeStore } from "@/stores/theme"
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import api from "@/services/api"
import axios from "axios"
import LoadingSpinner from "@/components/common/LoadingSpinner.vue"
import Avatar from "primevue/avatar"
import { disconnectSocket } from "@/services/socket"
import { clearTerms } from "@/services/terms"

const themeStore = useThemeStore()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()

const name = ref("")
const email = ref("")
const avatarUrl = ref("")
const editingName = ref(false)
const savingProfile = ref(false)

const carregandoPerfil = ref(true)
const currentPassword = ref("")
const newPassword = ref("")
const confirmNewPassword = ref("")
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmNewPassword = ref(false)
const changingPassword = ref(false)
const passwordErrors = ref<{ current?: string; next?: string; confirm?: string }>({})

const uploadingAvatar = ref(false)

const isVerified = ref(false)
const createdAt = ref<string | null>(null)
const acceptedTermsAt = ref<string | null>(null)
const acceptedTermsVersion = ref<string | null>(null)

interface UploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}

function formatDate(value: string | null): string {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

const formattedMemberSince = computed(() => formatDate(createdAt.value))
const formattedTermsAcceptedAt = computed(() => formatDate(acceptedTermsAt.value))

const passwordStrength = computed(() => {
  const p = newPassword.value
  if (!p) {
    return { label: "", width: "0%", barClass: "", textClass: "" }
  }

  let score = 0
  if (p.length >= 6) score++
  if (p.length >= 10) score++
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++
  if (/\d/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++

  if (score <= 2) {
    return { label: "Fraca", width: "33%", barClass: "bg-red-500", textClass: "text-red-500" }
  }
  if (score <= 3) {
    return { label: "Média", width: "66%", barClass: "bg-amber-500", textClass: "text-amber-500" }
  }
  return { label: "Forte", width: "100%", barClass: "bg-indigo-500", textClass: "text-indigo-500" }
})

async function handleAvatarUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploadingAvatar.value = true
  try {
    const { data: signature } = await api.get<UploadSignature>("/submissions/upload-signature")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("api_key", signature.apiKey)
    formData.append("timestamp", String(signature.timestamp))
    formData.append("signature", signature.signature)
    formData.append("folder", signature.folder)

    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
      formData,
    )
    const url = uploadRes.data.secure_url as string

    await api.patch("/auth/avatar", { avatarUrl: url })

    avatarUrl.value = url
    localStorage.setItem("userPhoto", url)

    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Foto de perfil atualizada!",
      life: 3000,
    })
  } catch {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Não foi possível enviar a foto. Tente novamente.",
      life: 4000,
    })
  } finally {
    uploadingAvatar.value = false
    input.value = ""
  }
}

async function handleRemoveAvatar() {
  avatarUrl.value = ""
  localStorage.removeItem("userPhoto")
  try {
    await api.patch("/auth/avatar", { avatarUrl: "" })
    toast.add({
      severity: "info",
      summary: "Removida",
      detail: "Foto de perfil removida.",
      life: 3000,
    })
  } catch {
    // silent
  }
}

async function loadUser() {
  carregandoPerfil.value = true
  try {
    const { data } = await api.get("/auth/me")
    name.value = data.name
    email.value = data.email
    avatarUrl.value = data.avatarUrl || ""
    isVerified.value = !!data.isVerified
    createdAt.value = data.createdAt || null
    acceptedTermsAt.value = data.acceptedTermsAt || null
    acceptedTermsVersion.value = data.acceptedTermsVersion || null
    localStorage.setItem("userPhoto", avatarUrl.value)
  } catch {
    name.value = localStorage.getItem("username") ?? ""
    email.value = ""
    avatarUrl.value = localStorage.getItem("userPhoto") ?? ""
  } finally {
    carregandoPerfil.value = false
  }
}

async function saveProfile() {
  if (!name.value.trim()) {
    toast.add({ severity: "warn", summary: "Atenção", detail: "O nome não pode ficar vazio.", life: 3000 })
    return
  }

  savingProfile.value = true
  try {
    const { data } = await api.patch("/auth/profile", { name: name.value.trim() })
    name.value = data.name
    localStorage.setItem("username", data.name)
    editingName.value = false

    toast.add({
      severity: "success",
      summary: "Salvo",
      detail: "Nome atualizado com sucesso!",
      life: 3000,
    })
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: error.response?.data?.message || "Não foi possível salvar.",
      life: 4000,
    })
  } finally {
    savingProfile.value = false
  }
}

function validatePasswordForm(): boolean {
  passwordErrors.value = {}

  if (!currentPassword.value) {
    passwordErrors.value.current = "Informe sua senha atual."
  }
  if (!newPassword.value) {
    passwordErrors.value.next = "Informe a nova senha."
  } else if (newPassword.value.length < 6) {
    passwordErrors.value.next = "A nova senha deve ter no mínimo 6 caracteres."
  }
  if (!confirmNewPassword.value) {
    passwordErrors.value.confirm = "Confirme a nova senha."
  } else if (newPassword.value !== confirmNewPassword.value) {
    passwordErrors.value.confirm = "As senhas não coincidem."
  }

  return Object.keys(passwordErrors.value).length === 0
}

function clearAuthStorage() {
  disconnectSocket()
  localStorage.removeItem("token")
  localStorage.removeItem("username")
  localStorage.removeItem("userId")
  localStorage.removeItem("userPhoto")
  localStorage.removeItem("supportPromptDismissed")
  clearTerms()
}

async function handleChangePassword() {
  if (!validatePasswordForm()) return

  changingPassword.value = true
  try {
    await api.patch("/auth/password", {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    })

    currentPassword.value = ""
    newPassword.value = ""
    confirmNewPassword.value = ""
    passwordErrors.value = {}

    toast.add({
      severity: "success",
      summary: "Senha alterada",
      detail: "Por segurança, entre novamente com a nova senha.",
      life: 4000,
    })

    clearAuthStorage()
    setTimeout(() => router.push("/signin"), 1200)
  } catch (error: any) {
    const message = error.response?.data?.message || "Não foi possível alterar a senha."
    if (error.response?.status === 401) {
      passwordErrors.value.current = message
    } else {
      toast.add({ severity: "error", summary: "Erro", detail: message, life: 4000 })
    }
  } finally {
    changingPassword.value = false
  }
}

function handleDeleteAccount() {
  confirm.require({
    message: "Tem certeza que deseja deletar sua conta? Esta ação é irreversível e todos os seus dados serão perdidos.",
    header: "Deletar Conta",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "Sim, Deletar",
    rejectLabel: "Cancelar",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await api.delete("/auth/delete-account")
        clearAuthStorage()
        router.push("/signin")
        toast.add({
          severity: "success",
          summary: "Conta deletada",
          detail: "Sua conta foi removida com sucesso.",
          life: 3000,
        })
      } catch {
        toast.add({
          severity: "error",
          summary: "Erro",
          detail: "Não foi possível deletar sua conta. Tente novamente.",
          life: 3000,
        })
      }
    },
  })
}

onMounted(loadUser)
</script>

<template>
  <div
    class="min-h-screen bg-school-50 text-school-700 p-6 md:p-10 font-sans dark:bg-lousa-900 dark:text-lousa-300"
  >
    <div class="max-w-3xl mx-auto space-y-8">
      <header>
        <h1 class="text-3xl font-extrabold text-school-800 dark:text-lousa-100 tracking-tight">
          <i class="pi pi-cog text-indigo-500 mr-2"></i>
          Configurações
        </h1>
        <p class="text-school-500 dark:text-lousa-400 text-sm mt-1">
          Gerencie suas preferências e informações da conta.
        </p>
      </header>

      <LoadingSpinner v-if="carregandoPerfil" message="Carregando perfil..." />

      <template v-else>
        <!-- Perfil -->
        <section class="bg-white dark:bg-lousa-800 ring-1 ring-school-200 dark:ring-lousa-700 rounded-2xl p-6 md:p-8">
          <h2 class="text-lg font-bold text-school-800 dark:text-lousa-100 flex items-center gap-2 mb-6">
            <i class="pi pi-user text-indigo-500"></i>
            Perfil
          </h2>

          <div class="flex flex-col md:flex-row gap-8">
            <div class="flex flex-col items-center gap-3 shrink-0">
              <Avatar
                :image="avatarUrl || undefined"
                :label="avatarUrl ? '' : (name.charAt(0).toUpperCase() || 'P')"
                shape="circle"
                class="!bg-indigo-100 dark:!bg-indigo-900/40 !text-indigo-600 dark:!text-indigo-400 !border !border-borda-200 dark:!border-borda-700 !font-bold !text-3xl"
                style="width: 6rem; height: 6rem"
              />

              <label
                class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/10 active:scale-95 text-xs"
              >
                <i class="pi pi-upload text-xs"></i>
                <span>{{ uploadingAvatar ? "Enviando..." : "Escolher foto" }}</span>
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  :disabled="uploadingAvatar"
                  @change="handleAvatarUpload"
                />
              </label>

              <button
                v-if="avatarUrl"
                @click="handleRemoveAvatar"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
              >
                <i class="pi pi-trash text-[10px]"></i>
                Remover
              </button>
            </div>

            <div class="flex-1 space-y-5">
              <div>
                <label
                  for="profile-name"
                  class="block text-xs font-bold text-school-500 dark:text-lousa-400 uppercase tracking-wider mb-1.5"
                >
                  Nome
                </label>
                <div class="flex items-center gap-2 max-w-sm">
                  <input
                    id="profile-name"
                    v-model="name"
                    :disabled="!editingName"
                    autocomplete="name"
                    class="flex-1 px-4 py-2.5 bg-school-50 dark:bg-lousa-700/50 border border-school-200 dark:border-lousa-600 rounded-xl text-school-900 dark:text-lousa-100 placeholder-school-400 outline-none transition-all text-sm"
                    :class="editingName ? 'focus:ring-2 focus:ring-indigo-500 border-borda-300' : 'cursor-default opacity-80'"
                  />
                  <button
                    v-if="!editingName"
                    @click="editingName = true"
                    class="p-2.5 text-school-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    title="Editar nome"
                    aria-label="Editar nome"
                  >
                    <i class="pi pi-pencil text-sm"></i>
                  </button>
                </div>
              </div>

              <div>
                <label
                  for="profile-email"
                  class="block text-xs font-bold text-school-500 dark:text-lousa-400 uppercase tracking-wider mb-1.5"
                >
                  E-mail
                </label>
                <input
                  id="profile-email"
                  :value="email"
                  disabled
                  class="w-full max-w-sm px-4 py-2.5 bg-school-50 dark:bg-lousa-700/50 border border-school-200 dark:border-lousa-600 rounded-xl text-school-500 dark:text-lousa-400 outline-none text-sm cursor-not-allowed"
                />
              </div>

              <div v-if="editingName" class="flex items-center gap-3 pt-2">
                <button
                  @click="saveProfile"
                  :disabled="savingProfile"
                  class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/10 active:scale-95 text-sm"
                >
                  <i v-if="savingProfile" class="pi pi-spin pi-spinner text-xs"></i>
                  <span>{{ savingProfile ? "Salvando..." : "Salvar Alterações" }}</span>
                </button>

                <button
                  @click="editingName = false"
                  class="px-4 py-2.5 text-sm font-medium text-school-500 dark:text-lousa-400 hover:bg-school-100 dark:hover:bg-lousa-700 rounded-xl transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Segurança -->
        <section class="bg-white dark:bg-lousa-800 ring-1 ring-school-200 dark:ring-lousa-700 rounded-2xl p-6 md:p-8">
          <h2 class="text-lg font-bold text-school-800 dark:text-lousa-100 flex items-center gap-2 mb-2">
            <i class="pi pi-shield text-indigo-500"></i>
            Segurança
          </h2>
          <p class="text-sm text-school-500 dark:text-lousa-400 mb-6">
            Altere sua senha de acesso ao painel.
          </p>

          <div class="space-y-5 max-w-sm">
            <div>
              <label
                for="current-password"
                class="block text-xs font-bold text-school-500 dark:text-lousa-400 uppercase tracking-wider mb-1.5"
              >
                Senha Atual
              </label>
              <div class="relative">
                <input
                  id="current-password"
                  v-model="currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="Digite sua senha atual"
                  class="w-full px-4 py-2.5 pr-11 bg-school-50 dark:bg-lousa-700/50 border rounded-xl text-school-900 dark:text-lousa-100 placeholder-school-400 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  :class="passwordErrors.current ? 'border-red-300 dark:border-red-700' : 'border-school-200 dark:border-lousa-600'"
                />
                <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-school-400 hover:text-school-600 dark:hover:text-lousa-300 transition-colors p-1"
                  :aria-label="showCurrentPassword ? 'Ocultar senha' : 'Mostrar senha'"
                >
                  <i :class="['pi text-sm', showCurrentPassword ? 'pi-eye-slash' : 'pi-eye']"></i>
                </button>
              </div>
              <p v-if="passwordErrors.current" class="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
                <i class="pi pi-exclamation-circle text-[10px]"></i>
                {{ passwordErrors.current }}
              </p>
            </div>

            <div>
              <label
                for="new-password"
                class="block text-xs font-bold text-school-500 dark:text-lousa-400 uppercase tracking-wider mb-1.5"
              >
                Nova Senha
              </label>
              <div class="relative">
                <input
                  id="new-password"
                  v-model="newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="Mínimo de 6 caracteres"
                  class="w-full px-4 py-2.5 pr-11 bg-school-50 dark:bg-lousa-700/50 border rounded-xl text-school-900 dark:text-lousa-100 placeholder-school-400 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  :class="passwordErrors.next ? 'border-red-300 dark:border-red-700' : 'border-school-200 dark:border-lousa-600'"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-school-400 hover:text-school-600 dark:hover:text-lousa-300 transition-colors p-1"
                  :aria-label="showNewPassword ? 'Ocultar senha' : 'Mostrar senha'"
                >
                  <i :class="['pi text-sm', showNewPassword ? 'pi-eye-slash' : 'pi-eye']"></i>
                </button>
              </div>
              <div v-if="newPassword" class="mt-2">
                <div class="h-1 w-full rounded-full bg-school-200 dark:bg-lousa-700 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    :class="passwordStrength.barClass"
                    :style="{ width: passwordStrength.width }"
                  ></div>
                </div>
                <p class="mt-1 text-xs font-medium" :class="passwordStrength.textClass">
                  Força da senha: {{ passwordStrength.label }}
                </p>
              </div>
              <p v-if="passwordErrors.next" class="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
                <i class="pi pi-exclamation-circle text-[10px]"></i>
                {{ passwordErrors.next }}
              </p>
            </div>

            <div>
              <label
                for="confirm-password"
                class="block text-xs font-bold text-school-500 dark:text-lousa-400 uppercase tracking-wider mb-1.5"
              >
                Confirmar Nova Senha
              </label>
              <div class="relative">
                <input
                  id="confirm-password"
                  v-model="confirmNewPassword"
                  :type="showConfirmNewPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="Repita a nova senha"
                  class="w-full px-4 py-2.5 pr-11 bg-school-50 dark:bg-lousa-700/50 border rounded-xl text-school-900 dark:text-lousa-100 placeholder-school-400 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  :class="passwordErrors.confirm ? 'border-red-300 dark:border-red-700' : 'border-school-200 dark:border-lousa-600'"
                />
                <button
                  type="button"
                  @click="showConfirmNewPassword = !showConfirmNewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-school-400 hover:text-school-600 dark:hover:text-lousa-300 transition-colors p-1"
                  :aria-label="showConfirmNewPassword ? 'Ocultar senha' : 'Mostrar senha'"
                >
                  <i :class="['pi text-sm', showConfirmNewPassword ? 'pi-eye-slash' : 'pi-eye']"></i>
                </button>
              </div>
              <p v-if="passwordErrors.confirm" class="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
                <i class="pi pi-exclamation-circle text-[10px]"></i>
                {{ passwordErrors.confirm }}
              </p>
            </div>

            <button
              @click="handleChangePassword"
              :disabled="changingPassword"
              class="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/10 active:scale-95 text-sm"
            >
              <i v-if="changingPassword" class="pi pi-spin pi-spinner text-xs"></i>
              <span>{{ changingPassword ? "Alterando..." : "Alterar Senha" }}</span>
            </button>
          </div>
        </section>

        <!-- Conta -->
        <section class="bg-white dark:bg-lousa-800 ring-1 ring-school-200 dark:ring-lousa-700 rounded-2xl p-6 md:p-8">
          <h2 class="text-lg font-bold text-school-800 dark:text-lousa-100 flex items-center gap-2 mb-6">
            <i class="pi pi-id-card text-indigo-500"></i>
            Conta
          </h2>

          <dl class="space-y-4 text-sm">
            <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between max-w-xl">
              <dt class="text-school-500 dark:text-lousa-400">E-mail</dt>
              <dd class="flex items-center gap-2 font-medium text-school-800 dark:text-lousa-100">
                <span class="truncate">{{ email || "—" }}</span>
                <span
                  class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  :class="isVerified
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'"
                >
                  <i :class="['pi text-[10px]', isVerified ? 'pi-check-circle' : 'pi-exclamation-circle']"></i>
                  {{ isVerified ? "Verificado" : "Não verificado" }}
                </span>
              </dd>
            </div>

            <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between max-w-xl">
              <dt class="text-school-500 dark:text-lousa-400">Membro desde</dt>
              <dd class="font-medium text-school-800 dark:text-lousa-100">
                {{ formattedMemberSince || "—" }}
              </dd>
            </div>

            <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between max-w-xl">
              <dt class="text-school-500 dark:text-lousa-400">Termos de Uso</dt>
              <dd class="font-medium text-school-800 dark:text-lousa-100">
                <template v-if="acceptedTermsAt">
                  Aceitos em {{ formattedTermsAcceptedAt }}
                  <span v-if="acceptedTermsVersion" class="text-school-400 dark:text-lousa-500">
                    · versão {{ acceptedTermsVersion }}
                  </span>
                </template>
                <span v-else class="text-amber-600 dark:text-amber-400">Aceite pendente</span>
              </dd>
            </div>
          </dl>

          <RouterLink
            to="/termos"
            class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Ver Termos de Uso
            <i class="pi pi-external-link text-xs"></i>
          </RouterLink>
        </section>

        <!-- Aparência -->
        <section class="bg-white dark:bg-lousa-800 ring-1 ring-school-200 dark:ring-lousa-700 rounded-2xl p-6 md:p-8">
          <h2 class="text-lg font-bold text-school-800 dark:text-lousa-100 flex items-center gap-2 mb-6">
            <i class="pi pi-palette text-indigo-500"></i>
            Aparência
          </h2>

          <div class="flex flex-wrap items-center gap-4">
            <button
              @click="themeStore.setTheme('light')"
              :class="[
                'flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all font-medium text-sm',
                themeStore.theme === 'light'
                  ? 'border-borda-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'border-school-200 dark:border-lousa-600 bg-white dark:bg-lousa-700 text-school-600 dark:text-lousa-400 hover:border-school-300 dark:hover:border-lousa-500'
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
                  ? 'border-borda-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'border-school-200 dark:border-lousa-600 bg-white dark:bg-lousa-700 text-school-600 dark:text-lousa-400 hover:border-school-300 dark:hover:border-lousa-500'
              ]"
            >
              <i class="pi pi-moon text-lg"></i>
              <span>Escuro</span>
            </button>

            <button
              @click="themeStore.setTheme('system')"
              :class="[
                'flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all font-medium text-sm',
                themeStore.theme === 'system'
                  ? 'border-borda-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'border-school-200 dark:border-lousa-600 bg-white dark:bg-lousa-700 text-school-600 dark:text-lousa-400 hover:border-school-300 dark:hover:border-lousa-500'
              ]"
            >
              <i class="pi pi-desktop text-lg"></i>
              <span>Sistema</span>
            </button>
          </div>
          <p class="mt-3 text-xs text-school-400 dark:text-lousa-500">
            A opção "Sistema" acompanha a preferência do seu dispositivo.
          </p>
        </section>

        <!-- Zona de Perigo -->
        <section class="bg-white dark:bg-lousa-800 ring-1 ring-red-200 dark:ring-red-900/50 rounded-2xl p-6 md:p-8 border border-red-100 dark:border-red-900/30">
          <h2 class="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-3">
            <i class="pi pi-exclamation-triangle text-red-500"></i>
            Zona de Perigo
          </h2>

          <p class="text-sm text-school-500 dark:text-lousa-400 mb-5">
            Ao deletar sua conta, todos os seus dados serão removidos permanentemente. Esta ação não pode ser desfeita.
          </p>

          <button
            @click="handleDeleteAccount"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:border-red-300 dark:hover:border-red-700 transition-all font-medium text-sm"
          >
            <i class="pi pi-trash"></i>
            <span>Deletar minha conta</span>
          </button>
        </section>
      </template>
    </div>
  </div>
</template>
