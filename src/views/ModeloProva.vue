<script setup lang="ts">
import { ref } from "vue";

interface Template {
  _id: string;
  title: string;
  questions: number;
  choices: number;
  createdAt: string;
}

const templates = ref<Template[]>([
  {
    _id: "1",
    title: "Gabarito Padrão 20 Questões",
    questions: 20,
    choices: 5,
    createdAt: "15/10/2023",
  },
  {
    _id: "2",
    title: "Simulado Final - 40 Q",
    questions: 40,
    choices: 4,
    createdAt: "20/10/2023",
  },
]);

const isModalOpen = ref(false);
const newTemplate = ref({ title: "", questions: 10, choices: 5 });

const openModal = () => (isModalOpen.value = true);
const closeModal = () => (isModalOpen.value = false);

const handleSaveTemplate = () => {
  // Aqui você chamaria sua API para enviar a imagem do gabarito oficial
  console.log("Salvando template:", newTemplate.value);
  closeModal();
};
</script>

<template>
  <div class="sm:ml-64 min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-5xl mx-auto">
      <header class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-bold text-white font-sans">
            Modelos de <span class="text-indigo-400">Prova</span>
          </h1>
          <p class="text-gray-400 mt-1">
            Configure os gabaritos oficiais para correção automática.
          </p>
        </div>
        <button
          @click="openModal"
          class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <i class="pi pi-plus"></i>
          Novo Modelo
        </button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="temp in templates"
          :key="temp._id"
          class="bg-gray-800 border border-gray-700 p-6 rounded-2xl hover:border-indigo-500/50 transition-all group"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="bg-indigo-500/10 p-3 rounded-xl">
              <i class="pi pi-file-edit text-indigo-400 text-xl"></i>
            </div>
            <div class="flex gap-2">
              <button class="text-gray-500 hover:text-white transition-colors">
                <i class="pi pi-eye"></i>
              </button>
              <button
                class="text-gray-500 hover:text-red-400 transition-colors"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>

          <h3 class="text-lg font-bold mb-1">{{ temp.title }}</h3>
          <p class="text-gray-400 text-sm mb-4">
            Criado em {{ temp.createdAt }}
          </p>

          <div class="flex gap-4">
            <div
              class="bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-700 text-xs"
            >
              <span class="text-indigo-400 font-bold">{{
                temp.questions
              }}</span>
              Questões
            </div>
            <div
              class="bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-700 text-xs"
            >
              <span class="text-indigo-400 font-bold">{{ temp.choices }}</span>
              Alternativas
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      >
        <div
          class="bg-gray-800 border border-gray-700 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300"
        >
          <h2 class="text-2xl font-bold mb-6 text-indigo-400">
            Novo Gabarito Modelo
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1"
                >Título do Modelo</label
              >
              <input
                v-model="newTemplate.title"
                type="text"
                placeholder="Ex: Simulado Mensal - Setembro"
                class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1"
                  >Questões</label
                >
                <input
                  v-model="newTemplate.questions"
                  type="number"
                  class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1"
                  >Alternativas</label
                >
                <input
                  v-model="newTemplate.choices"
                  type="number"
                  class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 outline-none"
                />
              </div>
            </div>

            <div
              class="border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center hover:border-indigo-500/50 transition-colors cursor-pointer group"
            >
              <i
                class="pi pi-cloud-upload text-3xl text-gray-500 group-hover:text-indigo-400 mb-2"
              ></i>
              <p class="text-sm text-gray-400">
                Suba a imagem do <b class="text-gray-200">Gabarito Oficial</b>
              </p>
              <p class="text-xs text-gray-600 mt-1">Formatos: JPG, PNG</p>
            </div>
          </div>

          <div class="flex gap-3 mt-8">
            <button
              @click="closeModal"
              class="flex-1 px-4 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-700 transition-all"
            >
              Cancelar
            </button>
            <button
              @click="handleSaveTemplate"
              class="flex-1 bg-indigo-600 hover:bg-indigo-500 px-4 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/40"
            >
              Criar Modelo
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
