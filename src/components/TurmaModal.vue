<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  isOpen: boolean;
  enviando: boolean;
  turmaInicial?: { name: string } | null; 
}>();

const emit = defineEmits(["close", "confirm"]);
const nomeTurma = ref("");

watch(
  () => props.isOpen,
  (aberto) => {
    if (aberto) {
      nomeTurma.value = props.turmaInicial ? props.turmaInicial.name : "";
    }
  },
);

function handleSubmit() {
  if (!nomeTurma.value.trim()) return;
  emit("confirm", nomeTurma.value);
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
  >
    <div
      class="bg-gray-800 border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white">
          {{ turmaInicial ? "Editar" : "Criar" }}
          <span class="text-indigo-400">Turma</span>
        </h2>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-white text-2xl"
        >
          &times;
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">
            Nome da Turma
          </label>
          <input
            v-model="nomeTurma"
            type="text"
            placeholder="Ex: 3º Ano A - Matutino"
            required
            autofocus
            class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div class="flex gap-3 mt-8">
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 px-4 py-3 rounded-xl bg-gray-700 font-bold hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="enviando"
            class="flex-1 px-4 py-3 rounded-xl bg-indigo-600 font-bold disabled:opacity-50 hover:bg-indigo-500 transition-colors"
          >
            {{ enviando ? "Salvando..." : "Confirmar" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
