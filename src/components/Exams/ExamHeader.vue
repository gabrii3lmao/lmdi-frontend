<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: String,
  classId: String,
  provas: Array,
});

const emit = defineEmits(["update:modelValue"]);

const hasProvas = computed(() => props.provas && props.provas.length > 0);
</script>

<template>
  <header
    class="mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-6"
  >
    <div>
      <h1 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
        Gerenciar <span class="text-emerald-600 dark:text-emerald-400">Provas</span>
      </h1>
      <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Ref. Turma: {{ classId.slice(-5).toUpperCase() }}</p>
    </div>

    <div
      class="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3"
    >
      <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-2 whitespace-nowrap"
        >Prova Ativa:</label
      >
      <div v-if="hasProvas">
        <select
          :value="modelValue"
          @change="emit('update:modelValue', $event.target.value)"
          class="bg-transparent text-sm font-bold outline-none text-emerald-600 dark:text-emerald-400 min-w-[200px] cursor-pointer"
        >
          <option value="" disabled>Selecione uma prova...</option>
          <option v-for="prova in provas" :key="prova._id" :value="prova._id">
            {{ prova.title }}
          </option>
        </select>
      </div>
      <p v-else class="text-sm text-slate-400 dark:text-slate-500 font-medium px-2 whitespace-nowrap">
        Nenhuma prova cadastrada
      </p>
    </div>
  </header>
</template>
