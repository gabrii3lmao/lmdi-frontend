<script setup lang="ts">
import type { Submission } from "@/types/Submission";

defineProps<{
  submissions: Submission[];
}>();

defineEmits<{
  open: [sub: Submission];
  edit: [sub: Submission];
  delete: [sub: Submission];
  reprocess: [sub: Submission];
}>();
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden ring-1 ring-slate-300 dark:ring-slate-700 shadow-sm"
  >
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead
          class="bg-slate-50/75 dark:bg-slate-700/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider border-b border-slate-400/60 dark:border-slate-600"
        >
          <tr>
            <th class="p-4 px-6 font-semibold">Nome do Aluno</th>
            <th class="p-4 px-6 font-semibold">Status</th>
            <th class="p-4 px-6 text-right font-semibold">Nota</th>
            <th class="p-4 px-6 text-right font-semibold w-36">Ações</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
          <tr
            v-for="sub in submissions"
            :key="sub._id"
            class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group"
          >
            <td
              class="p-4 px-6 cursor-pointer"
              @click="$emit('open', sub)"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-bold shrink-0"
                >
                  {{
                    sub.studentName
                      ? sub.studentName.charAt(0).toUpperCase()
                      : "?"
                  }}
                </div>
                <span
                  class="text-slate-700 dark:text-slate-300 font-semibold"
                >
                  {{ sub.studentName }}
                </span>
              </div>
            </td>

            <td class="p-4 px-6">
              <span
                :class="[
                  'inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded',
                  sub.status === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800'
                    : sub.status === 'pending'
                      ? 'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800'
                      : 'bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800',
                ]"
              >
                <i
                  v-if="sub.status === 'pending'"
                  class="pi pi-spin pi-spinner text-[10px]"
                ></i>
                <i
                  v-else-if="sub.status === 'success'"
                  class="pi pi-check text-[10px]"
                ></i>
                <i v-else class="pi pi-times text-[10px]"></i>
                {{
                  sub.status === "success"
                    ? "Corrigido"
                    : sub.status === "pending"
                      ? "Processando..."
                      : "Erro na Leitura"
                }}
              </span>
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
                  >-</span
                >
              </div>
            </td>

            <td class="p-4 px-6 text-right">
              <div class="flex items-center justify-end gap-1">
                <button
                  v-if="sub.status === 'error'"
                  @click.stop="$emit('reprocess', sub)"
                  title="Reenviar para IA"
                  class="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all"
                >
                  <i class="pi pi-refresh text-sm"></i>
                </button>
                <button
                  @click.stop="$emit('edit', sub)"
                  title="Editar"
                  class="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
                >
                  <i class="pi pi-pencil text-sm"></i>
                </button>
                <button
                  @click.stop="$emit('delete', sub)"
                  title="Excluir"
                  class="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                >
                  <i class="pi pi-trash text-sm"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
