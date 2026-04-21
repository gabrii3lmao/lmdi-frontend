<script setup>
defineProps({
  modelValue: String, // O ID da prova selecionada
  classId: String,
  provas: Array,
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <header
    class="mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-gray-800 pb-6"
  >
    <div>
      <h1 class="text-3xl font-bold italic">
        GERENCIAR <span class="text-indigo-400">PROVAS</span>
      </h1>
      <p class="text-gray-400 text-sm">Turma ID: {{ classId }}</p>
    </div>

    <div
      class="bg-gray-800 p-2 rounded-xl border border-gray-700 flex items-center gap-3"
    >
      <label class="text-[10px] font-bold text-gray-500 uppercase ml-2"
        >Prova Ativa:</label
      >
      <select
        :value="modelValue"
        @change="emit('update:modelValue', $event.target.value)"
        class="bg-transparent text-sm font-semibold outline-none text-indigo-400 min-w-[200px] cursor-pointer"
      >
        <option value="" disabled>Selecione uma prova...</option>
        <option v-for="prova in provas" :key="prova._id" :value="prova._id">
          {{ prova.title }}
        </option>
      </select>
    </div>
  </header>
</template>
