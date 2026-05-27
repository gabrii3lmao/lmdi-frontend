<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useToast } from "primevue/usetoast"; // <-- Importado o Toast

import SubmissionFilters from "@/components/Submissions/SubmissionFilters.vue";
import SubmissionTable from "@/components/Submissions/SubmissionTable.vue";
import SubmissionDrawer from "@/components/Submissions/SubmissionDrawer.vue";

import { submissionService } from "@/services/submissionService";
import { turmaService } from "@/services/turmas";
import { examService } from "@/services/examService";

import type { Exam } from "@/types/Exam";
import type { Submission } from "@/types/Submission";

const toast = useToast(); // <-- Inicializado o Toast

interface Turma {
  _id: string;
  name: string;
}

// estados
const turmas = ref<Turma[]>([]);
const exams = ref<Exam[]>([]);
const submissions = ref<Submission[]>([]);

const selectedClassId = ref("");
const selectedExamId = ref("");

const selectedSubmission = ref<Submission | null>(null);
const activeExam = ref<Exam | null>(null);
const isDrawerOpen = ref(false);

const loadingTurmas = ref(true);
const loadingExams = ref(false);
const loadingSubmissions = ref(false);
const loadingAnswers = ref(false);

const averageScore = computed(() => {
  if (submissions.value.length === 0) return "-";

  const gradedSubmissions = submissions.value.filter(
    (s) => s.score !== undefined,
  );
  if (gradedSubmissions.length === 0) return "-";

  const total = gradedSubmissions.reduce(
    (acc, curr) => acc + (curr.score || 0),
    0,
  );
  return (total / gradedSubmissions.length).toFixed(1);
});

onMounted(async () => {
  try {
    const res = await turmaService.getAll();
    turmas.value = res.data;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Não foi possível carregar as turmas.",
      life: 4000,
    });
  } finally {
    loadingTurmas.value = false;
  }
});

watch(selectedClassId, async (id) => {
  selectedExamId.value = "";
  exams.value = [];
  submissions.value = [];
  activeExam.value = null;

  if (!id) return;

  loadingExams.value = true;
  try {
    const res = await examService.listarGabaritosMestre(id);
    exams.value = res.data;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Falha ao carregar provas da turma.",
      life: 4000,
    });
  } finally {
    loadingExams.value = false;
  }
});

watch(selectedExamId, async (id) => {
  submissions.value = [];
  activeExam.value = exams.value.find((e) => e._id === id) || null;

  if (!id) return;

  loadingSubmissions.value = true;
  try {
    const res = await submissionService.getAllSubmission(id);
    submissions.value = res.data;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Falha ao carregar as submissões desta prova.",
      life: 4000,
    });
  } finally {
    loadingSubmissions.value = false;
  }
});

const openStudentDetails = async (sub: Submission) => {
  selectedSubmission.value = { ...sub, answers: null };
  isDrawerOpen.value = true;
  loadingAnswers.value = true;

  try {
    const res = await submissionService.getSubmissionAnswers(sub._id);
    selectedSubmission.value = {
      ...selectedSubmission.value,
      answers: res.data.answers,
    };
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Não foi possível carregar os detalhes do aluno.",
      life: 4000,
    });
    isDrawerOpen.value = false; // Fecha o drawer se falhar ao carregar os dados detalhados
  } finally {
    loadingAnswers.value = false;
  }
};
</script>

<template>
  <div
    class="sm:ml-64 min-h-screen bg-slate-50 text-slate-700 p-6 md:p-8 font-sans"
  >
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">
            Submissões
          </h1>
          <p class="text-slate-500 text-sm mt-1">
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
        class="bg-white rounded-2xl p-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ring-1 ring-slate-400/60 border border-slate-300 shadow-sm transition-all"
      >
        <div>
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <i class="pi pi-file-edit text-emerald-600"></i>
            {{ (activeExam as any).title || "Prova Selecionada" }}
          </h2>
          <p class="text-sm text-slate-500 mt-1">
            Turma:
            {{ turmas.find((t) => t._id === selectedClassId)?.name || "-" }}
          </p>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div
            class="flex-1 sm:flex-none bg-slate-50 px-5 py-2.5 rounded-xl border border-slate-200 flex flex-col items-center justify-center"
          >
            <span
              class="text-xs text-slate-500 uppercase tracking-wider font-bold"
              >Submissões</span
            >
            <span class="text-lg font-bold text-slate-800">{{
              submissions.length
            }}</span>
          </div>
          <div
            class="flex-1 sm:flex-none bg-emerald-50 px-5 py-2.5 rounded-xl border border-emerald-100 flex flex-col items-center justify-center animate-pulse-slow"
          >
            <span
              class="text-xs text-emerald-700 uppercase tracking-wider font-bold"
              >Média (Nota)</span
            >
            <span class="text-lg font-bold text-emerald-700">{{
              averageScore
            }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="loadingSubmissions"
        class="p-16 flex flex-col items-center justify-center bg-white rounded-2xl ring-1 ring-slate-200/80 border border-slate-100 shadow-sm animate-pulse"
      >
        <i class="pi pi-spin pi-spinner text-3xl text-emerald-600 mb-4"></i>
        <span class="text-slate-500 text-sm font-semibold"
          >Carregando submissões...</span
        >
      </div>

      <SubmissionTable
        v-else-if="submissions.length > 0"
        :submissions="submissions"
        @open="openStudentDetails"
      />

      <div
        v-else-if="selectedExamId"
        class="p-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl ring-1 ring-slate-200/80 border border-slate-100 shadow-sm"
      >
        <div
          class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-200 text-slate-400"
        >
          <i class="pi pi-inbox text-2xl"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800">
          Nenhuma submissão encontrada.
        </h3>
        <p class="text-sm text-slate-500 mt-1 font-medium">
          Faça o upload de provas para esta avaliação.
        </p>
      </div>

      <div
        v-else
        class="p-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl ring-1 ring-slate-200/80 border border-slate-100 shadow-sm"
      >
        <div
          class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-600"
        >
          <i class="pi pi-filter text-2xl"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800">
          Selecione uma avaliação
        </h3>
        <p class="text-sm text-slate-500 mt-1 font-medium">
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
</template>
