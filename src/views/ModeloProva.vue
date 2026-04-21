<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useGabaritos } from "@/composables/useGabaritos";
import { examService } from "@/services/examService";
import GabaritoOficialModal from "@/components/GabaritoOficialModal.vue";
import TemplateCard from "@/components/TemplateCard.vue";

const { templates, turmas, loading, carregarDados, getTurmaName } =
  useGabaritos();

const enviando = ref(false);
const isModalOpen = ref(false);
const classIdSelecionadaParaNovoGabarito = ref("");

// NOVO: Controle de estado para edição
const templateEmEdicao = ref<any>(null);

const openModalParaCriar = () => {
  if (turmas.value.length === 0) return alert("Cadastre uma turma primeiro!");
  templateEmEdicao.value = null; // Limpa edição anterior
  isModalOpen.value = true;
};

// NOVO: Função para abrir modal em modo de edição
const handleEdit = (template: any) => {
  templateEmEdicao.value = template;
  classIdSelecionadaParaNovoGabarito.value = template.classId; // Já seleciona a turma correta no select
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  templateEmEdicao.value = null;
  classIdSelecionadaParaNovoGabarito.value = "";
};

// NOVO: Função para deletar
const handleDelete = async (id: string) => {
  const confirmacao = window.confirm(
    "Tem certeza que deseja excluir este gabarito? Esta ação não pode ser desfeita.",
  );
  if (!confirmacao) return;

  try {
    await examService.deletarGabarito(id);
    alert("Gabarito deletado com sucesso!");
    await carregarDados(); // Atualiza a tela
  } catch (error) {
    console.error("Erro ao deletar:", error);
    alert("Falha ao deletar o gabarito.");
  }
};

const handleSalvarGabaritoOficial = async (dados: any) => {
  if (!classIdSelecionadaParaNovoGabarito.value) {
    return alert(
      "Por favor, selecione uma turma antes de confirmar o gabarito.",
    );
  }

  enviando.value = true;
  try {
    // Se temos um template em edição, atualizamos. Se não, criamos.
    if (templateEmEdicao.value) {
      await examService.atualizarGabarito({
        _id: templateEmEdicao.value._id,
        title: dados.name,
        classId: classIdSelecionadaParaNovoGabarito.value,
        questionsCount: dados.questionCount,
        choicesCount: dados.choicesCount,
        answerKey: dados.answerKey,
      });
      alert("Gabarito mestre atualizado com sucesso!");
    } else {
      await examService.createExam(
        dados.name,
        classIdSelecionadaParaNovoGabarito.value,
        dados.questionCount,
        dados.choicesCount,
        dados.answerKey,
      );
      alert("Gabarito mestre criado com sucesso!");
    }

    closeModal();
    await carregarDados();
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
            <i
              class="pi pi-chevron-down text-xs absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            ></i>
          </div>

          <button
            @click="openModalParaCriar"
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
      ></div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TemplateCard
          v-for="temp in templates"
          :key="temp._id"
          :template="temp"
          :turmaName="getTurmaName(temp.classId)"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>

    <GabaritoOficialModal
      :is-open="isModalOpen"
      :enviando="enviando"
      :initial-data="templateEmEdicao"
      @close="closeModal"
      @confirm="handleSalvarGabaritoOficial"
    />
  </div>
</template>
