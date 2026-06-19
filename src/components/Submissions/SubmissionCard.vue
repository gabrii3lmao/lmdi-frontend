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
    class="bg-white dark:bg-slate-800 border p-5 rounded-2xl flex flex-col justify-between hover:border-emerald-500/30 hover:shadow-lg transition-all shadow-sm relative overflow-hidden"
    :class="
      submissao.status === 'pending'
        ? 'border-amber-300 dark:border-amber-700 shadow-amber-500/5'
        : 'border-slate-200 dark:border-slate-700 shadow-slate-100'
    "
  >
    <!-- Animação de pulso se estiver pendente -->
    <div
      v-if="submissao.status === 'pending'"
      class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent animate-pulse"
    ></div>

    <div class="flex justify-between items-start mb-4">
      <div>
        <h4 class="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[150px]">
          {{ submissao.studentName }}
        </h4>
        <span
          :class="[
            'text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1 inline-flex mt-1',
            submissao.status === 'graded'
              ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800'
              : submissao.status === 'pending'
                ? 'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800'
                : 'bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800',
          ]"
        >
          <i
            v-if="submissao.status === 'pending'"
            class="pi pi-spin pi-spinner text-[10px]"
          ></i>
          <i
            v-else-if="submissao.status === 'graded'"
            class="pi pi-check text-[10px]"
          ></i>
          <i v-else class="pi pi-times text-[10px]"></i>

          {{
            submissao.status === "graded"
              ? "Corrigido"
              : submissao.status === "pending"
                ? "Processando..."
                : "Erro na Leitura"
          }}
        </span>
      </div>

      <div class="text-right">
        <p class="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Nota</p>
        <p
          v-if="submissao.status === 'pending'"
          class="text-2xl font-black text-slate-400 dark:text-slate-500"
        >
          -.-
        </p>
        <p
          v-else
          class="text-2xl font-black"
          :class="
            submissao.status === 'graded' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
          "
        >
          {{
            submissao.score !== undefined ? submissao.score.toFixed(1) : "0.0"
          }}
        </p>
      </div>
    </div>

    <div
      class="pt-4 border-t flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700"
    >
      <span v-if="submissao.status === 'pending'" class="italic font-medium">
        Aguardando IA...
      </span>
      <span v-else class="font-medium text-slate-500 dark:text-slate-400">
        Acertos: <b class="text-slate-800 dark:text-slate-100 font-extrabold">{{ submissao.totalCorrect ?? 0 }}</b>
      </span>

      <span class="font-mono text-slate-400 dark:text-slate-500">
        ID: {{ submissao._id.slice(-4).toUpperCase() }}
      </span>
    </div>
  </div>
</template>
