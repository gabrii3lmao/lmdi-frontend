<script setup lang="ts">
interface Turma {
  _id: string;
  name: string;
}

defineProps<{ turma: Turma }>();
const emit = defineEmits(["delete", "edit"]);
</script>

<template>
  <div
    class="group bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between"
  >
    <div class="flex items-center gap-2">
      <h3
        class="flex-1 text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors truncate"
      >
        {{ turma.name }}
      </h3>

      <div class="flex gap-1">
        <button
          @click="emit('edit', turma)"
          class="text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all p-2 rounded-lg"
          title="Editar Turma"
        >
          <i class="pi pi-pencil text-sm"></i>
        </button>

        <button
          @click="emit('delete', turma._id)"
          class="text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all p-2 rounded-lg"
          title="Excluir Turma"
        >
          <i class="pi pi-trash text-sm"></i>
        </button>
      </div>
    </div>

    <div class="mt-8">
      <RouterLink :to="`/classes/${turma._id}`" class="block">
        <button
          class="w-full bg-gray-700 hover:bg-indigo-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-all"
        >
          Abrir Turma
        </button>
      </RouterLink>
    </div>
  </div>
</template>
