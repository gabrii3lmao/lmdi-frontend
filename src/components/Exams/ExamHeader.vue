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
    class="mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-slate-200 pb-6"
  >
    <div>
      <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">
        Gerenciar <span class="text-emerald-600">Provas</span>
      </h1>
      <p class="text-slate-500 text-sm mt-1">Ref. Turma: {{ classId.slice(-5).toUpperCase() }}</p>
    </div>

    <div
      class="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3"
    >
      <label class="text-[10px] font-bold text-slate-500 uppercase ml-2"
        >Prova Ativa:</label
      >
      <select
        :value="modelValue"
        @change="emit('update:modelValue', $event.target.value)"
        class="bg-transparent text-sm font-bold outline-none text-emerald-600 min-w-[200px] cursor-pointer"
      >
        <option value="" disabled>Selecione uma prova...</option>
        <option v-for="prova in provas" :key="prova._id" :value="prova._id">
          {{ prova.title }}
        </option>
      </select>
    </div>
  </header>
</template>
