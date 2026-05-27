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
    class="bg-white border p-5 rounded-2xl flex flex-col justify-between hover:border-emerald-500/30 hover:shadow-lg transition-all shadow-sm relative overflow-hidden"
    :class="
      submissao.status === 'pending'
        ? 'border-amber-300 shadow-amber-500/5'
        : 'border-slate-400/60 shadow-slate-100'
    "
  >
    <!-- Animação de pulso se estiver pendente -->
    <div
      v-if="submissao.status === 'pending'"
      class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent animate-pulse"
    ></div>

    <div class="flex justify-between items-start mb-4">
      <div>
        <h4 class="font-bold text-slate-800 truncate max-w-[150px]">
          {{ submissao.studentName }}
        </h4>
        <span
          :class="[
            'text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1 inline-flex mt-1',
            submissao.status === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : submissao.status === 'pending'
                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                : 'bg-red-50 text-red-700 border border-red-100',
          ]"
        >
          <i
            v-if="submissao.status === 'pending'"
            class="pi pi-spin pi-spinner text-[10px]"
          ></i>
          <i
            v-else-if="submissao.status === 'success'"
            class="pi pi-check text-[10px]"
          ></i>
          <i v-else class="pi pi-times text-[10px]"></i>

          {{
            submissao.status === "success"
              ? "Corrigido"
              : submissao.status === "pending"
                ? "Processando..."
                : "Erro na Leitura"
          }}
        </span>
      </div>

      <div class="text-right">
        <p class="text-[10px] text-slate-400 uppercase font-bold">Nota</p>
        <p
          v-if="submissao.status === 'pending'"
          class="text-2xl font-black text-slate-400"
        >
          -.-
        </p>
        <p
          v-else
          class="text-2xl font-black"
          :class="
            submissao.status === 'success' ? 'text-emerald-600' : 'text-red-500'
          "
        >
          {{
            submissao.score !== undefined ? submissao.score.toFixed(1) : "0.0"
          }}
        </p>
      </div>
    </div>

    <div
      class="pt-4 border-t flex justify-between items-center text-[11px] text-slate-400 border-slate-100"
    >
      <span v-if="submissao.status === 'pending'" class="italic font-medium">
        Aguardando IA...
      </span>
      <span v-else class="font-medium text-slate-500">
        Acertos: <b class="text-slate-800 font-extrabold">{{ submissao.totalCorrect ?? 0 }}</b>
      </span>

      <span class="font-mono text-slate-400">
        ID: {{ submissao._id.slice(-4).toUpperCase() }}
      </span>
    </div>
  </div>
</template>
