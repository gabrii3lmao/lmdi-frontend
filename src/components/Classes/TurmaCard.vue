<script setup lang="ts">
import { computed } from "vue";

interface Turma {
  _id: string;
  name: string;
}

const props = defineProps<{ turma: Turma }>();
const emit = defineEmits(["delete", "edit"]);

const avatarInitials = computed(() => {
  const name = props.turma.name.trim();
  const words = name.split(" ");
  if (words.length >= 2 && words[0]?.[0] && words[1]?.[0]) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
});

const shortCode = computed(() => {
  return props.turma._id.slice(-5).toUpperCase();
});
</script>

<template>
  <div
    class="group bg-white border border-slate-200/80 ring-1 ring-slate-100 rounded-2xl p-6 hover:ring-emerald-500/30 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
  >
    <div class="flex justify-between items-start mb-4">
      <div
        class="w-20 h-12 bg-emerald-50 text-emerald-600 font-bold text-lg rounded-xl flex items-center gap-3 px-2"
      >
        <i class="pi pi-users text-emerald-500" style="font-size: 1.5rem;"></i>
        {{ avatarInitials }}
      </div>

      <div
        class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <button
          @click="emit('edit', turma)"
          class="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all p-2 rounded-lg"
          title="Editar Turma"
        >
          <i class="pi pi-pencil text-sm"></i>
        </button>

        <button
          @click="emit('delete', turma._id)"
          class="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all p-2 rounded-lg"
          title="Excluir Turma"
        >
          <i class="pi pi-trash text-sm"></i>
        </button>
      </div>
    </div>

    <div class="mb-6">
      <h3
        class="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2"
      >
        {{ turma.name }}
      </h3>
      <p class="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wider">
        REF: #{{ shortCode }}
      </p>
    </div>

    <div>
      <RouterLink :to="`/classes/${turma._id}`" class="block">
        <button
          class="w-full bg-slate-50 border border-slate-200 hover:bg-emerald-600 text-slate-600 hover:text-white text-sm font-semibold py-2.5 px-4 rounded-xl hover:border-transparent transition-all flex justify-center items-center gap-2"
        >
          Acessar Painel <i class="pi pi-arrow-right text-[10px]"></i>
        </button>
      </RouterLink>
    </div>
  </div>
</template>
