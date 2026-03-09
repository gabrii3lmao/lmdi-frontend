<script setup>
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
      <div
        v-for="sub in submissoes"
        :key="sub._id"
        class="bg-gray-800 border border-gray-700 p-5 rounded-2xl flex flex-col justify-between hover:border-gray-500 transition-all shadow-md"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h4 class="font-bold text-white truncate max-w-[150px]">
              {{ sub.studentName }}
            </h4>
            <span
              :class="[
                'text-[10px] font-bold uppercase px-2 py-0.5 rounded',
                sub.status === 'success'
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-red-500/10 text-red-500',
              ]"
            >
              {{ sub.status === "success" ? "Corrigido" : "Erro" }}
            </span>
          </div>
          <div class="text-right">
            <p class="text-[10px] text-gray-500 uppercase font-bold">Nota</p>
            <p class="text-2xl font-black text-indigo-400">
              {{ sub.score !== undefined ? sub.score.toFixed(1) : "0.0" }}
            </p>
          </div>
        </div>

        <div
          class="pt-4 border-t border-gray-700 flex justify-between items-center text-[11px] text-gray-400"
        >
          <span
            >Acertos:
            <b class="text-white">{{ sub.totalCorrect ?? 0 }}</b></span
          >
          <span class="font-mono"
            >ID: {{ sub._id.slice(-4).toUpperCase() }}</span
          >
        </div>
      </div>
    </div>
  </section>
</template>
