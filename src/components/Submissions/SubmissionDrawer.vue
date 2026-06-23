<script setup lang="ts">
defineProps<{
  submission: any;
  exam: any;
  open: boolean;
}>();

defineEmits(["close"]);
</script>

<template>
  <div v-if="open && submission" class="fixed inset-0 z-50 overflow-hidden">
    <div
      class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      @click="$emit('close')"
    ></div>

    <div
      class="absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl flex flex-col border-l border-slate-400/60 dark:border-slate-700 animate-in slide-in-from-right duration-300"
    >
      <div
        class="p-6 border-b border-slate-400/60 dark:border-slate-700 flex justify-between items-center"
      >
        <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">
          {{ submission.studentName }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div class="p-6 flex-1 overflow-y-auto">
        <div
          class="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-xl mb-6 flex items-center justify-between shadow-sm"
        >
          <span
            class="text-emerald-700 dark:text-emerald-300 font-bold uppercase text-xs tracking-wider"
            >Nota Final:</span
          >
          <span class="text-2xl font-extrabold text-emerald-800 dark:text-emerald-200">
            {{ submission.score ?? "-" }}
          </span>
        </div>

        <div v-if="submission.imageUrl" class="mb-6">
          <h3
            class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1"
          >
            Imagem Original
          </h3>
          <a
            :href="submission.imageUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="block rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 border border-slate-100 dark:border-slate-700 shadow-sm hover:ring-emerald-400/50 transition-all"
          >
            <img
              :src="submission.imageUrl"
              alt="Cartão-resposta do aluno"
              class="w-full h-auto object-contain"
            />
          </a>
        </div>

        <h3
          class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1"
        >
          Respostas Lidas
        </h3>

        <div v-if="!submission.answers" class="flex justify-center p-8">
          <i class="pi pi-spin pi-spinner text-2xl text-emerald-600 dark:text-emerald-400"></i>
        </div>

        <div v-else class="rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 border border-slate-100 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
              <tr>
                <th
                  class="px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Questão
                </th>
                <th
                  class="px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Alternativa Marcada
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
              <tr
                v-for="(answer, questionNumber) in submission.answers"
                :key="questionNumber"
                class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30"
              >
                <td class="px-5 py-3 text-sm text-slate-600 dark:text-slate-400 font-semibold">
                  {{ Number(questionNumber) + 1 }}
                </td>
                <td class="px-5 py-3 text-sm">
                  <span v-if="answer" class="text-slate-800 dark:text-slate-100 font-bold">{{
                    answer
                  }}</span>
                  <span v-else class="text-slate-400 dark:text-slate-500 italic font-medium">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="
            submission.answers && Object.keys(submission.answers).length === 0
          "
          class="text-center p-6 text-sm text-slate-500 dark:text-slate-400 font-medium"
        >
          Nenhuma resposta processada para este aluno.
        </div>
      </div>
    </div>
  </div>
</template>
