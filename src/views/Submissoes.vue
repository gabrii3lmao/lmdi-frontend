<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useQuery } from "@tanstack/vue-query"; // <-- Importação do TanStack Query

import SubmissionFilters from "@/components/Submissions/SubmissionFilters.vue";
import SubmissionTable from "@/components/Submissions/SubmissionTable.vue";
import SubmissionDrawer from "@/components/Submissions/SubmissionDrawer.vue";
import Pagination from "@/components/common/Pagination.vue";
import { submissionService } from "@/services/submissionService";
import { turmaService } from "@/services/turmas";
import { examService } from "@/services/examService";
import type { Turma } from "@/types/Turma";
import type { Exam } from "@/types/Exam";
import type { Submission } from "@/types/Submission";

const toast = useToast();

// Estados locais de interface
const selectedClassId = ref("");
const selectedExamId = ref("");
const selectedSubmission = ref<Submission | null>(null);
const isDrawerOpen = ref(false);
const loadingAnswers = ref(false);

const page = ref(1);
const limit = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);

// 1. Query das Turmas (Cache Compartilhado Global)
const { data: turmas, isLoading: loadingTurmas } = useQuery({
  queryKey: ["turmas"],
  queryFn: async () => {
    const res = await turmaService.getAll(1, 100);
    const paginated = res.data as any;
    return paginated?.data || paginated || [];
  },
  initialData: [],
});

// 2. Query das Provas (Dependente da Turma selecionada)
const { data: exams, isLoading: loadingExams } = useQuery({
  queryKey: ["provas", selectedClassId],
  queryFn: async () => {
    const res = await examService.listarGabaritosMestre(selectedClassId.value, 1, 100);
    const paginated = res.data as any;
    return paginated?.data || paginated || [];
  },
  enabled: computed(() => !!selectedClassId.value), // Só executa se tiver turma
  initialData: [],
});

// 3. Query das Submissões (Dependente da Prova selecionada)
const { data: submissions, isLoading: loadingSubmissions } = useQuery({
  queryKey: ["submissoes", selectedExamId, page, limit],
  queryFn: async () => {
    const res = await submissionService.getAllSubmission(
      selectedExamId.value,
      page.value,
      limit.value,
    );
    const paginated = res.data as any;
    if (paginated?.data) {
      totalItems.value = paginated.totalItems;
      totalPages.value = paginated.totalPages;
      return paginated.data;
    }
    return paginated || [];
  },
  enabled: computed(() => !!selectedExamId.value), // Só executa se tiver prova
  initialData: [],
});

// Limpa a prova selecionada ao trocar de turma
watch(selectedClassId, () => {
  selectedExamId.value = "";
  page.value = 1;
});

watch(selectedExamId, () => {
  page.value = 1;
});

// Variáveis computadas derivadas das Queries
const activeExam = computed(() => {
  return (exams.value || []).find((e: Exam) => e._id === selectedExamId.value) || null;
});

const averageScore = computed(() => {
  const list = submissions.value || [];
  if (list.length === 0) return "-";

  const gradedSubmissions = list.filter(
    (s: Submission) => s.score !== undefined,
  );
  if (gradedSubmissions.length === 0) return "-";

  const total = gradedSubmissions.reduce(
    (acc: number, curr: Submission) => acc + (curr.score || 0),
    0,
  );
  return (total / gradedSubmissions.length).toFixed(1);
});

// Mantivemos a requisição manual aqui porque é a abertura de um modal sob demanda
const openStudentDetails = async (sub: Submission) => {
  selectedSubmission.value = { ...sub, answers: null };
  isDrawerOpen.value = true;
  loadingAnswers.value = true;

  try {
    const res = await submissionService.getSubmissionAnswers(sub._id);
    if (selectedSubmission.value) {
      selectedSubmission.value.answers = res.data.answers;
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Não foi possível carregar os detalhes do aluno.",
      life: 4000,
    });
    isDrawerOpen.value = false;
  } finally {
    loadingAnswers.value = false;
  }
};
</script>

