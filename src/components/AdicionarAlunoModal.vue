<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{ isOpen: boolean; enviando: boolean }>();
const emit = defineEmits(["close", "confirm"]);

const fileInput = ref<HTMLInputElement | null>(null);
const nomeAluno = ref("");
const imagemSelecionada = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

// O SEGREDO ESTÁ AQUI: Limpamos o modal apenas quando ele abre ou fecha,
// e nunca no meio do envio!
watch(
  () => props.isOpen,
  (aberto) => {
    if (aberto) {
      nomeAluno.value = "";
      imagemSelecionada.value = null;
      previewUrl.value = null;
    }
  },
);

function handleFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    imagemSelecionada.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
}

function handleSubmit() {
  if (!nomeAluno.value || !imagemSelecionada.value) {
    alert("Preencha o nome e selecione a imagem do gabarito.");
    return;
  }

  // Apenas emite a ação. Quem decide quando fechar (e limpar) é o componente pai!
  emit("confirm", {
    nome: nomeAluno.value,
    arquivo: imagemSelecionada.value,
  });
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-md"
  >
    <div
      class="bg-[#111827] ring-1 ring-white/10 w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-200"
    >
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-bold text-white">
            Corrigir <span class="text-indigo-400">Gabarito</span>
          </h2>
          <p class="text-xs text-gray-400 mt-1">
            Anexe a foto da prova do aluno.
          </p>
        </div>
        <button
          @click="emit('close')"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white/5 hover:text-white transition-colors"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Nome do Aluno (ou Identificador)
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"
            >
              <i class="pi pi-user"></i>
            </div>
            <input
              v-model="nomeAluno"
              type="text"
              placeholder="Ex: João Silva"
              required
              class="block w-full pl-10 pr-3 py-3 bg-[#0B0F19]/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Foto do Gabarito
          </label>
          <div
            @click="fileInput?.click()"
            class="group relative border-2 border-dashed border-gray-600/50 hover:border-indigo-500 hover:bg-indigo-500/5 rounded-2xl p-4 transition-all cursor-pointer bg-[#0B0F19]/30 text-center overflow-hidden"
          >
            <input
              type="file"
              ref="fileInput"
              class="hidden"
              accept="image/*"
              @change="handleFileChange"
            />

            <div v-if="!previewUrl" class="py-6">
              <div
                class="w-12 h-12 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
              >
                <i
                  class="pi pi-camera text-xl text-gray-400 group-hover:text-indigo-400 transition-colors"
                ></i>
              </div>
              <p class="text-sm font-semibold text-gray-300">
                Clique para anexar a foto
              </p>
              <p class="text-xs text-gray-500 mt-1">
                Apenas arquivos JPG ou PNG
              </p>
            </div>

            <div v-else class="relative rounded-xl overflow-hidden bg-black/20">
              <img
                :src="previewUrl"
                class="max-h-52 w-full object-contain mx-auto"
                alt="Preview do Gabarito"
              />
              <div
                class="absolute inset-0 bg-[#0B0F19]/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300"
              >
                <i class="pi pi-refresh text-white text-2xl mb-2"></i>
                <span class="text-white text-sm font-bold">Trocar imagem</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 px-4 py-3 rounded-xl bg-white/5 text-gray-300 font-semibold hover:bg-white/10 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="enviando || !imagemSelecionada"
            class="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-50 hover:bg-indigo-500 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <i v-if="enviando" class="pi pi-spin pi-spinner"></i>
            {{ enviando ? "Enviando..." : "Iniciar Correção" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
