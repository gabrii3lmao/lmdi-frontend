<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
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

    const promisesGabaritos = turmas.value.map(async (turma) => {
      const res = await examService.listarGabaritosMestre(turma._id);
      return res.data || [];
    });

    const resultadosArray = await Promise.all(promisesGabaritos);

    // Junta todos os arrays que voltaram em uma lista única
    templates.value = resultadosArray.flat();
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  } finally {
    loading.value = false;
  }
};

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

const getTurmaName = (classId: string) => {
  return (
    turmas.value.find((t) => t._id === classId)?.name || "Turma não encontrada"
  );
};
</script>

<template>
  <div
    class="sm:ml-64 min-h-screen bg-[#0B0F19] text-gray-200 p-6 md:p-10 font-sans"
  >
    <div class="max-w-6xl mx-auto space-y-8">
      <header
        class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
      >
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold text-white tracking-tight">
            Gabaritos Mestres
          </h1>
          <p class="text-gray-400 text-sm">
            Gerencie e crie as referências oficiais para a correção por IA.
          </p>
        </div>

        <div
          class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto"
        >
          <div class="relative w-full sm:w-64">
            <select
              v-model="classIdSelecionadaParaNovoGabarito"
              class="w-full appearance-none bg-[#111827] ring-1 ring-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="" disabled>1. Selecione uma Turma</option>
              <option v-for="t in turmas" :key="t._id" :value="t._id">
                {{ t.name }}
              </option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400"
            >
              <i class="pi pi-chevron-down text-xs"></i>
            </div>
          </div>

          <button
            @click="openModal"
            :disabled="!classIdSelecionadaParaNovoGabarito"
            class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all bg-indigo-600 rounded-xl disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 disabled:shadow-none whitespace-nowrap"
          >
            <i
              class="pi pi-plus text-xs transition-transform group-hover:rotate-90"
            ></i>
            2. Novo Modelo
          </button>
        </div>
      </header>

      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="h-48 bg-[#111827] ring-1 ring-white/5 rounded-2xl animate-pulse"
        ></div>
      </div>

      <div
        v-else-if="templates.length === 0"
        class="flex flex-col items-center justify-center py-24 bg-[#111827] ring-1 ring-white/5 rounded-3xl border-dashed border-gray-700/50"
      >
        <div
          class="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6"
        >
          <i class="pi pi-file-excel text-indigo-400 text-3xl"></i>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">
          Nenhum gabarito configurado
        </h3>
        <p class="text-gray-400 text-sm max-w-md text-center">
          Selecione uma turma no menu acima e crie o seu primeiro gabarito
          oficial para que a inteligência artificial possa começar as correções.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="temp in templates"
          :key="temp._id"
          class="group bg-[#111827] ring-1 ring-white/5 p-6 rounded-2xl hover:ring-indigo-500/50 hover:bg-white/[0.02] transition-all duration-300 flex flex-col justify-between"
        >
          <div class="flex justify-between items-start mb-6">
            <div
              class="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
            >
              <i class="pi pi-file-check text-xl"></i>
            </div>

            <div
              class="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg max-w-[150px]"
            >
              <p
                class="text-xs font-semibold text-gray-300 truncate"
                :title="getTurmaName(temp.classId)"
              >
                {{ getTurmaName(temp.classId) }}
              </p>
            </div>
          </div>

          <div class="mb-6">
            <h3
              class="text-lg font-bold text-white line-clamp-2 group-hover:text-indigo-400 transition-colors"
            >
              {{ temp.title }}
            </h3>
            <p
              class="text-xs text-gray-500 mt-2 font-mono uppercase tracking-wider"
            >
              REF: #{{ temp._id.slice(-5) }}
            </p>
          </div>

          <div class="flex gap-3">
            <div
              class="flex-1 bg-[#0B0F19] ring-1 ring-white/5 px-3 py-2.5 rounded-xl flex flex-col items-center justify-center"
            >
              <span
                class="text-indigo-400 font-bold text-lg leading-none mb-1"
                >{{ temp.questionsCount }}</span
              >
              <span
                class="text-[10px] text-gray-500 uppercase font-bold tracking-wider"
                >Questões</span
              >
            </div>
            <div
              class="flex-1 bg-[#0B0F19] ring-1 ring-white/5 px-3 py-2.5 rounded-xl flex flex-col items-center justify-center"
            >
              <span class="text-indigo-400 font-bold text-lg leading-none mb-1"
                >A-{{ String.fromCharCode(64 + temp.choicesCount) }}</span
              >
              <span
                class="text-[10px] text-gray-500 uppercase font-bold tracking-wider"
                >Alternativas</span
              >
            </div>
          </div>
        </div>
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
