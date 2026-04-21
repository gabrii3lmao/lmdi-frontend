<script setup>
defineProps({
  submissao: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div
    class="bg-gray-800 border border-gray-700 p-5 rounded-2xl flex flex-col justify-between hover:border-gray-500 transition-all shadow-md"
  >
    <div class="flex justify-between items-start mb-4">
      <div>
        <h4 class="font-bold text-white truncate max-w-[150px]">
          {{ submissao.studentName }}
        </h4>
        <span
          :class="[
            'text-[10px] font-bold uppercase px-2 py-0.5 rounded',
            submissao.status === 'success'
              ? 'bg-emerald-500/10 text-emerald-500'
              : 'bg-red-500/10 text-red-500',
          ]"
        >
          {{ submissao.status === "success" ? "Corrigido" : "Erro" }}
        </span>
      </div>
      <div class="text-right">
        <p class="text-[10px] text-gray-500 uppercase font-bold">Nota</p>
        <p class="text-2xl font-black text-indigo-400">
          {{
            submissao.score !== undefined ? submissao.score.toFixed(1) : "0.0"
          }}
        </p>
      </div>
    </div>
    <div
      class="pt-4 border-t border-gray-700 flex justify-between items-center text-[11px] text-gray-400"
    >
      <span
        >Acertos:
        <b class="text-white">{{ submissao.totalCorrect ?? 0 }}</b></span
      >
      <span class="font-mono"
        >ID: {{ submissao._id.slice(-4).toUpperCase() }}</span
      >
    </div>
  </div>
</template>
