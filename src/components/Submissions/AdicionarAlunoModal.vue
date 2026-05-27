<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{ isOpen: boolean; enviando: boolean }>();
const emit = defineEmits(["close", "confirm"]);

const fileInput = ref<HTMLInputElement | null>(null);
const nomeAluno = ref("");
const imagemSelecionada = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

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
  emit("confirm", {
    nome: nomeAluno.value,
    arquivo: imagemSelecionada.value,
  });
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
  >
    <div
      class="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-200"
    >
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-bold text-slate-800">
            Corrigir <span class="text-emerald-600">Gabarito</span>
          </h2>
          <p class="text-xs text-slate-500 mt-1 font-medium">
            Anexe a foto da prova do aluno.
          </p>
        </div>
        <button
          @click="emit('close')"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
            Nome do Aluno (ou Identificador)
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"
            >
              <i class="pi pi-user"></i>
            </div>
            <input
              v-model="nomeAluno"
              type="text"
              placeholder="Ex: João Silva"
              required
              class="block w-full pl-10 pr-3 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
            Foto do Gabarito
          </label>
          <div
            @click="fileInput?.click()"
            class="group relative border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-500/5 rounded-2xl p-4 transition-all cursor-pointer bg-slate-50/50 text-center overflow-hidden"
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
                class="w-12 h-12 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-50 transition-all duration-200"
              >
                <i
                  class="pi pi-camera text-xl text-slate-500 group-hover:text-emerald-600 transition-colors"
                ></i>
              </div>
              <p class="text-sm font-bold text-slate-700">
                Clique para anexar a foto
              </p>
              <p class="text-xs text-slate-400 mt-1 font-medium">
                Apenas arquivos JPG ou PNG
              </p>
            </div>

            <div v-else class="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                :src="previewUrl"
                class="max-h-52 w-full object-contain mx-auto"
                alt="Preview do Gabarito"
              />
              <div
                class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300"
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
            class="flex-1 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="enviando || !imagemSelecionada"
            class="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-50 hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-emerald-600/10"
          >
            <i v-if="enviando" class="pi pi-spin pi-spinner animate-spin"></i>
            {{ enviando ? "Enviando..." : "Iniciar Correção" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
