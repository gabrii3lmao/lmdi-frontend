<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/services/api";

interface Turma {
  _id: string;
  nome: string;
  descricao: string;
  totalProvas: number; // Mudança: Provas são mais relevantes que número de alunos no seu fluxo
}

const turmas = ref<Turma[]>([]);
const loading = ref(true);

async function fetchTurmas() {
  try {
    const response = await api.get("/classes"); // endpoint do seu schema de Class
    turmas.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar turmas:", error);
  } finally {
    loading.value = false;
  }
}

// Simulação de remoção
async function handleRemove(id: string) {
  if (
    confirm(
      "Tem certeza que deseja excluir esta turma? Todas as provas associadas serão perdidas.",
    )
  ) {
    try {
      // await api.delete(`/classes/${id}`);
      turmas.value = turmas.value.filter((t) => t._id !== id);
    } catch (e) {
      alert("Erro ao excluir");
    }
  }
}

onMounted(fetchTurmas);
</script>

<template>
  <div class="sm:ml-64 min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-6xl mx-auto">
      <header
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10"
      >
        <div>
          <h1 class="text-3xl font-bold text-white">
            Minhas <span class="text-indigo-400">Turmas</span>
          </h1>
          <p class="text-gray-400">
            Organize seus alunos e processe gabaritos por grupo.
          </p>
        </div>

        <button
          class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-all px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <span class="text-xl">+</span>
          <span>Nova Turma</span>
        </button>
      </header>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="i in 3"
          :key="i"
          class="h-48 bg-gray-800 rounded-2xl animate-pulse border border-gray-700"
        ></div>
      </div>

      <div
        v-else-if="turmas.length === 0"
        class="flex flex-col items-center justify-center py-20 bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-700"
      >
        <div class="text-6xl mb-4"> <i class="pi pi-graduation-cap" style="font-size: 5rem;"></i> </div>
        <h3 class="text-xl font-medium text-gray-300">
          Nenhuma turma por aqui
        </h3>
        <p class="text-gray-500 mb-6">
          Comece criando sua primeira turma para organizar as provas.
        </p>
        <button class="text-indigo-400 hover:text-indigo-300 font-medium">
          Criar turma agora
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="turma in turmas"
          :key="turma._id"
          class="group bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div class="flex justify-between items-start mb-2">
              <div
                class="p-3 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors text-2xl"
              >
                📚
              </div>
              <button
                @click="handleRemove(turma._id)"
                class="text-gray-600 hover:text-red-400 transition-colors p-1"
              >
                🗑️
              </button>
            </div>

            <h3
              class="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors"
            >
              {{ turma.nome }}
            </h3>
            <p class="text-sm text-gray-400 mt-2 line-clamp-2">
              {{ turma.descricao || "Sem descrição definida para esta turma." }}
            </p>
          </div>

          <div class="mt-8">
            <div
              class="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-750"
            >
              <span
                >Provas Corrigidas:
                <b class="text-gray-300">{{ turma.totalProvas || 0 }}</b></span
              >
            </div>

            <div class="flex gap-2">
              <button
                class="flex-1 bg-gray-700 hover:bg-indigo-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all"
              >
                Abrir Turma
              </button>
              <button
                title="Nova correção rápida"
                class="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white p-2 rounded-lg transition-all"
              >
                📝
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
