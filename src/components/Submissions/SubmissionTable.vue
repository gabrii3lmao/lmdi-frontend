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
    class="bg-white border border-slate-400/60 rounded-2xl overflow-hidden ring-1 ring-slate-300 shadow-sm"
  >
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead
          class="bg-slate-50/75 text-xs uppercase text-slate-500 font-bold tracking-wider border-b border-slate-400/60"
        >
          <tr>
            <th class="p-4 px-6 font-semibold">Nome do Aluno</th>
            <th class="p-4 px-6 text-right font-semibold">Nota</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="sub in submissions"
            :key="sub._id"
            @click="$emit('open', sub)"
            class="hover:bg-slate-50/50 transition-colors cursor-pointer group"
          >
            <td class="p-4 px-6">
              <div class="flex items-center gap-4">
                <div
                  class="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0 group-hover:bg-emerald-100/80 transition-colors"
                >
                  {{
                    sub.studentName
                      ? sub.studentName.charAt(0).toUpperCase()
                      : "?"
                  }}
                </div>
                <span
                  class="text-slate-700 font-semibold group-hover:text-slate-900 transition-colors"
                >
                  {{ sub.studentName }}
                </span>
              </div>
            </td>

            <td class="p-4 px-6 text-right">
              <div
                v-if="sub.score !== undefined"
                class="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100"
              >
                <span class="text-sm font-bold text-emerald-700">{{
                  sub.score
                }}</span>
              </div>

              <div
                v-else
                class="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-slate-100 border border-slate-200"
              >
                <span class="text-xs font-semibold text-slate-500"
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
