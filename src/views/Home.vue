<script setup lang="ts">
import { ref, onMounted } from "vue";
import { turmaService } from "@/services/turmas";
import { RouterLink } from "vue-router";

interface Turma {
  _id: string;
  name: string;
}

const loading = ref(true);
const name = ref("");
const recentExams = ref<Turma[]>([]); // Renomeado para coincidir com o template

const stats = ref([
  { label: "Turmas Ativas", value: "4", icon: "🏫" },
  { label: "Provas Corrigidas", value: "128", icon: "📝" },
  { label: "Média de Acertos", value: "74%", icon: "📊" },
]);

async function carregarTurmas() {
  try {
    loading.value = true;
    const response = await turmaService.getAll();
    recentExams.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar turmas:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const savedName = localStorage.getItem("username");
  if (savedName) {
    const firstName = savedName.trim().split(" ")[0];
    name.value =
      firstName!.charAt(0).toUpperCase() + firstName!.slice(1).toLowerCase();
  } else {
    name.value = "Professor";
  }

  carregarTurmas();
});
</script>

<template>
  <div class="sm:ml-64 min-h-screen bg-gray-900 text-white p-4 md:p-8">
    <div class="max-w-5xl mx-auto">
      <header
        class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-indigo-400">Dashboard</h1>
          <p class="text-gray-400">
            Bem-vindo de volta, <span class="text-indigo-200">{{ name }}</span
            >. O que vamos corrigir hoje?
          </p>
        </div>
        <RouterLink
          to="/classes"
          class="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 active:scale-95"
        >
          <i class="pi pi-plus"></i> Nova Correção
        </RouterLink>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-xl hover:border-indigo-500/30 transition-colors"
        >
          <div class="text-2xl mb-2">{{ stat.icon }}</div>
          <div
            class="text-gray-400 text-sm font-medium uppercase tracking-wider"
          >
            {{ stat.label }}
          </div>
          <div class="text-3xl font-bold text-white">{{ stat.value }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section class="lg:col-span-2">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-gray-100">
              Atividades Recentes
            </h3>
            <RouterLink
              to="/classes"
              class="text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
            >
              Ver todas
            </RouterLink>
          </div>

          <div v-if="loading" class="space-y-4">
            <div
              v-for="i in 3"
              :key="i"
              class="h-24 bg-gray-800 rounded-2xl animate-pulse border border-gray-700"
            ></div>
          </div>

          <div v-else-if="recentExams.length > 0" class="space-y-4">
            <div
              v-for="exam in recentExams"
              :key="exam._id"
              class="card-item bg-gray-800 p-5 rounded-2xl border border-gray-700 flex justify-between items-center hover:border-indigo-500/50 transition-all cursor-pointer group"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-xl group-hover:bg-indigo-900/40 transition-colors"
                >
                  <i class="pi pi-users" style="font-size: 1.5rem"></i>
                </div>
                <div>
                  <h4
                    class="font-bold text-gray-100 group-hover:text-indigo-400 transition-colors"
                  >
                    {{ exam.name || "Sem título" }}
                  </h4>
                </div>
              </div>

              <div class="text-right">
                <RouterLink
                  :to="`/classes/${exam._id}`"
                  class="inline-flex items-center gap-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-indigo-500/20 hover:border-indigo-500 active:scale-95"
                >
                  Ir para a turma
                  <i class="pi pi-arrow-right text-xs"></i>
                </RouterLink>
              </div>
            </div>
          </div>

          <div
            v-else
            class="bg-gray-800/50 border border-dashed border-gray-700 p-10 rounded-2xl text-center"
          >
            <p class="text-gray-500">Nenhuma atividade encontrada.</p>
          </div>
        </section>

        <aside class="space-y-6"></aside>
      </div>
    </div>
  </div>
</template>
