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
  <div class="sm:ml-64 min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-6xl mx-auto">
      <header class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-bold">
            Minhas <span class="text-indigo-400">Turmas</span>
          </h1>
          <p class="text-gray-400">
            Organize seus alunos e processe gabaritos.
          </p>
        </div>
        <button
          @click="abrirModalCriacao"
          class="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
        >
          + Nova Turma
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
        class="text-center py-20 bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-700"
      >
        <i
          class="pi pi-graduation-cap text-gray-600 mb-4"
          style="font-size: 5rem"
        ></i>
        <h3 class="text-xl text-gray-300">Nenhuma turma por aqui</h3>
        <button
          @click="abrirModalCriacao"
          class="text-indigo-400 mt-4 font-semibold hover:underline"
        >
          Criar minha primeira turma
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
