<script setup lang="ts">
import type { Exam } from "@/types/Exam";

defineProps<{
  turmas: any[];
  exams: Exam[];
  selectedClassId: string;
  selectedExamId: string;
  loadingTurmas: boolean;
  loadingExams: boolean;
}>();

defineEmits(["update:selectedClassId", "update:selectedExamId"]);
</script>

<template>
  <div
    class="bg-white border border-slate-400/60 ring-1 ring-slate-300 rounded-2xl p-4 flex flex-col sm:flex-row gap-5 mb-6 shadow-sm"
  >
    <select
      :value="selectedClassId"
      @change="
        $emit(
          'update:selectedClassId',
          ($event.target as HTMLSelectElement).value,
        )
      "
      :disabled="loadingTurmas"
      class="flex-1 bg-slate-50 border border-slate-500 text-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer"
    >
      <option value="" disabled>Selecione a Turma</option>
      <option v-for="t in turmas" :key="t._id" :value="t._id">
        {{ t.name }}
      </option>
    </select>

    <select
      :value="selectedExamId"
      @change="
        $emit(
          'update:selectedExamId',
          ($event.target as HTMLSelectElement).value,
        )
      "
      :disabled="!selectedClassId || loadingExams"
      class="flex-1 bg-slate-50 border border-slate-500 text-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="" disabled>Selecione a Prova</option>
      <option v-for="e in exams" :key="e._id" :value="e._id">
        {{ e.title }}
      </option>
    </select>
  </div>
</template>
