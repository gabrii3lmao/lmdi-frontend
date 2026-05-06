<script setup>
import SubmissionCard from "./SubmissionCard.vue";

defineProps({
  examId: String,
  submissoes: Array,
});
</script>

<template>
  <section>
    <h3 class="text-lg font-semibold mb-6 flex items-center gap-2">
      <i class="pi pi-users text-indigo-400"></i>
      Alunos Processados
    </h3>

    <div
      v-if="!examId"
      class="bg-gray-800/50 border border-dashed border-gray-700 rounded-2xl p-12 text-center text-gray-500 italic"
    >
      Selecione uma prova acima para visualizar o desempenho da turma.
    </div>

    <div
      v-else-if="submissoes.length === 0"
      class="bg-gray-800/50 border border-dashed border-gray-700 rounded-2xl p-12 text-center text-gray-500"
    >
      Nenhuma submissão encontrada para esta prova.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Usando o componente isolado de Card -->
      <SubmissionCard
        v-for="sub in submissoes"
        :key="sub._id"
        :submissao="sub"
      />
    </div>
  </section>
</template>
