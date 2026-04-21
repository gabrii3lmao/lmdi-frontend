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
    class="bg-[#111827] rounded-2xl overflow-hidden ring-1 ring-white/5 shadow-xl"
  >
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead
          class="bg-[#0B0F19]/50 text-xs uppercase text-gray-400 font-semibold tracking-wider border-b border-white/5"
        >
          <tr>
            <th class="p-4 px-6 font-medium">Nome do Aluno</th>
            <th class="p-4 px-6 text-right font-medium">Nota</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-white/5">
          <tr
            v-for="sub in submissions"
            :key="sub._id"
            @click="$emit('open', sub)"
            class="hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <td class="p-4 px-6">
              <div class="flex items-center gap-4">
                <div
                  class="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold shrink-0 group-hover:bg-indigo-500/20 transition-colors"
                >
                  {{
                    sub.studentName
                      ? sub.studentName.charAt(0).toUpperCase()
                      : "?"
                  }}
                </div>
                <span
                  class="text-gray-200 font-medium group-hover:text-white transition-colors"
                >
                  {{ sub.studentName }}
                </span>
              </div>
            </td>

            <td class="p-4 px-6 text-right">
              <div
                v-if="sub.score !== undefined"
                class="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-white/5 border border-white/10"
              >
                <span class="text-sm font-bold text-white">{{
                  sub.score
                }}</span>
              </div>

              <div
                v-else
                class="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-500/10 border border-gray-500/20"
              >
                <span class="text-xs font-medium text-gray-400 italic"
                  >Pendente</span
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
