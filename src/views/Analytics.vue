<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useQuery } from "@tanstack/vue-query";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import SubmissionFilters from "@/components/Submissions/SubmissionFilters.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import { submissionService } from "@/services/submissionService";
import { turmaService } from "@/services/turmas";
import { examService } from "@/services/examService";
import type { Exam } from "@/types/Exam";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const toast = useToast();

const selectedClassId = ref("");
const selectedExamId = ref("");

const { data: turmas, isLoading: loadingTurmas } = useQuery({
  queryKey: ["turmas"],
  queryFn: async () => {
    const res = await turmaService.getAll(1, 100);
    const paginated = res.data as any;
    return paginated?.data || paginated || [];
  },
  placeholderData: [],
});

const { data: exams, isLoading: loadingExams } = useQuery({
  queryKey: ["provas", selectedClassId],
  queryFn: async () => {
    const res = await examService.listarGabaritosMestre(selectedClassId.value, 1, 100);
    const paginated = res.data as any;
    return paginated?.data || paginated || [];
  },
  enabled: computed(() => !!selectedClassId.value),
  placeholderData: [],
});

const { data: analytics, isLoading: loadingAnalytics } = useQuery({
  queryKey: ["analytics", selectedExamId],
  queryFn: async () => {
    const res = await submissionService.getAnalytics(selectedExamId.value);
    return res.data as any;
  },
  enabled: computed(() => !!selectedExamId.value),
});

watch(selectedClassId, () => {
  selectedExamId.value = "";
});

const activeExam = computed(() => {
  return (exams.value || []).find((e: Exam) => e._id === selectedExamId.value) || null;
});

const hasData = computed(() => {
  return analytics.value && (analytics.value as any).stats?.total > 0;
});

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true, grid: { color: "rgba(148, 163, 184, 0.15)" } },
    x: { grid: { display: false } },
  },
};

const distributionData = computed(() => {
  if (!hasData.value) return null;
  const dist = (analytics.value as any).distribution;
  return {
    labels: ["0–2", "2–4", "4–6", "6–8", "8–10"],
    datasets: [
      {
        label: "Alunos",
        backgroundColor: ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#059669"],
        borderRadius: 8,
        borderSkipped: false,
        data: [dist["0-2"], dist["2-4"], dist["4-6"], dist["6-8"], dist["8-10"]],
      },
    ],
  };
});

const distributionOptions = {
  ...chartDefaults,
  plugins: {
    ...chartDefaults.plugins,
    tooltip: {
      callbacks: {
        label: (ctx: any) => `${ctx.raw} aluno${ctx.raw !== 1 ? "s" : ""}`,
      },
    },
  },
  scales: {
    ...chartDefaults.scales,
    y: { ...chartDefaults.scales.y, ticks: { stepSize: 1, precision: 0 } },
  },
};

const questionAccuracyData = computed(() => {
  if (!hasData.value) return null;
  const qa = (analytics.value as any).questionAccuracy;
  const colors = qa.map((q: any) =>
    q.percentage >= 70 ? "#059669" : q.percentage >= 40 ? "#EAB308" : "#EF4444",
  );
  return {
    labels: qa.map((_: any, i: number) => `Q${i + 1}`),
    datasets: [
      {
        label: "% Acerto",
        backgroundColor: colors,
        borderRadius: 8,
        borderSkipped: false,
        data: qa.map((q: any) => q.percentage),
      },
    ],
  };
});

const questionAccuracyOptions = {
  ...chartDefaults,
  plugins: {
    ...chartDefaults.plugins,
    tooltip: {
      callbacks: {
        label: (ctx: any) => `${ctx.raw}%`,
      },
    },
  },
  scales: {
    ...chartDefaults.scales,
    y: { ...chartDefaults.scales.y, max: 100, ticks: { callback: (v: any) => `${v}%` } },
  },
};

