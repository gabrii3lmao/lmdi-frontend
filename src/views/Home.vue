<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { dashboardService } from "@/services/dashboardService";

const name = ref("Professor");

const dicas = [
  "Organize seus alunos criando as turmas primeiro. Depois, basta criar um gabarito mestre vinculado a essa turma para iniciar a correção por IA.",
  "Ao criar um gabarito, certifique-se de que o número de questões e o número de alternativas estejam corretos.",
  "Para cada turma, você pode criar um gabarito mestre e diversos modelos de provas. Não há um limite de questões ou alternativas, nem de alunos!",
  "Quando for tirar a foto de um modelo de prova, certifique-se de que a foto esteja bem iluminada e que as questões estejam legíveis.",
  "Ao clicar em um dos botões de 'Ver Provas' você será redirecionado para a página de provas da turma",
];
const showAllTips = ref(false);

const quickActions = [
  { label: "Turmas", description: "Gerencie suas turmas", icon: "pi-users", to: "/classes" },
  { label: "Gabaritos", description: "Modelos de prova", icon: "pi-clone", to: "/templates" },
  { label: "Submissões", description: "Correções dos alunos", icon: "pi-cloud-upload", to: "/submissions" },
  { label: "Análises", description: "Desempenho e métricas", icon: "pi-chart-line", to: "/analytics" },
];

function carregarNomeUsuario() {
  const savedName = localStorage.getItem("username");
  if (savedName) {
    const firstName = savedName.trim().split(" ")[0];
    name.value =
      (firstName as string).charAt(0).toUpperCase() +
      (firstName as string).slice(1).toLowerCase();
  }
}

const { data: dashboard, isLoading } = useQuery({
  queryKey: ["dashboard"],
  queryFn: async () => {
    const { data } = await dashboardService.getDashboard();
    return data;
  },
});

const turmas = computed(() => dashboard.value?.recentClasses ?? []);

const kpis = computed(() => {
  const d = dashboard.value;
  const totalSubmissions = d?.stats.totalSubmissions ?? 0;
  const averageScore = d?.stats.averageScore ?? 0;

  return [
    {
      label: "Turmas",
      value: d?.stats.totalClasses.toString() ?? "0",
      icon: "pi-graduation-cap",
    },
    {
      label: "Gabaritos",
      value: d?.stats.totalExams.toString() ?? "0",
      icon: "pi-list-check",
    },
    {
      label: "Correções",
      value: totalSubmissions.toString(),
      icon: "pi-paperclip",
    },
    {
      label: "Média geral",
      value:
        totalSubmissions > 0
          ? averageScore.toLocaleString("pt-BR", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })
          : "—",
      icon: "pi-star",
    },
  ];
});

const statusCounts = computed(
  () =>
    dashboard.value?.stats.submissionsByStatus ?? {
      pending: 0,
      success: 0,
      error: 0,
    },
);

const totalStatus = computed(
  () =>
    statusCounts.value.success +
    statusCounts.value.pending +
    statusCounts.value.error,
);

const pendingCount = computed(() => statusCounts.value.pending);

function pct(n: number) {
  return totalStatus.value > 0 ? `${(n / totalStatus.value) * 100}%` : "0%";
}

const proximoTip = computed(() => {
  const d = dashboard.value;
  if (!d || isLoading.value) {
    return { title: "Carregando...", text: "", cta: "", to: "/dashboard" };
  }

  const s = d.stats;
  if (s.totalClasses === 0) {
    return {
      title: "Crie sua primeira turma",
      text: "Organize seus alunos criando uma turma. Depois vincule gabaritos e comece a corrigir.",
      cta: "Criar turma",
      to: "/classes",
    };
  }
  if (s.totalExams === 0) {
    return {
      title: "Crie um gabarito mestre",
      text: "Defina o número de questões e alternativas e vincule o gabarito a uma turma.",
      cta: "Criar gabarito",
      to: "/templates",
    };
  }
  if (s.submissionsByStatus.pending > 0) {
    return {
      title: "Acompanhe as correções pendentes",
      text: `Você tem ${s.submissionsByStatus.pending} correção(ões) em processamento pela IA.`,
      cta: "Ver submissões",
      to: "/submissions",
    };
  }
  if (s.totalSubmissions === 0) {
    return {
      title: "Envie as primeiras correções",
      text: "Fotografe os cartões-resposta dos alunos com boa iluminação e envie para correção.",
      cta: "Ir para turmas",
      to: "/classes",
    };
  }
  return {
    title: "Analise o desempenho",
    text: "Veja médias, distribuição de notas e desempenho por turma para apoiar suas decisões.",
    cta: "Abrir análises",
    to: "/analytics",
  };
});

