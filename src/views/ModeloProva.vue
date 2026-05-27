<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast"; // <-- Import Toast
import { useGabaritos } from "@/composables/useGabaritos";
import { examService } from "@/services/examService";
import GabaritoOficialModal from "@/components/Exams/GabaritoOficialModal.vue";
import TemplateCard from "@/components/Exams/TemplateCard.vue";

const toast = useToast(); // <-- Inicia Toast

const { templates, turmas, loading, carregarDados, getTurmaName } =
  useGabaritos();

const enviando = ref(false);
const isModalOpen = ref(false);
const classIdSelecionadaParaNovoGabarito = ref("");

const templateEmEdicao = ref<any>(null);

const openModalParaCriar = () => {
  if (turmas.value.length === 0) {
    toast.add({
      severity: "warn",
      summary: "Aviso",
      detail: "Cadastre uma turma primeiro!",
      life: 4000,
    });
    return;
  }
  templateEmEdicao.value = null;
  isModalOpen.value = true;
};

const handleEdit = (template: any) => {
  templateEmEdicao.value = template;
  classIdSelecionadaParaNovoGabarito.value = template.classId;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  templateEmEdicao.value = null;
  classIdSelecionadaParaNovoGabarito.value = "";
};

const handleDelete = async (id: string) => {
  const confirmacao = window.confirm(
    "Tem certeza que deseja excluir este gabarito? Esta ação não pode ser desfeita.",
  );
  if (!confirmacao) return;

  try {
    await examService.deletarGabarito(id);
    toast.add({
      severity: "success",
      summary: "Excluído",
      detail: "Gabarito deletado com sucesso!",
      life: 3000,
    });
    await carregarDados();
  } catch (error: any) {
    let errorMessage = "Falha ao deletar o gabarito.";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    toast.add({
      severity: "error",
      summary: "Erro",
      detail: errorMessage,
      life: 4000,
    });
  }
};

const handleSalvarGabaritoOficial = async (dados: any) => {
  if (!classIdSelecionadaParaNovoGabarito.value) {
    toast.add({
      severity: "warn",
      summary: "Atenção",
      detail: "Selecione uma turma antes de confirmar.",
      life: 4000,
    });
    return;
  }

  enviando.value = true;
  try {
    if (templateEmEdicao.value) {
      await examService.atualizarGabarito({
        _id: templateEmEdicao.value._id,
        title: dados.name,
        classId: classIdSelecionadaParaNovoGabarito.value,
        questionsCount: dados.questionCount,
        choicesCount: dados.choicesCount,
        answerKey: dados.answerKey,
      });
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Gabarito atualizado com sucesso!",
        life: 3000,
      });
    } else {
      await examService.createExam(
        dados.name,
        classIdSelecionadaParaNovoGabarito.value,
        dados.questionCount,
        dados.choicesCount,
        dados.answerKey,
      );
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Gabarito criado com sucesso!",
        life: 3000,
      });
    }

    closeModal();
    await carregarDados();
  } catch (error: any) {
    let errorMessage = "Falha ao salvar gabarito oficial.";

    // Mesma lógica de extração de erro do Zod
    if (error.response?.data?.errors && error.response.data.errors.length > 0) {
      errorMessage = error.response.data.errors[0].message;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    toast.add({
      severity: "error",
      summary: "Erro",
      detail: errorMessage,
      life: 4000,
    });
  } finally {
    enviando.value = false;
  }
};

onMounted(carregarDados);
</script>

<template>
  <div
    class="sm:ml-64 min-h-screen bg-slate-50 text-slate-700 p-6 md:p-10 font-sans"
  >
    <div class="max-w-6xl mx-auto space-y-8">
      <header
        class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
      >
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">
            Gabaritos Mestres
          </h1>
          <p class="text-slate-500 text-sm">
            Gerencie e crie as referências oficiais para a correção por IA.
          </p>
        </div>

        <div
          class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto"
        >
          <div class="relative w-full sm:w-64">
            <select
              v-model="classIdSelecionadaParaNovoGabarito"
              class="w-full appearance-none bg-white ring-1 ring-slate-200 border border-slate-100 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer shadow-sm"
            >
              <option value="" disabled>1. Selecione uma Turma</option>
              <option v-for="t in turmas" :key="t._id" :value="t._id">
                {{ t.name }}
              </option>
            </select>
            <i
              class="pi pi-chevron-down text-xs absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            ></i>
          </div>

          <button
            @click="openModalParaCriar"
            :disabled="!classIdSelecionadaParaNovoGabarito"
            class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all bg-emerald-600 rounded-xl disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-emerald-700 shadow-lg shadow-emerald-600/10 disabled:shadow-none whitespace-nowrap active:scale-95"
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
          class="h-48 bg-slate-200/50 ring-1 ring-slate-200/80 rounded-2xl animate-pulse"
        ></div>
      </div>

      <div
        v-else-if="templates.length === 0"
        class="flex flex-col items-center justify-center py-20 bg-white ring-1 ring-slate-200/80 rounded-3xl border border-dashed border-slate-300 shadow-sm text-center px-4"
      >
        <div
          class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4"
        >
          <i class="pi pi-file-check text-2xl"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-1">
          Nenhum gabarito mestre
        </h3>
        <p class="text-slate-500 text-sm max-w-xs font-medium">
          Selecione uma turma e clique em "Novo Modelo" para criar a prova de
          referência.
        </p>
      </div>

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
