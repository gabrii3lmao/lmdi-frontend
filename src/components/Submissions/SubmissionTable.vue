<script setup lang="ts">
// Adicionando a tipagem básica para ter o autocompletar no template
interface Submission {
  _id: string;
  studentName: string;
  score?: number;
  status: string;
}

defineProps<{
  submissions: Submission[];
}>();

defineEmits(["open"]);
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 border border-slate-400/60 dark:border-slate-600 rounded-2xl overflow-hidden ring-1 ring-slate-300 dark:ring-slate-700 shadow-sm"
  >
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead
          class="bg-slate-50/75 dark:bg-slate-700/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider border-b border-slate-400/60 dark:border-slate-600"
        >
          <tr>
            <th class="p-4 px-6 font-semibold">Nome do Aluno</th>
            <th class="p-4 px-6 text-right font-semibold">Nota</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
          <tr
            v-for="sub in submissions"
            :key="sub._id"
            @click="$emit('open', sub)"
            class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group"
          >
            <td class="p-4 px-6">
              <div class="flex items-center gap-4">
                <div
                  class="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-bold shrink-0 group-hover:bg-emerald-100/80 dark:group-hover:bg-emerald-900/60 transition-colors"
                >
                  {{
                    sub.studentName
                      ? sub.studentName.charAt(0).toUpperCase()
                      : "?"
                  }}
                </div>
                <span
                  class="text-slate-700 dark:text-slate-300 font-semibold group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors"
                >
                  {{ sub.studentName }}
                </span>
              </div>
            </td>

            <td class="p-4 px-6 text-right">
              <div
                v-if="sub.score !== undefined"
                class="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800"
              >
                <span class="text-sm font-bold text-emerald-700 dark:text-emerald-300">{{
                  sub.score
                }}</span>
              </div>

              <div
                v-else
                class="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
              >
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400"
                  >Corrigindo...</span
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
