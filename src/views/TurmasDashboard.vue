<script setup lang="ts">
import { ref, onMounted } from "vue";
import { turmaService } from "@/services/turmas";
import TurmaCard from "@/components/TurmaCard.vue";
import TurmaModal from "@/components/TurmaModal.vue";

const turmas = ref<any[]>([]);
const loading = ref(true);
const isModalOpen = ref(false);
const enviando = ref(false);

const turmaSendoEditada = ref<any>(null);

async function carregarTurmas() {
  try {
    const { data } = await turmaService.getAll();
    turmas.value = data;
  } catch (error) {
    console.error("Erro ao carregar turmas:", error);
  } finally {
    loading.value = false;
  }
}

function abrirModalCriacao() {
  turmaSendoEditada.value = null;
  isModalOpen.value = true;
}

function abrirModalEdicao(turma: any) {
  turmaSendoEditada.value = turma;
  isModalOpen.value = true;
}

function fecharModal() {
  isModalOpen.value = false;
  turmaSendoEditada.value = null;
}

async function handleSalvar(nome: string) {
  enviando.value = true;
  try {
    if (turmaSendoEditada.value) {
      await turmaService.put(turmaSendoEditada.value._id, nome);
    } else {
      await turmaService.create(nome);
    }
    await carregarTurmas();
    fecharModal();
  } catch (error) {
    alert("Erro ao salvar as alterações.");
  } finally {
    enviando.value = false;
  }
}

async function handleExcluir(id: string) {
  if (!confirm("Tem certeza que deseja excluir esta turma?")) return;
  try {
    await turmaService.delete(id);
    turmas.value = turmas.value.filter((t) => t._id !== id);
  } catch (e) {
    alert("Erro ao excluir");
  }
}

onMounted(carregarTurmas);
</script>

<template>
  <div
    class="sm:ml-64 min-h-screen bg-[#0B0F19] text-gray-200 p-6 md:p-10 font-sans"
  >
    <div class="max-w-6xl mx-auto space-y-8">
      <header
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold text-white tracking-tight">
            Suas Turmas
          </h1>
          <p class="text-gray-400 text-sm">
            Gerencie suas classes e acompanhe os gabaritos processados.
          </p>
        </div>
        <button
          @click="abrirModalCriacao"
          class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <i
            class="pi pi-plus text-xs transition-transform group-hover:rotate-90"
          ></i>
          Nova Turma
        </button>
      </header>

      <div
        v-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="h-44 bg-[#111827] ring-1 ring-white/5 rounded-2xl animate-pulse"
        ></div>
      </div>

      <div
        v-else-if="turmas.length === 0"
        class="flex flex-col items-center justify-center py-20 bg-[#111827] ring-1 ring-white/5 rounded-3xl border-dashed border-gray-700/50"
      >
        <div
          class="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6"
        >
          <i class="pi pi-folder-open text-indigo-400 text-3xl"></i>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">
          Nenhuma turma encontrada
        </h3>
        <p class="text-gray-400 text-sm mb-6 max-w-sm text-center">
          Você ainda não cadastrou nenhuma turma. Crie sua primeira turma para
          começar a corrigir gabaritos.
        </p>
        <button
          @click="abrirModalCriacao"
          class="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors flex items-center gap-2"
        >
          <i class="pi pi-plus-circle"></i> Criar primeira turma
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TurmaCard
          v-for="turma in turmas"
          :key="turma._id"
          :turma="turma"
          @delete="handleExcluir"
          @edit="abrirModalEdicao"
        />
      </div>
    </div>

    <TurmaModal
      :is-open="isModalOpen"
      :enviando="enviando"
      :turma-inicial="turmaSendoEditada"
      @close="fecharModal"
      @confirm="handleSalvar"
    />
  </div>
</template>