<template>
  <div
    class="sm:ml-64 min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-sans flex flex-col"
  >
    <div class="flex-1 p-6 md:p-8">
      <div class="max-w-7xl 2xl:max-w-[90rem] mx-auto">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              Submissões
            </h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Gerencie os cartões-resposta enviados pelos alunos.
            </p>
          </div>
        </div>

        <SubmissionFilters
          :turmas="turmas"
          :exams="exams"
          :selectedClassId="selectedClassId"
          :selectedExamId="selectedExamId"
          :loadingTurmas="loadingTurmas"
          :loadingExams="loadingExams"
          @update:selectedClassId="selectedClassId = $event"
          @update:selectedExamId="selectedExamId = $event"
        />

        <div
          v-if="activeExam && !loadingExams"
          class="bg-white dark:bg-slate-800 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ring-1 ring-slate-400/60 dark:ring-slate-600 border border-slate-300 dark:border-slate-600 shadow-sm transition-all"
        >
          <div>
            <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <i class="pi pi-file-edit text-emerald-600 dark:text-emerald-400"></i>
              {{ (activeExam as any).title || "Prova Selecionada" }}
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Turma:
              {{
                (turmas || []).find((t: Turma) => t._id === selectedClassId)?.name || "-"
              }}
            </p>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <div
              class="flex-1 sm:flex-none bg-slate-50 dark:bg-slate-700/50 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 flex flex-col items-center justify-center"
            >
              <span
                class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold"
                >Submissões</span
              >
              <span class="text-lg font-bold text-slate-800 dark:text-slate-100">{{
                totalItems || submissions.length
              }}</span>
            </div>
            <div
              class="flex-1 sm:flex-none bg-emerald-50 dark:bg-emerald-900/30 px-5 py-2.5 rounded-xl border border-emerald-100 dark:border-emerald-800 flex flex-col items-center justify-center animate-pulse-slow"
            >
              <span
                class="text-xs text-emerald-700 dark:text-emerald-300 uppercase tracking-wider font-bold"
                >Média (Nota)</span
              >
              <span class="text-lg font-bold text-emerald-700 dark:text-emerald-300">{{
                averageScore
              }}</span>
            </div>
          </div>
        </div>

        <div
          v-if="loadingSubmissions"
          class="p-16 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-2xl ring-1 ring-slate-200/80 dark:ring-slate-700 border border-slate-100 dark:border-slate-700 shadow-sm animate-pulse"
        >
          <i class="pi pi-spin pi-spinner text-3xl text-emerald-600 dark:text-emerald-400 mb-4"></i>
          <span class="text-slate-500 dark:text-slate-400 text-sm font-semibold"
            >Carregando submissões...</span
          >
        </div>

        <div v-else-if="submissions.length > 0">
          <SubmissionTable
            :submissions="submissions"
            @open="openStudentDetails"
          />
        </div>

        <div
          v-else-if="selectedExamId"
          class="p-16 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-800 rounded-2xl ring-1 ring-slate-200/80 dark:ring-slate-700 border border-slate-100 dark:border-slate-700 shadow-sm"
        >
          <div
            class="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500"
          >
            <i class="pi pi-inbox text-2xl" style="font-size: 2rem"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
            Nenhuma submissão encontrada.
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Faça o upload de provas para esta avaliação.
          </p>
        </div>

        <div
          v-else
          class="p-16 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-800 rounded-2xl ring-1 ring-slate-200/80 dark:ring-slate-700 border border-slate-100 dark:border-slate-700 shadow-sm"
        >
          <div
            class="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400"
          >
            <i class="pi pi-filter text-2xl" style="font-size: 2rem"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
            Selecione uma avaliação
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Use os filtros acima para escolher a turma e a prova.
          </p>
        </div>

        <SubmissionDrawer
          :submission="selectedSubmission"
          :exam="activeExam"
          :open="isDrawerOpen"
          @close="isDrawerOpen = false"
        />
      </div>
    </div>

    <div
      v-if="submissions.length > 0"
      class="sticky bottom-0 bg-slate-50 dark:bg-slate-800/95 border-t border-slate-200 dark:border-slate-700 px-6 md:px-8"
    >
      <div class="max-w-7xl 2xl:max-w-[90rem] mx-auto py-3">
        <Pagination
          :currentPage="page"
          :totalPages="totalPages"
          :totalItems="totalItems"
          @page-change="(p: number) => (page = p)"
        />
      </div>
    </div>
  </div>
</template>
