<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{ isOpen: boolean; enviando: boolean }>();
const emit = defineEmits(["close", "confirm"]);

const nomeProva = ref("");
const qtdQuestoes = ref(10);
const qtdAlternativas = ref(5);
const respostas = ref<string[]>([]);

const alternativas = computed(() => {
  return Array.from({ length: qtdAlternativas.value }, (_, i) =>
    String.fromCharCode(65 + i),
  );
});

watch(
  qtdQuestoes,
  (novaQtd) => {
    const diff = novaQtd - respostas.value.length;
    if (diff > 0) {
      respostas.value.push(...Array(diff).fill(""));
    } else {
      respostas.value.splice(novaQtd);
    }
  },
  { immediate: true },
);

function handleSubmit() {
  if (respostas.value.some((r) => r === "")) {
    alert("Por favor, preencha todas as questões do gabarito.");
    return;
  }
  emit("confirm", {
    name: nomeProva.value,
    questionCount: qtdQuestoes.value,
    choicesCount: qtdAlternativas.value,
    answerKey: respostas.value,
  });
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md"
  >
    <div
      class="bg-gray-900 border border-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl p-6 max-h-[90vh] flex flex-col"
    >
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-xl font-semibold text-white">Gabarito Oficial</h2>
          <p class="text-xs text-gray-400 mt-1">
            Configure os detalhes e as respostas da prova
          </p>
        </div>
        <button
          @click="emit('close')"
          class="text-gray-500 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-gray-400 ml-1"
            >Nome da Prova</label
          >
          <input
            v-model="nomeProva"
            type="text"
            placeholder="Ex: Simulado de Março"
            class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-gray-400 ml-1"
            >Total de Questões</label
          >
          <input
            v-model.number="qtdQuestoes"
            type="number"
            class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
          />
        </div>
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-gray-400 ml-1"
            >Alternativas p/ Questão</label
          >
          <div class="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
            <button
              v-for="opt in [4, 5]"
              :key="opt"
              @click="qtdAlternativas = opt"
              :class="[
                'flex-1 py-1.5 text-xs font-bold rounded-lg transition-all',
                qtdAlternativas === opt
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200',
              ]"
            >
              {{ opt }} Opções
            </button>
          </div>
        </div>
      </div>

      <div
        class="flex-1 overflow-y-auto pr-2 custom-scrollbar border-t border-gray-800 pt-6"
      >
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3"
        >
          <div
            v-for="i in qtdQuestoes"
            :key="i"
            class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-800/50 transition-colors group"
          >
            <span
              class="text-xs font-bold text-gray-500 group-hover:text-indigo-400 transition-colors w-6"
            >
              {{ String(i).padStart(2, "0") }}
            </span>

            <div class="flex gap-2">
              <button
                v-for="alt in alternativas"
                :key="alt"
                type="button"
                @click="respostas[i - 1] = alt"
                :class="[
                  'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all border',
                  respostas[i - 1] === alt
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500',
                ]"
              >
                {{ alt }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-4 pt-6 mt-4 border-t border-gray-800">
        <button
          type="button"
          @click="emit('close')"
          class="px-6 py-3 rounded-xl text-gray-400 font-semibold text-sm hover:bg-gray-800 transition-all"
        >
          Descartar
        </button>
        <button
          @click="handleSubmit"
          :disabled="enviando"
          class="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          {{ enviando ? "Processando..." : "Salvar Gabarito" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #4f46e5;
}
</style>
