<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { RouterLink } from "vue-router";
import { turmaService } from "@/services/turmas";
import { submissionService } from "@/services/submissionService";
import { examService } from "@/services/examService";
import { useQuery } from "@tanstack/vue-query";

interface Turma {
  _id: string;
  name: string;
}

// Estados
const name = ref("Professor");

// Dicas (Transformado em ref para não mudar aleatoriamente quando os dados carregarem)
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

// 1. Busca as turmas usando a mesma chave das outras telas (Cache Compartilhado)
const { data: turmasData, isLoading: loading } = useQuery({
  queryKey: ["turmas"],
  queryFn: async () => {
    const { data } = await turmaService.getAll(1, 100);
    const paginated = data as any;
    return (paginated?.data || paginated || []) as Turma[];
  },
  placeholderData: [],
});

// Inverte a ordem apenas para a visualização do Dashboard, usando uma cópia para não mutar o cache
const turmas = computed(() => {
  const list = turmasData.value || [];
  return [...list].reverse();
});

// 2. Busca as submissões APENAS quando as turmas terminarem de carregar (Query Dependente)
const { data: totalSubmissoes, isFetching: carregandoSubmissoes } = useQuery({
  // A chave da query inclui os IDs das turmas, se criar turma nova, ele recalcula as submissões!
  queryKey: [
    "dashboard-submissoes",
    computed(() => (turmasData.value || []).map((t: Turma) => t._id).join(",")),
  ],
  queryFn: async () => {
    const list = turmasData.value || [];
    const promises = list.map((turma: Turma) =>
      submissionService.getSubmissionsByClass(turma._id),
    );
    const responses = await Promise.all(promises);
    return responses.reduce((acc, res) => acc + (res.data?.length || 0), 0);
  },
  // O Vue Query só executa essa requisição se existirem turmas
  enabled: computed(() => (turmasData.value || []).length > 0),
  placeholderData: 0,
});

const { data: totalExames, isFetching: carregandoExames } = useQuery({
  queryKey: [
    "dashboard-exames",
    computed(() => (turmasData.value || []).map((t: Turma) => t._id).join(",")),
  ],
  queryFn: async () => {
    const list = turmasData.value || [];
    const promises = list.map((turma: Turma) =>
      examService.listarGabaritosMestre(turma._id),
    );
    const responses = await Promise.all(promises);
    return responses.reduce((acc, res: any) => {
      const data = res.data?.data || res.data || [];
      return acc + data.length;
    }, 0);
  },
  enabled: computed(() => (turmasData.value || []).length > 0),
  placeholderData: 0,
});

const stats = computed(() => [
  {
    label: "Turmas Cadastradas",
    value: turmas.value.length.toString(),
    icon: "pi-users",
    color: "text-emerald-500",
    loading: false,
  },
  {
    label: "Gabaritos Mestres",
    value: (totalExames.value ?? 0).toString(),
    icon: "pi-file-check",
    color: "text-emerald-500",
    loading: carregandoExames.value,
  },
  {
    label: "Correções Realizadas",
    value: (totalSubmissoes.value ?? 0).toString(),
    icon: "pi-book",
    color: "text-emerald-500",
    loading: carregandoSubmissoes.value,
  },
]);

// Ciclo de Vida
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

          <div v-if="loading" class="space-y-3">
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
                <h4
                  class="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors"
                >
                  {{ turma.name }}
                </h4>
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
                  {{ loading || stat.loading ? "-" : stat.value }}
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
