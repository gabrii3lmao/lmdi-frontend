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
    class="bg-gray-800 border p-5 rounded-2xl flex flex-col justify-between hover:border-gray-500 transition-all shadow-md relative overflow-hidden"
    :class="
      submissao.status === 'pending'
        ? 'border-yellow-500/30'
        : 'border-gray-700'
    "
  >
    <!-- Animação de pulso se estiver pendente -->
    <div
      v-if="submissao.status === 'pending'"
      class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent animate-pulse"
    ></div>

    <div class="flex justify-between items-start mb-4">
      <div>
        <h4 class="font-bold text-white truncate max-w-[150px]">
          {{ submissao.studentName }}
        </h4>
        <span
          :class="[
            'text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1 inline-flex mt-1',
            submissao.status === 'success'
              ? 'bg-emerald-500/10 text-emerald-400'
              : submissao.status === 'pending'
                ? 'bg-yellow-500/10 text-yellow-400'
                : 'bg-red-500/10 text-red-400',
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
        <p class="text-[10px] text-gray-500 uppercase font-bold">Nota</p>
        <p
          v-if="submissao.status === 'pending'"
          class="text-2xl font-black text-gray-500"
        >
          -.-
        </p>
        <p
          v-else
          class="text-2xl font-black"
          :class="
            submissao.status === 'success' ? 'text-indigo-400' : 'text-red-400'
          "
        >
          {{
            submissao.score !== undefined ? submissao.score.toFixed(1) : "0.0"
          }}
        </p>
      </div>
    </div>

    <div
      class="pt-4 border-t flex justify-between items-center text-[11px] text-gray-400"
      :class="
        submissao.status === 'pending'
          ? 'border-yellow-500/10'
          : 'border-gray-700'
      "
    >
      <span v-if="submissao.status === 'pending'" class="italic">
        Aguardando IA...
      </span>
      <span v-else>
        Acertos: <b class="text-white">{{ submissao.totalCorrect ?? 0 }}</b>
      </span>

      <span class="font-mono">
        ID: {{ submissao._id.slice(-4).toUpperCase() }}
      </span>
    </div>
  </div>
</template>
