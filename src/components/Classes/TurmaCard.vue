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
    class="group bg-white border border-slate-200/80 ring-1 ring-slate-100 rounded-2xl p-4 hover:ring-emerald-500/30 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
  >
    <!-- Header -->
    <div class="flex justify-between items-start mb-4">
      <!-- Avatar -->
      <div
        class="h-10 bg-emerald-50 text-emerald-600 font-bold text-base rounded-xl flex items-center gap-2 px-3 group-hover:scale-105 transition-transform"
      >
        <i class="pi pi-users text-emerald-500 text-sm"></i>

        {{ avatarInitials }}
      </div>

      <!-- Actions -->
      <div
        class="flex gap-2 ml-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
      >
        <button
          @click="emit('edit', props.turma)"
          class="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Editar Turma"
        >
          <i class="pi pi-pencil text-sm"></i>
        </button>

        <button
          @click="emit('delete', props.turma._id)"
          class="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Excluir Turma"
        >
          <i class="pi pi-trash text-sm"></i>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="mb-5">
      <h3
        class="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2"
      >
        {{ props.turma.name }}
      </h3>

      <p
        class="text-[11px] text-slate-400 mt-1 font-mono uppercase tracking-wider"
      >
        REF: #{{ shortCode }}
      </p>
    </div>

    <!-- Footer -->
    <RouterLink
      :to="`/classes/${props.turma._id}`"
      class="w-full bg-slate-50 border border-slate-200 hover:bg-emerald-600 text-slate-600 hover:text-white text-sm font-semibold py-2 px-4 rounded-xl hover:border-transparent transition-all flex justify-center items-center gap-2"
    >
      Acessar Turma

      <i
        class="pi pi-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"
      ></i>
    </RouterLink>
  </div>
</template>
