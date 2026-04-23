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
      class="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-sm transition-opacity"
      @click="$emit('close')"
    ></div>

    <div
      class="absolute inset-y-0 right-0 w-full max-w-md bg-[#111827] shadow-2xl flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-300"
    >
      <div
        class="p-6 border-b border-white/5 flex justify-between items-center"
      >
        <h2 class="text-xl font-bold text-white">
          {{ submission.studentName }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-white p-2 transition-colors"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div class="p-6 flex-1 overflow-y-auto">
        <div
          class="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-6"
        >
          <span
            class="text-indigo-400 font-medium uppercase text-xs tracking-wider"
            >Nota Final:</span
          >
          <span class="text-2xl font-bold text-white ml-2">
            {{ submission.score ?? "-" }}
          </span>
        </div>

        <h3
          class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3"
        >
          Respostas Lidas pela IA
        </h3>

        <div v-if="!submission.answers" class="flex justify-center p-8">
          <i class="pi pi-spin pi-spinner text-2xl text-indigo-500"></i>
        </div>

        <div v-else class="rounded-xl overflow-hidden ring-1 ring-white/10">
          <table class="w-full text-left border-collapse">
            <thead class="bg-[#0B0F19]">
              <tr>
                <th
                  class="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/5"
                >
                  Questão
                </th>
                <th
                  class="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/5"
                >
                  Alternativa Marcada
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 bg-[#111827]">
              <tr
                v-for="(answer, questionNumber) in submission.answers"
                :key="questionNumber"
                class="hover:bg-white/[0.02]"
              >
                <td class="px-5 py-3 text-sm text-gray-300 font-medium">
                  {{ Number(questionNumber) + 1 }}
                </td>
                <td class="px-5 py-3 text-sm">
                  <span v-if="answer" class="text-white font-bold">{{
                    answer
                  }}</span>
                  <span v-else class="text-gray-500 italic">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="
            submission.answers && Object.keys(submission.answers).length === 0
          "
          class="text-center p-6 text-sm text-gray-500"
        >
          Nenhuma resposta processada para este aluno.
        </div>
      </div>
    </div>
  </div>
</template>
