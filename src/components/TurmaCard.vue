<script setup lang="ts">
import { computed } from "vue";

interface Turma {
  _id: string;
  name: string;
}

const props = defineProps<{ turma: Turma }>();
const emit = defineEmits(["delete", "edit"]);

// Gera uma sigla baseada no nome (Ex: "3º Ano" -> "3A", "Física" -> "FÍ")
const avatarInitials = computed(() => {
  const name = props.turma.name.trim();
  const words = name.split(" ");
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
});

// Pega os últimos 5 caracteres do ID do Mongo para usar como "Código"
const shortCode = computed(() => {
  return props.turma._id.slice(-5).toUpperCase();
});
</script>

<template>
  <div
    class="group bg-[#111827] ring-1 ring-white/5 rounded-2xl p-6 hover:ring-indigo-500/50 hover:bg-white/[0.02] transition-all duration-300 flex flex-col justify-between"
  >
    <div class="flex justify-between items-start mb-4">
      <div
        class="w-20 h-12 bg-indigo-500/10 text-indigo-400 font-bold text-lg rounded-xl flex items-center gap-3 px-2"
      >
        <i class="pi pi-users" style="font-size: 1.5rem;"></i>
        {{ avatarInitials }}
      </div>

      <div
        class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <button
          @click="emit('edit', turma)"
          class="text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all p-2 rounded-lg"
          title="Editar Turma"
        >
          <i class="pi pi-pencil text-sm"></i>
        </button>

        <button
          @click="emit('delete', turma._id)"
          class="text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all p-2 rounded-lg"
          title="Excluir Turma"
        >
          <i class="pi pi-trash text-sm"></i>
        </button>
      </div>
    </div>

    <div class="mb-6">
      <h3
        class="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2"
      >
        {{ turma.name }}
      </h3>
      <p class="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wider">
        REF: #{{ shortCode }}
      </p>
    </div>

    <div>
      <RouterLink :to="`/classes/${turma._id}`" class="block">
        <button
          class="w-full bg-white/5 hover:bg-indigo-600 text-gray-300 hover:text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all flex justify-center items-center gap-2"
        >
          Acessar Painel <i class="pi pi-arrow-right text-[10px]"></i>
        </button>
      </RouterLink>
    </div>
  </div>
</template>
