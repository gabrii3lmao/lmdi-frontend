<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/services/api";

const loading = ref(true);
const name = ref("");

// Simulação de estatísticas (Você buscará isso do seu novo schema Exam/Submission)
const stats = ref([
  { label: "Turmas Ativas", value: "4", icon: "🏫" },
  { label: "Provas Corrigidas", value: "128", icon: "📝" },
  { label: "Média de Acertos", value: "74%", icon: "📊" },
]);

// Simulação de atividades recentes (tirar depois)
const recentExams = ref([
  {
    _id: "1",
    title: "Simulado Matemática",
    className: "1º Ano A",
    date: "Hoje",
    status: "graded",
  },
  {
    _id: "2",
    title: "Prova de História",
    className: "2º Ano B",
    date: "Ontem",
    status: "processing",
  },
]);

onMounted(() => {
  const savedName = localStorage.getItem("username");
  if (savedName) {
    const firstName = savedName.split(" ")[0];
    name.value = firstName!.charAt(0).toUpperCase() + firstName!.slice(1);
  } else {
    name.value = "Professor";
  }

  // Simular carregamento
  setTimeout(() => (loading.value = false), 800);
});
</script>

<template>
  <div class="sm:ml-64 min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-5xl mx-auto">
      <header class="mb-10 flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-bold text-indigo-400">Dashboard</h1>
          <p class="text-gray-400">
            Bem-vindo de volta, {{ name }}. O que vamos corrigir hoje?
          </p>
        </div>
        <RouterLink
        to="/classes"
          class="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          <span>+</span> Nova Correção
        </RouterLink>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-xl"
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
            <router-link
              to="/turmas"
              class="text-indigo-400 text-sm hover:underline"
              >Ver todas</router-link
            >
          </div>

          <div v-if="loading" class="space-y-4">
            <div
              v-for="i in 2"
              :key="i"
              class="h-24 bg-gray-800 rounded-2xl animate-pulse"
            ></div>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="exam in recentExams"
              :key="exam._id"
              class="bg-gray-800 p-5 rounded-2xl border border-gray-700 flex justify-between items-center hover:border-indigo-500/50 transition-all cursor-pointer group"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-xl group-hover:bg-indigo-900/30 transition-colors"
                >
                  📄
                </div>
                <div>
                  <h4 class="font-bold text-gray-100">{{ exam.title }}</h4>
                  <p class="text-sm text-gray-400">
                    {{ exam.className }} • {{ exam.date }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <span
                  v-if="exam.status === 'graded'"
                  class="bg-green-900/30 text-green-400 text-xs px-3 py-1 rounded-full border border-green-800/50"
                  >Concluído</span
                >
                <span
                  v-else
                  class="bg-yellow-900/30 text-yellow-400 text-xs px-3 py-1 rounded-full border border-yellow-800/50"
                  >Processando</span
                >
              </div>
            </div>
          </div>
        </section>

        <aside class="space-y-6">
          <div
            class="bg-gradient-to-br from-indigo-900/40 to-gray-800 p-6 rounded-2xl border border-indigo-500/20"
          >
            <h4 class="font-bold mb-2">Dica de mestre 💡</h4>
            <p class="text-sm text-indigo-200/70 leading-relaxed">
              Para fotos melhores, coloque o gabarito em superfícies escuras.
              Isso ajuda nosso motor de IA a detectar as bordas rapidamente!
            </p>
          </div>

          <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h4 class="font-bold mb-4 text-gray-100 text-sm uppercase">
              Links Rápidos
            </h4>
            <nav class="space-y-3">
              <a
                href="#"
                class="block text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                >📥 Baixar Modelo PDF</a
              >
              <a
                href="#"
                class="block text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                >📑 Gerar Relatórios</a
              >
              <a
                href="#"
                class="block text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                >⚙️ Configurações</a
              >
            </nav>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Adicione transições suaves para os cards */
.bg-gray-800 {
  transition: transform 0.2s ease-in-out;
}
.bg-gray-800:hover {
  transform: translateY(-2px);
}
</style>
