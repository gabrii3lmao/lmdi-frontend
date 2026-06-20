<script setup lang="ts">
import { computed } from "vue";

interface Turma {
  _id: string;
  name: string;
}

const props = defineProps<{ turma: Turma }>();

const emit = defineEmits<{
  (e: "delete", id: string): void;
  (e: "edit", turma: Turma): void;
}>();

const avatarInitials = computed(() => {
  const name = props.turma.name.trim();

  const words = name.split(/\s+/);

  if (words.length >= 2 && words[0] && words[1]) {
    return (words[0][0]! + words[1][0]).toUpperCase();
  }

  return name.substring(0, 2).toUpperCase();
});

const shortCode = computed(() => props.turma._id.slice(-5).toUpperCase());
</script>

<template>
  <div
  class="aspect-[2/1] w-full group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ring-2 ring-slate-100 dark:ring-slate-700 rounded-2xl p-4 hover:ring-emerald-500/30 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
  >
    <!-- Header -->
    <div class="flex justify-between items-start mb-4">
      <!-- Avatar -->
      <div
        class="h-10 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-bold text-base rounded-xl flex items-center gap-2 px-3 group-hover:scale-105 transition-transform"
      >
        <i class="pi pi-users text-emerald-500 dark:text-emerald-400 text-sm"></i>

        {{ avatarInitials }}
      </div>

      <!-- Actions -->
      <div
        class="flex gap-2 ml-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
      >
        <button
          @click="emit('edit', props.turma)"
          class="p-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Editar Turma"
        >
          <i class="pi pi-pencil text-sm"></i>
        </button>

        <button
          @click="emit('delete', props.turma._id)"
          class="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          title="Excluir Turma"
        >
          <i class="pi pi-trash text-sm"></i>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="mb-5">
      <h3
        class="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2"
      >
        {{ props.turma.name }}
      </h3>

      <p
        class="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-mono uppercase tracking-wider"
      >
        REF: #{{ shortCode }}
      </p>
    </div>

    <!-- Footer -->
    <RouterLink
      :to="`/classes/${props.turma._id}`"
      class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-slate-600 dark:text-slate-300 hover:text-white text-sm font-semibold py-2 px-4 rounded-xl hover:border-transparent transition-all flex justify-center items-center gap-2"
    >
      Acessar Turma

      <i
        class="pi pi-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"
      ></i>
    </RouterLink>
  </div>
</template>
