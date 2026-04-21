<script setup lang="ts">
import { computed } from "vue";

// Adicionamos a tipagem completa do Template para facilitar o envio no evento de edição
interface TemplateType {
  _id: string;
  title: string;
  questionsCount: number;
  choicesCount: number;
  classId: string;
  // adicione answerKey aqui se ele vier da API ao listar, ou precisará buscar os detalhes na edição
}

const props = defineProps<{
  template: TemplateType;
  turmaName: string;
}>();

// Definindo os eventos que este componente vai emitir para o pai
const emit = defineEmits<{
  (e: "edit", template: TemplateType): void;
  (e: "delete", id: string): void;
}>();

const idRef = computed(() => props.template._id.slice(-5));
const alternativasLetra = computed(() =>
  String.fromCharCode(64 + props.template.choicesCount),
);
</script>

<template>
  <div
    class="group bg-[#111827] ring-1 ring-white/5 p-6 rounded-2xl hover:ring-indigo-500/50 hover:bg-white/[0.02] transition-all duration-300 flex flex-col justify-between"
  >
    <div class="flex justify-between items-start mb-6">
      <div class="flex gap-3 items-center">
        <div
          class="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
        >
          <i class="pi pi-file-check text-xl"></i>
        </div>

        <div
          class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <button
            @click="emit('edit', template)"
            class="p-2 text-gray-500 hover:text-indigo-400 transition-colors rounded-lg hover:bg-white/5"
            title="Editar Gabarito"
          >
            <i class="pi pi-pencil text-sm"></i>
          </button>
          <button
            @click="emit('delete', template._id)"
            class="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
            title="Deletar Gabarito"
          >
            <i class="pi pi-trash text-sm"></i>
          </button>
        </div>
      </div>

      <div
        class="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg max-w-[150px]"
      >
        <p
          class="text-xs font-semibold text-gray-300 truncate"
          :title="turmaName"
        >
          {{ turmaName }}
        </p>
      </div>
    </div>

    <div class="mb-6">
      <h3
        class="text-lg font-bold text-white line-clamp-2 group-hover:text-indigo-400 transition-colors"
      >
        {{ template.title }}
      </h3>
      <p class="text-xs text-gray-500 mt-2 font-mono uppercase tracking-wider">
        REF: #{{ idRef }}
      </p>
    </div>

    <div class="flex gap-3">
      <div
        class="flex-1 bg-[#0B0F19] ring-1 ring-white/5 px-3 py-2.5 rounded-xl flex flex-col items-center justify-center"
      >
        <span class="text-indigo-400 font-bold text-lg leading-none mb-1">{{
          template.questionsCount
        }}</span>
        <span
          class="text-[10px] text-gray-500 uppercase font-bold tracking-wider"
          >Questões</span
        >
      </div>
      <div
        class="flex-1 bg-[#0B0F19] ring-1 ring-white/5 px-3 py-2.5 rounded-xl flex flex-col items-center justify-center"
      >
        <span class="text-indigo-400 font-bold text-lg leading-none mb-1"
          >A-{{ alternativasLetra }}</span
        >
        <span
          class="text-[10px] text-gray-500 uppercase font-bold tracking-wider"
          >Alternativas</span
        >
      </div>
    </div>
  </div>
</template>
