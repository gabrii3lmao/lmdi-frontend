<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { RouterLink } from "vue-router";
import { turmaService } from "@/services/turmas";
import { submissionService } from "@/services/submissionService";

interface Turma {
  _id: string;
  name: string;
}

// Estados
const loading = ref(true);
const name = ref("Professor");
const turmas = ref<Turma[]>([]);
const totalSubmissoes = ref(0);

const stats = computed(() => [
  {
    label: "Turmas Cadastradas",
    value: turmas.value.length.toString(),
    icon: "pi-users",
    color: "text-emerald-500",
  },
  {
    label: "Correções Feitas",
    value: totalSubmissoes.value.toString(),
    icon: "pi-book",
    color: "text-emerald-500",
  },
]);

// Funções Auxiliares
function carregarNomeUsuario() {
  const savedName = localStorage.getItem("username");
  if (savedName) {
    const firstName = savedName.trim().split(" ")[0];
    name.value =
      (firstName as string).charAt(0).toUpperCase() +
      (firstName as string).slice(1).toLowerCase();
  }
}

const dicas = [
  "Organize seus alunos criando as turmas primeiro. Depois, basta criar um gabarito mestre vinculado a essa turma para iniciar a correção por IA.",
  "Ao criar um gabarito, certifique-se de que o número de questões e o número de alternativas estejam corretos.",
  "Para cada turma, você pode criar um gabarito mestre e diversos modelos de provas. Não há um limite de questões ou alternativas, nem de alunos!",
  "Quando for tirar a foto de um modelo de prova, certifique-se de que a foto esteja bem iluminada e que as questões estejam legíveis.",
  "Ao clicar em um dos botões de 'Ver Provas' você será redirecionado para a página de provas da turma"
]

async function carregarDadosDashboard() {
  loading.value = true;

  try {
    const responseTurmas = await turmaService.getAll();
    turmas.value = responseTurmas.data.reverse();

    if (turmas.value.length > 0) {
      const promisesSubmissoes = turmas.value.map((turma) =>
        submissionService.getSubmissionsByClass(turma._id),
      );

      const responses = await Promise.all(promisesSubmissoes);
      totalSubmissoes.value = responses.reduce(
        (acumulador, response) => acumulador + (response.data?.length || 0),
        0,
      );
    }
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
  } finally {
    loading.value = false;
  }
}

// Ciclo de Vida
onMounted(() => {
  carregarNomeUsuario();
  carregarDadosDashboard(); // Uma única chamada limpa que cuida de tudo
});
</script>

<template>
  <div
    class="sm:ml-64 min-h-screen bg-slate-50 text-slate-700 p-6 md:p-10 font-sans"
  >
    <div class="max-w-5xl mx-auto space-y-10">
      <header
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold text-emerald-600 tracking-tight">
            Dashboard
          </h1>
          <p class="text-slate-500 text-sm">
            Bem-vindo de volta,
            <span class="text-emerald-600 font-semibold">{{ name }}</span
            >.
          </p>
        </div>
        <RouterLink
          to="/templates"
          class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-lg shadow-emerald-600/10 active:scale-95"
        >
          <i class="pi pi-plus text-xs"></i>
          Nova Correção
        </RouterLink>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section class="lg:col-span-2 space-y-6">
          <div
            class="flex justify-between items-center border-b border-slate-400 py-2"
          >
            <h3
              class="text-lg font-bold text-slate-800 flex items-center gap-2"
            >
              <i class="pi pi-book text-emerald-500"></i>
              Suas Turmas
            </h3>
            <RouterLink
              to="/classes"
              class="text-sm text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
            >
              Gerenciar Turmas
            </RouterLink>
          </div>

          <div v-if="loading" class="space-y-3">
            <div
              v-for="i in 3"
              :key="i"
              class="h-16 bg-slate-200/50 ring-1 ring-slate-200/80 rounded-xl animate-pulse"
            ></div>
          </div>

          <div v-else-if="turmas.length > 0" class="space-y-3">
            <!-- O RouterLink agora é o card principal -->
            <RouterLink
              v-for="turma in turmas"
              :key="turma._id"
              :to="`/classes/${turma._id}`"
              class="bg-white ring-1 ring-slate-100 p-4 rounded-xl flex justify-between items-center hover:ring-emerald-500/30 hover:border-emerald-300 hover:bg-slate-50 hover:shadow-md transition-all group cursor-pointer border border-slate-400 w-full"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 group-hover:scale-105 transition-all"
                >
                  <i class="pi pi-users text-sm"></i>
                </div>
                <h4
                  class="font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors"
                >
                  {{ turma.name }}
                </h4>
              </div>
              <div
                class="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all"
              >
                <i class="pi pi-arrow-right"></i>
              </div>
            </RouterLink>
          </div>

          <div
            v-else
            class="bg-white ring-1 ring-slate-200/80 border-dashed border-slate-300 p-10 rounded-2xl text-center flex flex-col items-center justify-center gap-3 shadow-sm"
          >
            <i class="pi pi-inbox text-3xl text-slate-400"></i>
            <p class="text-slate-500 text-sm font-medium">
              Nenhuma turma cadastrada ainda.
            </p>
          </div>
        </section>

        <aside class="space-y-6">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="bg-white ring-1 ring-slate-300 p-6 rounded-2xl flex items-center gap-5 hover:shadow-md transition-all"
          >
            <div
              class="w-14 h-14 rounded-full flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600"
            >
              <i :class="['pi text-3xl', stat.icon]" style="font-size: 1.8rem"></i>
            </div>  
            <div>
              <p class="text-sm font-semibold text-slate-500 mb-1">
                {{ stat.label }}
              </p>
              <h3 class="text-3xl font-extrabold text-slate-800 tracking-tight">
                {{ loading ? "-" : stat.value }}
              </h3>
            </div>
          </div>

          <div
            class="bg-gradient-to-br from-slate-50/50 to-slate-200 p-6 rounded-2xl border border-slate-900/10 shadow-sm"
          >
            <h4 class="font-bold mb-2 flex items-center gap-2 text-slate-800">
              <i class="pi pi-lightbulb text-amber-500" style="font-size: 1.3rem" ></i>
              Dica de uso
            </h4>
            <p class="text-sm text-slate-600 leading-relaxed font-medium">
              {{ dicas[Math.floor(Math.random() * dicas.length)] }}
            </p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