const recentActivity = computed(() => dashboard.value?.recentActivity ?? []);

onMounted(() => {
  carregarNomeUsuario();
});
</script>

<template>
  <div
    class="min-h-screen bg-school-50 dark:bg-lousa-900 text-school-700 dark:text-lousa-300 p-6 md:p-10 font-sans"
  >
    <div class="max-w-5xl 2xl:max-w-7xl mx-auto space-y-8">
      <header class="space-y-1">
        <h1
          class="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight"
        >
          Dashboard
        </h1>
        <p class="text-school-500 dark:text-lousa-400 text-sm">
          Bem-vindo de volta,
          <span class="text-indigo-600 dark:text-indigo-400 font-semibold">{{ name }}</span
          >.
        </p>
      </header>

      <!-- Ações rápidas -->
      <section class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <RouterLink
          v-for="action in quickActions"
          :key="action.to"
          :to="action.to"
          class="group flex items-center gap-3 rounded-xl border border-school-200 dark:border-lousa-700 bg-white dark:bg-lousa-800 p-4 transition-all hover:border-borda-300 hover:bg-school-50 hover:shadow-md dark:hover:bg-lousa-700/60"
        >
          <i
            :class="[
              'pi',
              action.icon,
              'shrink-0 text-2xl text-indigo-600 dark:text-indigo-400',
            ]"
          ></i>
          <div class="min-w-0">
            <p
              class="text-sm font-semibold text-school-700 dark:text-lousa-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors"
            >
              {{ action.label }}
            </p>
            <p class="truncate text-xs text-school-400 dark:text-lousa-500">
              {{ action.description }}
            </p>
          </div>
        </RouterLink>
      </section>

      <!-- KPIs -->
      <section class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div
          v-for="kpi in kpis"
          :key="kpi.label"
          class="flex flex-col gap-3 rounded-2xl bg-white dark:bg-lousa-800 p-5 ring-1 ring-school-300 dark:ring-lousa-700 hover:shadow-md transition-all"
        >
          <div class="flex items-center justify-between">
            <p
              class="text-xs font-semibold uppercase tracking-wide text-school-500 dark:text-lousa-400"
            >
              {{ kpi.label }}
            </p>
            <i
              :class="[
                'pi',
                kpi.icon,
                'text-indigo-600 dark:text-indigo-400',
              ]"
            ></i>
          </div>
          <h3
            class="text-3xl font-extrabold text-school-800 dark:text-lousa-100 tracking-tight"
          >
            {{ isLoading ? "-" : kpi.value }}
          </h3>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section class="lg:col-span-2 space-y-6">
          <div
            class="flex justify-between items-center border-b border-school-400 dark:border-lousa-600 py-2"
          >
            <h3
              class="text-lg font-bold text-school-800 dark:text-lousa-100 flex items-center gap-2"
            >
              <i class="pi pi-sitemap text-indigo-500 dark:text-indigo-400"></i>
              Suas Turmas
            </h3>
            <RouterLink
              to="/classes"
              class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
            >
              Gerenciar Turmas
            </RouterLink>
          </div>

          <div v-if="isLoading" class="space-y-3">
            <div
              v-for="i in 3"
              :key="i"
              class="h-16 bg-school-200/50 dark:bg-lousa-700/40 ring-1 ring-school-200/80 dark:ring-lousa-700/60 rounded-xl animate-pulse"
            ></div>
          </div>

          <div v-else-if="turmas.length > 0" class="space-y-3">
            <RouterLink
              v-for="turma in turmas"
              :key="turma._id"
              :to="`/classes/${turma._id}`"
              class="bg-white dark:bg-lousa-800 ring-1 ring-school-100 dark:ring-lousa-700 p-4 rounded-xl flex justify-between items-center hover:ring-indigo-500/30 hover:border-borda-300 hover:bg-school-50 dark:hover:bg-lousa-700/60 hover:shadow-md transition-all group cursor-pointer border border-school-200 dark:border-lousa-700 w-full"
            >
              <div class="flex items-center gap-4">
                <i
                  class="pi pi-users text-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shrink-0"
                ></i>
                <div>
                  <h4
                    class="font-semibold text-school-700 dark:text-lousa-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors"
                  >
                    {{ turma.name }}
                  </h4>
                  <p class="text-xs text-school-400 dark:text-lousa-500">
                    {{ turma.examCount }} {{ turma.examCount === 1 ? "gabarito" : "gabaritos" }}
                    &middot;
                    {{ turma.submissionCount }}
                    {{ turma.submissionCount === 1 ? "correção" : "correções" }}
                  </p>
                </div>
              </div>
              <div
                class="text-school-400 dark:text-lousa-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all"
              >
                <i class="pi pi-arrow-right"></i>
              </div>
            </RouterLink>
          </div>

          <div
            v-else
            class="bg-white dark:bg-lousa-800 ring-1 ring-school-200/80 dark:ring-lousa-700 border-dashed border-school-300 dark:border-lousa-600 p-10 rounded-2xl text-center flex flex-col items-center justify-center gap-3 shadow-sm"
          >
            <i class="pi pi-inbox text-3xl text-school-400 dark:text-lousa-500"></i>
            <p class="text-school-500 dark:text-lousa-400 text-sm font-medium">
              Nenhuma turma cadastrada ainda.
            </p>
          </div>

          <div
            v-if="recentActivity.length > 0"
            class="border-t border-school-200 dark:border-lousa-700 pt-6"
          >
            <h3
              class="text-lg font-bold text-school-800 dark:text-lousa-100 flex items-center gap-2 mb-4"
            >
              <i class="pi pi-history text-indigo-500 dark:text-indigo-400"></i>
              Atividade Recente
            </h3>
            <div class="space-y-2">
              <div
                v-for="item in recentActivity"
                :key="item.createdAt"
                class="bg-white dark:bg-lousa-800 ring-1 ring-school-100 dark:ring-lousa-700 p-3 rounded-xl flex items-center gap-3 border border-school-200 dark:border-lousa-700"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  :class="{
                    'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400': item.status === 'success',
                    'bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400': item.status === 'pending',
                    'bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400': item.status === 'error',
                  }"
                >
                  <i
                    :class="[
                      'pi text-xs',
                      item.status === 'success' ? 'pi-check' : item.status === 'pending' ? 'pi-clock' : 'pi-exclamation-triangle',
                    ]"
                  ></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-school-700 dark:text-lousa-300 truncate">
                    {{ item.studentName }}
                    <span class="text-school-400 dark:text-lousa-500 font-normal">
                      &mdash; {{ item.examTitle }}
                    </span>
                  </p>
                  <p class="text-xs text-school-400 dark:text-lousa-500">
                    {{ item.className }}
                    <span v-if="item.score !== null && item.score !== undefined" class="ml-2 font-semibold" :class="item.score >= 6 ? 'text-indigo-500' : 'text-red-400'">
                      {{ item.score.toFixed(1) }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside class="space-y-6">
          <!-- Status das correções -->
          <div
            class="bg-white dark:bg-lousa-800 p-6 rounded-2xl ring-1 ring-school-300 dark:ring-lousa-700"
          >
            <div class="mb-4 flex items-center justify-between">
              <h4
                class="font-bold text-school-800 dark:text-lousa-100 flex items-center gap-2"
              >
                <i class="pi pi-chart-pie text-indigo-500 dark:text-indigo-400"></i>
                Status das correções
              </h4>
              <RouterLink
                to="/submissions"
                class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                Ver todas
              </RouterLink>
            </div>

            <div
              v-if="isLoading"
              class="h-2 w-full rounded-full bg-school-200/60 dark:bg-lousa-700/60 animate-pulse"
            ></div>
            <template v-else>
              <div
                class="flex h-2 w-full overflow-hidden rounded-full bg-school-100 dark:bg-lousa-700"
              >
                <div
                  v-if="statusCounts.success"
                  class="h-full bg-indigo-500"
                  :style="{ width: pct(statusCounts.success) }"
                ></div>
                <div
                  v-if="statusCounts.pending"
                  class="h-full bg-amber-500"
                  :style="{ width: pct(statusCounts.pending) }"
                ></div>
                <div
                  v-if="statusCounts.error"
                  class="h-full bg-red-500"
                  :style="{ width: pct(statusCounts.error) }"
                ></div>
              </div>

              <ul class="mt-4 space-y-2 text-sm">
                <li class="flex items-center justify-between">
                  <span class="flex items-center gap-2 text-school-600 dark:text-lousa-400">
                    <span class="h-2 w-2 rounded-full bg-indigo-500"></span>
                    Concluídas
                  </span>
                  <span class="font-semibold text-school-800 dark:text-lousa-100">
                    {{ statusCounts.success }}
                  </span>
                </li>
                <li class="flex items-center justify-between">
                  <span class="flex items-center gap-2 text-school-600 dark:text-lousa-400">
                    <span class="h-2 w-2 rounded-full bg-amber-500"></span>
                    Pendentes
                  </span>
                  <span class="font-semibold text-school-800 dark:text-lousa-100">
                    {{ statusCounts.pending }}
                  </span>
                </li>
                <li class="flex items-center justify-between">
                  <span class="flex items-center gap-2 text-school-600 dark:text-lousa-400">
                    <span class="h-2 w-2 rounded-full bg-red-500"></span>
                    Com erro
                  </span>
                  <span class="font-semibold text-school-800 dark:text-lousa-100">
                    {{ statusCounts.error }}
                  </span>
                </li>
              </ul>

              <p
                v-if="totalStatus === 0"
                class="mt-3 text-xs text-school-400 dark:text-lousa-500"
              >
                Nenhuma correção registrada ainda.
              </p>
            </template>
          </div>

          <!-- Correções pendentes -->
          <RouterLink
            v-if="!isLoading && pendingCount > 0"
            to="/submissions"
            class="block rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-900/20 p-5 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/30"
          >
            <div class="flex items-start gap-3">
              <i
                class="pi pi-hourglass mt-0.5 text-lg text-amber-600 dark:text-amber-400"
              ></i>
              <div>
                <p class="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  {{ pendingCount }}
                  {{ pendingCount === 1 ? "correção pendente" : "correções pendentes" }}
                </p>
                <p class="text-xs text-amber-700/80 dark:text-amber-400/80">
                  Aguardando processamento da IA. Clique para acompanhar.
                </p>
              </div>
            </div>
          </RouterLink>

          <!-- Guia rápido -->
          <div
            class="bg-white dark:bg-lousa-800 p-6 rounded-2xl ring-1 ring-school-300 dark:ring-lousa-700"
          >
            <div class="mb-3 flex items-center justify-between">
              <h4
                class="font-bold text-school-800 dark:text-lousa-100 flex items-center gap-2"
              >
                <i
                  class="pi pi-lightbulb text-amber-500"
                  style="font-size: 1.3rem"
                ></i>
                Guia rápido
              </h4>
              <button
                type="button"
                @click="showAllTips = !showAllTips"
                class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                {{ showAllTips ? "Ver menos" : "Ver todas" }}
              </button>
            </div>

            <template v-if="!showAllTips">
              <p class="text-sm font-semibold text-school-700 dark:text-lousa-200">
                {{ proximoTip.title }}
              </p>
              <p
                v-if="proximoTip.text"
                class="mt-1 text-sm leading-relaxed text-school-500 dark:text-lousa-400"
              >
                {{ proximoTip.text }}
              </p>
              <RouterLink
                v-if="proximoTip.cta"
                :to="proximoTip.to"
                class="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                {{ proximoTip.cta }}
                <i class="pi pi-arrow-right text-xs"></i>
              </RouterLink>
            </template>

            <ul v-else class="space-y-3">
              <li
                v-for="(dica, index) in dicas"
                :key="index"
                class="flex gap-2 text-sm leading-relaxed text-school-600 dark:text-lousa-400"
              >
                <i class="pi pi-check-circle mt-0.5 shrink-0 text-indigo-500"></i>
                <span>{{ dica }}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
