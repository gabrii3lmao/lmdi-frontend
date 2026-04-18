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
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-md"
  >
    <div
      class="bg-[#111827] ring-1 ring-white/10 w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-200"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white">
          {{ turmaInicial ? "Editar" : "Nova" }}
          <span class="text-indigo-400">Turma</span>
        </h2>
        <button
          @click="emit('close')"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white/5 hover:text-white transition-colors"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
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
            class="w-full bg-[#0B0F19] ring-1 ring-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
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
            :disabled="enviando"
            class="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-50 hover:bg-indigo-500 transition-colors flex justify-center items-center gap-2"
          >
            <i v-if="enviando" class="pi pi-spin pi-spinner"></i>
            {{ enviando ? "Salvando..." : "Confirmar" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