const studentScoresData = computed(() => {
  if (!hasData.value) return null;
  const students = (analytics.value as any).studentScores;
  const maxNameLen = 8;
  const labels = students.map((s: any) =>
    s.name.length > maxNameLen ? s.name.substring(0, maxNameLen) + "…" : s.name,
  );
  const colors = students.map((s: any) =>
    s.score >= 7 ? "#059669" : s.score >= 5 ? "#EAB308" : "#EF4444",
  );
  return {
    labels,
    datasets: [
      {
        label: "Nota",
        backgroundColor: colors,
        borderRadius: 8,
        borderSkipped: false,
        data: students.map((s: any) => s.score),
      },
    ],
  };
});

const studentScoresOptions = {
  ...chartDefaults,
  plugins: {
    ...chartDefaults.plugins,
    tooltip: {
      callbacks: {
        label: (ctx: any) => `Nota: ${ctx.raw}`,
      },
    },
  },
  scales: {
    ...chartDefaults.scales,
    y: { ...chartDefaults.scales.y, max: 10 },
  },
};

const stats = computed(() => {
  if (!hasData.value) return null;
  const s = (analytics.value as any).stats;
  return [
    { label: "Média da Turma", value: s.average, icon: "pi pi-calculator", color: "emerald", bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800", iconBg: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" },
    { label: "Maior Nota", value: s.highest, icon: "pi pi-arrow-up", color: "green", bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800", iconBg: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400" },
    { label: "Menor Nota", value: s.lowest, icon: "pi pi-arrow-down", color: "red", bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800", iconBg: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400" },
    { label: "Total de Alunos", value: s.total, icon: "pi pi-users", color: "blue", bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800", iconBg: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" },
  ];
});

function getStatTextColor(color: string) {
  return {
    emerald: "text-emerald-700 dark:text-emerald-300",
    green: "text-green-700 dark:text-green-300",
    red: "text-red-700 dark:text-red-300",
    blue: "text-blue-700 dark:text-blue-300",
  }[color] || "text-slate-700 dark:text-slate-300";
}

const exporting = ref(false);

