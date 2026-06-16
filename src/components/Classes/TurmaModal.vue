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
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
  >
    <div
      class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-200"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">
          {{ turmaInicial ? "Editar" : "Nova" }}
          <span class="text-emerald-600 dark:text-emerald-400">Turma</span>
        </h2>
        <button
          @click="emit('close')"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
            Nome da Turma
          </label>
          <input
            v-model="nomeTurma"
            type="text"
            placeholder="Ex: 3º Ano A - Matutino"
            required
            autofocus
            class="w-full bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="enviando"
            class="flex-1 px-4 py-3 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white font-semibold disabled:opacity-50 hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-emerald-600/10"
          >
            <i v-if="enviando" class="pi pi-spin pi-spinner animate-spin"></i>
            {{ enviando ? "Salvando..." : "Confirmar" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
