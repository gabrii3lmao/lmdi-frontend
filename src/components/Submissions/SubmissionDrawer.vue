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
      class="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300"
    >
      <div
        class="p-6 border-b border-slate-100 flex justify-between items-center"
      >
        <h2 class="text-xl font-bold text-slate-800">
          {{ submission.studentName }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 p-2 transition-colors hover:bg-slate-50 rounded-lg"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div class="p-6 flex-1 overflow-y-auto">
        <div
          class="p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-6 flex items-center justify-between shadow-sm"
        >
          <span
            class="text-emerald-700 font-bold uppercase text-xs tracking-wider"
            >Nota Final:</span
          >
          <span class="text-2xl font-extrabold text-emerald-800">
            {{ submission.score ?? "-" }}
          </span>
        </div>

        <h3
          class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1"
        >
          Respostas Lidas
        </h3>

        <div v-if="!submission.answers" class="flex justify-center p-8">
          <i class="pi pi-spin pi-spinner text-2xl text-emerald-600"></i>
        </div>

        <div v-else class="rounded-xl overflow-hidden ring-1 ring-slate-200 border border-slate-100 shadow-sm bg-white">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th
                  class="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                  Questão
                </th>
                <th
                  class="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                  Alternativa Marcada
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr
                v-for="(answer, questionNumber) in submission.answers"
                :key="questionNumber"
                class="hover:bg-slate-50/50"
              >
                <td class="px-5 py-3 text-sm text-slate-600 font-semibold">
                  {{ Number(questionNumber) + 1 }}
                </td>
                <td class="px-5 py-3 text-sm">
                  <span v-if="answer" class="text-slate-800 font-bold">{{
                    answer
                  }}</span>
                  <span v-else class="text-slate-400 italic font-medium">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="
            submission.answers && Object.keys(submission.answers).length === 0
          "
          class="text-center p-6 text-sm text-slate-500 font-medium"
        >
          Nenhuma resposta processada para este aluno.
        </div>
      </div>
    </div>
  </div>
</template>
