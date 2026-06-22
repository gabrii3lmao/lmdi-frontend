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
const dicaAtual = ref(dicas[Math.floor(Math.random() * dicas.length)]);

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

const stats = computed(() => {
  const d = dashboard.value;
  return [
    {
      label: "Turmas Cadastradas",
      value: d?.stats.totalClasses.toString() ?? "0",
      icon: "pi-users",
      color: "text-emerald-500",
      loading: false,
    },
    {
      label: "Gabaritos Mestres",
      value: d?.stats.totalExams.toString() ?? "0",
      icon: "pi-file-check",
      color: "text-emerald-500",
      loading: isLoading.value,
    },
    {
      label: "Correções Realizadas",
      value: d?.stats.totalSubmissions.toString() ?? "0",
      icon: "pi-book",
      color: "text-emerald-500",
      loading: isLoading.value,
    },
  ];
});

const recentActivity = computed(() => dashboard.value?.recentActivity ?? []);

onMounted(() => {
  carregarNomeUsuario();
});
</script>

<template>
  <div
    class="sm:ml-64 min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 p-6 md:p-10 font-sans"
  >
    <div class="max-w-5xl 2xl:max-w-7xl mx-auto space-y-10">
      <header
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            Dashboard
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            Bem-vindo de volta,
            <span class="text-emerald-600 dark:text-emerald-400 font-semibold">{{ name }}</span
            >.
          </p>
        </div>
        <RouterLink
          to="/templates"
          class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all bg-emerald-600 dark:bg-emerald-500 rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-lg shadow-emerald-600/10 active:scale-95"
        >
          <i class="pi pi-plus text-xs"></i>
          Nova Correção
        </RouterLink>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section class="lg:col-span-2 space-y-6">
          <div
            class="flex justify-between items-center border-b border-slate-400 dark:border-slate-600 py-2"
          >
            <h3
              class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"
            >
              <i class="pi pi-book text-emerald-500 dark:text-emerald-400"></i>
              Suas Turmas
            </h3>
            <RouterLink
              to="/classes"
              class="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors"
            >
              Gerenciar Turmas
            </RouterLink>
          </div>

          <div v-if="isLoading" class="space-y-3">
            <div
              v-for="i in 3"
              :key="i"
              class="h-16 bg-slate-200/50 dark:bg-slate-700/40 ring-1 ring-slate-200/80 dark:ring-slate-700/60 rounded-xl animate-pulse"
            ></div>
          </div>

          <div v-else-if="turmas.length > 0" class="space-y-3">
            <RouterLink
              v-for="turma in turmas"
              :key="turma._id"
              :to="`/classes/${turma._id}`"
              class="bg-white dark:bg-slate-800 ring-1 ring-slate-100 dark:ring-slate-700 p-4 rounded-xl flex justify-between items-center hover:ring-emerald-500/30 hover:border-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:shadow-md transition-all group cursor-pointer border border-slate-200 dark:border-slate-700 w-full"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/60 group-hover:scale-105 transition-all"
                >
                  <i class="pi pi-users text-sm"></i>
                </div>
                <div>
                  <h4
                    class="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors"
                  >
                    {{ turma.name }}
                  </h4>
                  <p class="text-xs text-slate-400 dark:text-slate-500">
                    {{ turma.examCount }} {{ turma.examCount === 1 ? "gabarito" : "gabaritos" }}
                    &middot;
                    {{ turma.submissionCount }}
                    {{ turma.submissionCount === 1 ? "correção" : "correções" }}
                  </p>
                </div>
              </div>
              <div
                class="text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all"
              >
                <i class="pi pi-arrow-right"></i>
              </div>
            </RouterLink>
          </div>

          <div
            v-else
            class="bg-white dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-700 border-dashed border-slate-300 dark:border-slate-600 p-10 rounded-2xl text-center flex flex-col items-center justify-center gap-3 shadow-sm"
          >
            <i class="pi pi-inbox text-3xl text-slate-400 dark:text-slate-500"></i>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Nenhuma turma cadastrada ainda.
            </p>
          </div>

          <div
            v-if="recentActivity.length > 0"
            class="border-t border-slate-200 dark:border-slate-700 pt-6"
          >
            <h3
              class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4"
            >
              <i class="pi pi-history text-emerald-500 dark:text-emerald-400"></i>
              Atividade Recente
            </h3>
            <div class="space-y-2">
              <div
                v-for="item in recentActivity"
                :key="item.createdAt"
                class="bg-white dark:bg-slate-800 ring-1 ring-slate-100 dark:ring-slate-700 p-3 rounded-xl flex items-center gap-3 border border-slate-200 dark:border-slate-700"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  :class="{
                    'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400': item.status === 'success',
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
                  <p class="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {{ item.studentName }}
                    <span class="text-slate-400 dark:text-slate-500 font-normal">
                      &mdash; {{ item.examTitle }}
                    </span>
                  </p>
                  <p class="text-xs text-slate-400 dark:text-slate-500">
                    {{ item.className }}
                    <span v-if="item.score !== null && item.score !== undefined" class="ml-2 font-semibold" :class="item.score >= 6 ? 'text-emerald-500' : 'text-red-400'">
                      {{ item.score.toFixed(1) }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside class="space-y-6">
          <div class="grid grid-cols-1 gap-6">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="bg-white dark:bg-slate-800 ring-1 ring-slate-300 dark:ring-slate-700 p-6 rounded-2xl flex items-center gap-5 hover:shadow-md transition-all"
            >
              <div
                class="w-14 h-14 rounded-full flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
              >
                <i
                  :class="['pi text-3xl', stat.icon]"
                  style="font-size: 1.8rem"
                ></i>
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {{ stat.label }}
                </p>
                <h3 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                  {{ isLoading || stat.loading ? "-" : stat.value }}
                </h3>
              </div>
            </div>
          </div>

          <div
            class="bg-gradient-to-br from-slate-50/50 to-slate-200 dark:from-slate-700/40 dark:to-slate-800 p-6 rounded-2xl border border-slate-900/10 dark:border-slate-700 shadow-sm"
          >
            <h4 class="font-bold mb-2 flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <i
                class="pi pi-lightbulb text-amber-500"
                style="font-size: 1.3rem"
              ></i>
              Dica de uso
            </h4>
            <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {{ dicaAtual }}
            </p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
