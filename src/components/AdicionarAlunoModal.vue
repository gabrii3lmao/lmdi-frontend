<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ isOpen: boolean; enviando: boolean }>();
const emit = defineEmits(["close", "confirm"]);

const nomeAluno = ref("");
const imagemSelecionada = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

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

  // Limpar campos
  nomeAluno.value = "";
  imagemSelecionada.value = null;
  previewUrl.value = null;
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
  >
    <div
      class="bg-gray-800 border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl p-6"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white">
          Corrigir <span class="text-indigo-400">Gabarito Aluno</span>
        </h2>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-white text-2xl"
        >
          &times;
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-2"
            >Nome do Aluno</label
          >
          <input
            v-model="nomeAluno"
            type="text"
            placeholder="Ex: João Silva"
            required
            class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-2"
            >Foto do Gabarito</label
          >
          <div
            @click="$refs.fileInput.click()"
            class="group relative border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-2xl p-4 transition-all cursor-pointer bg-gray-900/30 text-center"
          >
            <input
              type="file"
              ref="fileInput"
              class="hidden"
              accept="image/*"
              @change="handleFileChange"
            />

            <div v-if="!previewUrl" class="py-4">
              <i
                class="pi pi-camera text-3xl text-gray-600 group-hover:text-indigo-400 mb-2"
              ></i>
              <p class="text-sm text-gray-500">
                Clique para selecionar ou tirar foto
              </p>
            </div>

            <div v-else class="relative">
              <img
                :src="previewUrl"
                class="max-h-48 mx-auto rounded-lg shadow-lg"
              />
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg"
              >
                <span class="text-white text-xs font-bold">Trocar foto</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 px-4 py-3 rounded-xl bg-gray-700 font-bold hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="enviando"
            class="flex-1 px-4 py-3 rounded-xl bg-indigo-600 font-bold hover:bg-indigo-500 disabled:opacity-50"
          >
            {{ enviando ? "Processando..." : "Iniciar Correção" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