async function downloadReport() {
  if (!selectedExamId.value) return;
  exporting.value = true;
  try {
    const res = await submissionService.exportReport(selectedExamId.value);
    const blob = new Blob([res.data as BlobPart], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const examTitle = activeExam.value?.title || "relatorio";
    a.href = url;
    a.download = `relatorio_${examTitle.replace(/\s+/g, "_")}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.add({
      severity: "success",
      summary: "Relatório exportado",
      detail: "Planilha baixada com sucesso!",
      life: 3000,
    });
  } catch {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Não foi possível exportar o relatório.",
      life: 4000,
    });
  } finally {
    exporting.value = false;
  }
}
</script>

<template>
  <div class="sm:ml-64 min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-sans flex flex-col">
    <div class="flex-1 p-4 md:p-8">
      <div class="max-w-7xl 2xl:max-w-[90rem] mx-auto">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <i class="pi pi-chart-pie text-sm"></i>
              </span>
              Desempenho
            </h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-2 ml-11">
              Gráficos e estatísticas detalhadas das suas provas.
            </p>
          </div>
        </div>

        <SubmissionFilters
          :turmas="turmas || []"
          :exams="exams || []"
          :selectedClassId="selectedClassId"
          :selectedExamId="selectedExamId"
          :selectedStatus="''"
          :loadingTurmas="loadingTurmas"
          :loadingExams="loadingExams"
          @update:selectedClassId="selectedClassId = $event"
          @update:selectedExamId="selectedExamId = $event"
        />

        <LoadingSpinner v-if="loadingAnalytics" message="Carregando dados..." />

        <Transition name="fade" mode="out-in">
          <div v-if="!selectedExamId" key="empty" class="p-12 sm:p-16 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-800 rounded-2xl ring-1 ring-slate-200/80 dark:ring-slate-700 border border-slate-100 dark:border-slate-700 shadow-sm">
            <div class="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-5 text-emerald-500 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-700">
              <i class="pi pi-chart-bar text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
              Selecione uma avaliação
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm">
              Escolha a turma e a prova acima para visualizar gráficos e estatísticas de desempenho.
            </p>
          </div>

          <div v-else-if="selectedExamId && !hasData && !loadingAnalytics" key="nodata" class="p-12 sm:p-16 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-800 rounded-2xl ring-1 ring-slate-200/80 dark:ring-slate-700 border border-slate-100 dark:border-slate-700 shadow-sm">
            <div class="w-16 h-16 bg-slate-100 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center mb-5 text-slate-400 dark:text-slate-500 ring-1 ring-slate-200 dark:ring-slate-600">
              <i class="pi pi-inbox text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
              Nenhum dado disponível
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm">
              Esta prova ainda não possui correções concluídas. Após corrigir as submissões, os gráficos serão exibidos aqui.
            </p>
          </div>
        </Transition>

        <template v-if="hasData && stats">
          <Transition name="fade" mode="out-in">
            <div key="content">
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 mb-6 ring-1 ring-slate-200/80 dark:ring-slate-700 border border-slate-100 dark:border-slate-700 shadow-sm">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <i class="pi pi-file-edit text-lg"></i>
                    </div>
                    <div>
                      <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {{ (activeExam as any)?.title || "Prova" }}
                      </h2>
                      <p class="text-sm text-slate-500 dark:text-slate-400">
                        {{ (turmas || []).find((t: any) => t._id === selectedClassId)?.name || "-" }}
                        &middot; {{ (analytics as any).stats.total }} aluno{{ (analytics as any).stats.total !== 1 ? "s" : "" }}
                      </p>
                    </div>
                  </div>
                  <button
                    @click="downloadReport"
                    :disabled="exporting"
                    class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-300 dark:disabled:bg-emerald-800 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30"
                  >
                    <i class="pi pi-file-excel"></i>
                    <span>{{ exporting ? "Exportando…" : "Exportar relatório" }}</span>
                  </button>
                </div>

                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div
                    v-for="stat in stats"
                    :key="stat.label"
                    :class="`rounded-xl p-4 border ${stat.bg} flex items-center gap-3 transition-shadow hover:shadow-md`"
                  >
                    <div :class="`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0`">
                      <i :class="`${stat.icon} text-base`"></i>
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate">
                        {{ stat.label }}
                      </p>
                      <p :class="`text-xl sm:text-2xl font-extrabold ${getStatTextColor(stat.color)}`">
                        {{ stat.value }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-slate-800 rounded-2xl ring-1 ring-slate-200/80 dark:ring-slate-700 border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div class="px-5 pt-5 pb-2 border-b border-slate-100 dark:border-slate-700">
                    <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Distribuição das Notas
                    </h3>
                    <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Quantidade de alunos por faixa de nota
                    </p>
                  </div>
                  <div class="p-5">
                    <div class="h-64 sm:h-72">
                      <Bar v-if="distributionData" :data="distributionData" :options="distributionOptions" />
                    </div>
                  </div>
                </div>

                <div class="bg-white dark:bg-slate-800 rounded-2xl ring-1 ring-slate-200/80 dark:ring-slate-700 border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div class="px-5 pt-5 pb-2 border-b border-slate-100 dark:border-slate-700">
                    <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                      % de Acerto por Questão
                    </h3>
                    <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Percentual de acertos em cada questão
                    </p>
                  </div>
                  <div class="p-5">
                    <div class="h-64 sm:h-72">
                      <Bar v-if="questionAccuracyData" :data="questionAccuracyData" :options="questionAccuracyOptions" />
                    </div>
                  </div>
                </div>

                <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl ring-1 ring-slate-200/80 dark:ring-slate-700 border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div class="px-5 pt-5 pb-2 border-b border-slate-100 dark:border-slate-700">
                    <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                      Notas Individuais
                    </h3>
                    <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Nota de cada aluno (verde ≥ 7, amarelo ≥ 5, vermelho &lt; 5)
                    </p>
                  </div>
                  <div class="p-5">
                    <div class="h-72 sm:h-80">
                      <Bar v-if="studentScoresData" :data="studentScoresData" :options="studentScoresOptions" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
