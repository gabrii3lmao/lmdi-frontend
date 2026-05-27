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
      class="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-200"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-slate-800">
          {{ turmaInicial ? "Editar" : "Nova" }}
          <span class="text-emerald-600">Turma</span>
        </h2>
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
            Nome da Turma
          </label>
          <input
            v-model="nomeTurma"
            type="text"
            placeholder="Ex: 3º Ano A - Matutino"
            required
            autofocus
            class="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          />
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
            :disabled="enviando"
            class="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-50 hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-emerald-600/10"
          >
            <i v-if="enviando" class="pi pi-spin pi-spinner animate-spin"></i>
            {{ enviando ? "Salvando..." : "Confirmar" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
