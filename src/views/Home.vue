<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { turmaService } from "@/services/turmas";
import { RouterLink } from "vue-router";

interface Turma {
  _id: string;
  name: string;
}

const loading = ref(true);
const name = ref("");
const turmas = ref<Turma[]>([]);

// Única estatística real com base nos dados que temos da API
const stats = computed(() => [
  {
    label: "Turmas Cadastradas",
    value: turmas.value.length.toString(),
    icon: "pi-users",
    color: "text-indigo-400",
  },
]);

async function carregarTurmas() {
  try {
    loading.value = true;
    const response = await turmaService.getAll();
    turmas.value = response.data;
    turmas.value.reverse();
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
      (firstName as string).charAt(0).toUpperCase() + (firstName as string).slice(1).toLowerCase();
  } else {
    name.value = "Professor";
  }

  carregarTurmas();
});
</script>

<template>
  <div
    class="sm:ml-64 min-h-screen bg-[#0B0F19] text-gray-200 p-6 md:p-10 font-sans"
  >
    <div class="max-w-5xl mx-auto space-y-10">
      <header
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold text-white tracking-tight">
            Dashboard
          </h1>
          <p class="text-gray-400 text-sm">
            Bem-vindo de volta,
            <span class="text-indigo-400 font-semibold">{{ name }}</span
            >.
          </p>
        </div>
        <RouterLink
          to="/templates"
          class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <i class="pi pi-plus text-xs"></i>
          Nova Correção
        </RouterLink>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section class="lg:col-span-2 space-y-6">
          <div class="flex justify-between items-center">
            <h3
              class="text-lg font-semibold text-white flex items-center gap-2"
            >
              <i class="pi pi-book text-indigo-400"></i>
              Suas Turmas
            </h3>
            <RouterLink
              to="/classes"
              class="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Gerenciar Turmas
            </RouterLink>
          </div>

          <div v-if="loading" class="space-y-3">
            <div
              v-for="i in 3"
              :key="i"
              class="h-16 bg-[#111827] ring-1 ring-white/5 rounded-xl animate-pulse"
            ></div>
          </div>

          <div v-else-if="turmas.length > 0" class="space-y-3">
            <div
              v-for="turma in turmas"
              :key="turma._id"
              class="bg-[#111827] ring-1 ring-white/5 p-4 rounded-xl flex justify-between items-center hover:ring-indigo-500/50 hover:bg-white/[0.02] transition-all group cursor-pointer"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors"
                >
                  <i class="pi pi-users"></i>
                </div>
                <h4 class="font-medium text-gray-200">{{ turma.name }}</h4>
              </div>
              <RouterLink
                :to="`/classes/${turma._id}`"
                class="p-2 text-gray-500 hover:text-indigo-400 transition-colors"
              >

                <i class="pi pi-arrow-right"></i>
              </RouterLink>
            </div>
          </div>

          <div
            v-else
            class="bg-[#111827] ring-1 ring-white/5 border-dashed border-gray-700 p-10 rounded-2xl text-center flex flex-col items-center justify-center gap-3"
          >
            <i class="pi pi-inbox text-3xl text-gray-600"></i>
            <p class="text-gray-400 text-sm">Nenhuma turma cadastrada ainda.</p>
          </div>
        </section>

        <aside class="space-y-6">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="bg-[#111827] ring-1 ring-white/5 p-6 rounded-2xl flex items-center gap-5 hover:ring-white/10 transition-all"
          >
            <div
              class="w-14 h-14 rounded-full flex items-center justify-center shrink-0 bg-indigo-500/10 text-indigo-400"
            >
              <i :class="['pi text-3xl', stat.icon]"></i>
            </div>
            <div>
              <p class="text-lg font-medium text-gray-500 mb-1">
                {{ stat.label }}
              </p>
              <h3 class="text-3xl font-bold text-white tracking-tight">
                {{ loading ? "-" : stat.value }}
              </h3>
            </div>
          </div>

          <div
            class="bg-gradient-to-br from-indigo-900/40 to-[#111827] p-6 rounded-2xl border border-indigo-500/20"
          >
            <h4 class="font-bold mb-2 flex items-center gap-2 text-white">
              <i class="pi pi-lightbulb text-amber-400"></i>
              Dica de uso
            </h4>
            <p class="text-sm text-gray-400 leading-relaxed">
              Organize seus alunos criando as turmas primeiro. Depois, basta
              criar um gabarito mestre vinculado a essa turma para iniciar a
              correção por IA.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
