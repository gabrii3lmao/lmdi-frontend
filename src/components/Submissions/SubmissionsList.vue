<script setup>
import SubmissionCard from "./SubmissionCard.vue";

defineProps({
  examId: String,
  submissoes: Array,
});
</script>

<template>
  <section>
    <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
      <i class="pi pi-users text-emerald-600"></i>
      Alunos Processados
    </h3>

    <div
      v-if="!examId"
      class="bg-white border border-dashed border-slate-400/60 rounded-2xl p-12 text-center text-slate-500 font-semibold shadow-sm"
    >
      Selecione uma prova acima para visualizar o desempenho da turma.
    </div>

    <div
      v-else-if="submissoes.length === 0"
      class="bg-white border border-dashed border-slate-400/60 rounded-2xl p-12 text-center text-slate-500 font-semibold shadow-sm"
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
