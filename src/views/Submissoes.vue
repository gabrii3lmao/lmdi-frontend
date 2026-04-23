// Submissoes.vue
<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";

import SubmissionFilters from "@/components/Submissions/SubmissionFilters.vue";
import SubmissionTable from "@/components/Submissions/SubmissionTable.vue";
import SubmissionDrawer from "@/components/Submissions/SubmissionDrawer.vue";

import { submissionService } from "@/services/submissionService";
import { turmaService } from "@/services/turmas";
import { examService } from "@/services/examService";

import type { Exam } from "@/types/Exam";
import type { Submission } from "@/types/Submission";

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
const activeExam = ref<Exam | null>(null); // Pode usar 'any' temporariamente se o tipo Exam reclamar do 'title'
const isDrawerOpen = ref(false);

const loadingTurmas = ref(true);
const loadingExams = ref(false);
const loadingSubmissions = ref(false);
const loadingAnswers = ref(false);

// NOVA FEATURE: Cálculo dinâmico da nota média da turma
const averageScore = computed(() => {
  if (submissions.value.length === 0) return "-";

  // Filtra apenas submissões que possuem nota
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
    console.error("Erro ao carregar turmas", error);
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
    console.error("Erro ao carregar provas", error);
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
    console.error("Erro ao carregar submissões", error);
  } finally {
    loadingSubmissions.value = false;
  }
});

const openStudentDetails = async (sub: Submission) => {
  selectedSubmission.value = {...sub, answers: null};
  isDrawerOpen.value = true;
  loadingAnswers.value = true;

  try {
    const res = await submissionService.getSubmissionAnswers(sub._id);
    selectedSubmission.value = {
      ...selectedSubmission.value,
      answers: res.data.answers,
    };
  } catch (error) {
    console.error("Erro ao carregar respostas da submissão", error);
  } finally {
    loadingAnswers.value = false;
  }
};  
</script>

<template>
  <div class="sm:ml-64 min-h-screen bg-[#0B0F19] p-6 md:p-8 font-sans">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">
            Submissões
          </h1>
          <p class="text-gray-400 text-sm mt-1">
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
        class="bg-[#111827] rounded-2xl p-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ring-1 ring-white/5 transition-all"
      >
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <i class="pi pi-file-edit text-indigo-500"></i>
            {{ (activeExam as any).title || "Prova Selecionada" }}
          </h2>
          <p class="text-sm text-gray-400 mt-1">
            Turma:
            {{ turmas.find((t) => t._id === selectedClassId)?.name || "-" }}
          </p>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div
            class="flex-1 sm:flex-none bg-[#0B0F19] px-5 py-2.5 rounded-xl border border-white/10 flex flex-col items-center justify-center"
          >
            <span
              class="text-xs text-gray-400 uppercase tracking-wider font-semibold"
              >Submissões</span
            >
            <span class="text-lg font-bold text-white">{{
              submissions.length
            }}</span>
          </div>
          <div
            class="flex-1 sm:flex-none bg-indigo-500/10 px-5 py-2.5 rounded-xl border border-indigo-500/20 flex flex-col items-center justify-center"
          >
            <span
              class="text-xs text-indigo-400 uppercase tracking-wider font-semibold"
              >Média (Nota)</span
            >
            <span class="text-lg font-bold text-indigo-400">{{
              averageScore
            }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="loadingSubmissions"
        class="p-16 flex flex-col items-center justify-center bg-[#111827] rounded-2xl ring-1 ring-white/5"
      >
        <i class="pi pi-spin pi-spinner text-3xl text-indigo-500 mb-4"></i>
        <span class="text-gray-400 text-sm">Carregando submissões...</span>
      </div>

      <SubmissionTable
        v-else-if="submissions.length > 0"
        :submissions="submissions"
        @open="openStudentDetails"
      />

      <div
        v-else-if="selectedExamId"
        class="p-16 flex flex-col items-center justify-center text-center bg-[#111827] rounded-2xl ring-1 ring-white/5"
      >
        <div
          class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4"
        >
          <i class="pi pi-inbox text-2xl text-gray-500"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-300">
          Nenhuma submissão encontrada.
        </h3>
        <p class="text-sm text-gray-500 mt-1">
          Faça o upload de provas para esta avaliação.
        </p>
      </div>

      <div
        v-else
        class="p-16 flex flex-col items-center justify-center text-center bg-[#111827] rounded-2xl ring-1 ring-white/5"
      >
        <div
          class="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4"
        >
          <i class="pi pi-filter text-2xl text-indigo-400"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-300">
          Selecione uma avaliação
        </h3>
        <p class="text-sm text-gray-500 mt-1">
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
