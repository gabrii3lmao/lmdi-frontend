<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{ isOpen: boolean; enviando: boolean }>();
const emit = defineEmits(["close", "confirm"]);

const nomeProva = ref("");
const qtdQuestoes = ref(10);
const qtdAlternativas = ref(5);
const respostas = ref<string[]>([]);

const alternativas = computed(() =>
  Array.from({ length: qtdAlternativas.value }, (_, i) =>
    String.fromCharCode(65 + i),
  ),
);

watch(
  qtdQuestoes,
  (novaQtd) => {
    const diff = novaQtd - respostas.value.length;
    if (diff > 0) respostas.value.push(...Array(diff).fill(""));
    else respostas.value.splice(novaQtd);
  },
  { immediate: true },
);

function handleSubmit() {
  if (respostas.value.some((r) => r === ""))
    return alert("Preencha todas as questões.");
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
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
  >
    <div
      class="bg-gray-900 border border-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl p-6 max-h-[90vh] flex flex-col"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">Gabarito Oficial</h2>
        <button @click="emit('close')" class="text-gray-500 hover:text-white">
          &times;
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] uppercase font-bold text-gray-500"
            >Nome</label
          >
          <input
            v-model="nomeProva"
            class="bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm outline-none focus:border-indigo-500"
            placeholder="Simulado A"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] uppercase font-bold text-gray-500"
            >Questões</label
          >
          <input
            v-model.number="qtdQuestoes"
            type="number"
            class="bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm outline-none"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] uppercase font-bold text-gray-500"
            >Opções</label
          >
          <div class="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button
              v-for="n in [4, 5]"
              :key="n"
              @click="qtdAlternativas = n"
              :class="[
                'flex-1 text-xs py-1 rounded',
                qtdAlternativas === n ? 'bg-indigo-600' : 'text-gray-400',
              ]"
            >
              {{ n }}
            </button>
          </div>
        </div>
      </div>

      <div
        class="flex-1 overflow-y-auto custom-scrollbar pr-2 pt-4 border-t border-gray-800"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="i in qtdQuestoes"
            :key="i"
            class="flex items-center justify-between p-2 rounded-lg bg-gray-800/30 border border-gray-800"
          >
            <span class="text-xs font-mono text-gray-500">{{
              String(i).padStart(2, "0")
            }}</span>
            <div class="flex gap-1">
              <button
                v-for="alt in alternativas"
                :key="alt"
                @click="respostas[i - 1] = alt"
                :class="[
                  'w-7 h-7 rounded text-[10px] font-bold border transition-all',
                  respostas[i - 1] === alt
                    ? 'bg-indigo-600 border-indigo-400'
                    : 'bg-gray-900 border-gray-700 text-gray-500',
                ]"
              >
                {{ alt }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-3 mt-6 pt-6 border-t border-gray-800">
        <button
          @click="emit('close')"
          class="flex-1 py-2 text-sm font-bold text-gray-400"
        >
          Cancelar
        </button>
        <button
          @click="handleSubmit"
          :disabled="enviando"
          class="flex-[2] py-2 bg-indigo-600 rounded-lg font-bold text-sm disabled:opacity-50"
        >
          {{ enviando ? "Salvando..." : "Confirmar Gabarito" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4f46e5;
  border-radius: 10px;
}
</style>
