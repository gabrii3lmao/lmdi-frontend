<script setup lang="ts">
import { ref, onMounted } from "vue";
import { examService } from "@/services/examService";
import { turmaService } from "@/services/turmas";
import GabaritoOficialModal from "@/components/GabaritoOficialModal.vue";

interface Template {
  _id: string;
  title: string;
  questionsCount: number;
  choicesCount: number;
  createdAt: string;
  classId: string;
}

interface Turma {
  _id: string;
  name: string;
}

const templates = ref<Template[]>([]);
const turmas = ref<Turma[]>([]);
const loading = ref(false);
const enviando = ref(false);

// Controle do Modal e Turma Selecionada
const isModalOpen = ref(false);
const classIdSelecionadaParaNovoGabarito = ref("");

const openModal = () => {
  if (turmas.value.length === 0) return alert("Cadastre uma turma primeiro!");
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  classIdSelecionadaParaNovoGabarito.value = "";
};

const carregarDados = async () => {
  loading.value = true;
  try {
    const resTurmas = await turmaService.getAll();
    turmas.value = resTurmas.data;

    // Busca gabaritos de todas as turmas
    const allTemplates: Template[] = [];
    for (const turma of turmas.value) {
      const resGabaritos = await examService.listarGabaritosMestre(turma._id);
      if (resGabaritos.data) {
        allTemplates.push(...resGabaritos.data);
      }
    }
    templates.value = allTemplates;
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  } finally {
    loading.value = false;
  }
};

/**
 * Esta função é disparada pelo @confirm do seu GabaritoOficialModal
 */
const handleSalvarGabaritoOficial = async (dados: {
  name: string;
  questionCount: number;
  choicesCount: number;
  answerKey: string[];
}) => {
  if (!classIdSelecionadaParaNovoGabarito.value) {
    return alert(
      "Por favor, selecione uma turma antes de confirmar o gabarito.",
    );
  }

  enviando.value = true;
  try {
    await examService.createExam(
      dados.name,
      classIdSelecionadaParaNovoGabarito.value,
      dados.questionCount,
      dados.choicesCount,
      dados.answerKey,
    );

    alert("Gabarito mestre criado com sucesso!");
    closeModal();
    await carregarDados(); // Atualiza a lista da tela
  } catch (error) {
    console.error("Erro ao salvar:", error);
    alert("Falha ao salvar gabarito oficial.");
  } finally {
    enviando.value = false;
  }
};

onMounted(carregarDados);
</script>

<template>
  <div class="sm:ml-64 min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-5xl mx-auto">
      <header class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-bold text-white font-sans">
            Modelos de <span class="text-indigo-400">Prova</span>
          </h1>
          <p class="text-gray-400 mt-1">
            Gerencie os gabaritos oficiais do sistema.
          </p>
        </div>

        <div class="flex items-center gap-4">
          <select
            v-model="classIdSelecionadaParaNovoGabarito"
            class="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>Selecione a Turma...</option>
            <option v-for="t in turmas" :key="t._id" :value="t._id">
              {{ t.name }}
            </option>
          </select>

          <button
            @click="openModal"
            :disabled="!classIdSelecionadaParaNovoGabarito"
            class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2"
          >
            <i class="pi pi-plus"></i> Novo Modelo
          </button>
        </div>
      </header>

      <div
        v-if="templates.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div
          v-for="temp in templates"
          :key="temp._id"
          class="bg-gray-800 border border-gray-700 p-6 rounded-2xl"
        >
          <div class="flex justify-between mb-4">
            <div class="bg-indigo-500/10 p-3 rounded-xl text-indigo-400">
              <i class="pi pi-file-edit text-xl"></i>
            </div>
            <span
              class="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded uppercase font-bold self-start"
            >
              {{ turmas.find((t) => t._id === temp.classId)?.name || "Turma" }}
            </span>
          </div>

          <h3 class="text-lg font-bold mb-1">{{ temp.title }}</h3>
          <p class="text-xs text-gray-500 mb-4">ID: {{ temp._id }}</p>

          <div class="flex gap-4">
            <div
              class="bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-700 text-xs"
            >
              <span class="text-indigo-400 font-bold">{{
                temp.questionsCount
              }}</span>
              Questões
            </div>
            <div
              class="bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-700 text-xs"
            >
              <span class="text-indigo-400 font-bold">{{
                temp.choicesCount
              }}</span>
              Alternativas
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="!loading"
        class="text-center py-20 text-gray-500 border-2 border-dashed border-gray-800 rounded-3xl"
      >
        Nenhum modelo encontrado. Selecione uma turma e crie o primeiro!
      </div>
    </div>

    <GabaritoOficialModal
      :is-open="isModalOpen"
      :enviando="enviando"
      @close="closeModal"
      @confirm="handleSalvarGabaritoOficial"
    />
  </div>
</template>
