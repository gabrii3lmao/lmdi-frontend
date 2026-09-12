<script setup lang="ts">
import { ref, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useQueryClient } from "@tanstack/vue-query"; // <-- Importado para invalidar o cache
import { useGabaritos } from "@/composables/useGabaritos";
import { examService } from "@/services/examService";
import GabaritoOficialModal from "@/components/Exams/GabaritoOficialModal.vue";
import TemplateCard from "@/components/Exams/TemplateCard.vue";
import { useConfirm } from "primevue/useconfirm"; // Opcional: Para manter o padrão do PrimeVue nos deletes

const toast = useToast();
const confirm = useConfirm();
const queryClient = useQueryClient(); // <-- Inicializa o client

// 1. Não importamos mais o `carregarDados`
  const { templates, turmas, loading, getTurmaName } = useGabaritos();

  const templatesList = computed(() => templates.value ?? []);

const enviando = ref(false);
const isModalOpen = ref(false);
const classIdSelecionadaParaNovoGabarito = ref("");

const templateEmEdicao = ref<any>(null);

const openModalParaCriar = () => {
  if (!turmas.value || turmas.value.length === 0) {
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

const handleDelete = (id: string) => {
  // Opcional: Mudei para o ConfirmDialog do PrimeVue para combinar com o design das turmas
  confirm.require({
    message:
      "Tem certeza que deseja excluir este gabarito? Esta ação não pode ser desfeita.",
    header: "Confirmação de Exclusão",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "Sim, Excluir",
    rejectLabel: "Cancelar",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await examService.deletarGabarito(id);

        // 2. Invalida a query em vez de chamar carregarDados manualmente
        queryClient.invalidateQueries({ queryKey: ["todos-gabaritos"] });
        // (Opcional) invalida os específicos de uma turma
        queryClient.invalidateQueries({ queryKey: ["provas"] });

        toast.add({
          severity: "success",
          summary: "Excluído",
          detail: "Gabarito deletado com sucesso!",
          life: 3000,
        });
      } catch (error: any) {
        let errorMessage =
          error.response?.data?.message || "Falha ao deletar o gabarito.";
        toast.add({
          severity: "error",
          summary: "Erro",
          detail: errorMessage,
          life: 4000,
        });
      }
    },
  });
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

    // 3. Invalida o cache geral e o específico da turma modificada
    queryClient.invalidateQueries({ queryKey: ["todos-gabaritos"] });
    queryClient.invalidateQueries({
      queryKey: ["provas", classIdSelecionadaParaNovoGabarito.value],
    });

    closeModal();
  } catch (error: any) {
    let errorMessage = "Falha ao salvar gabarito oficial.";
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

// 4. O onMounted FOI APAGADO!
</script>

<template>
  <div
    class="min-h-screen bg-school-50 dark:bg-lousa-900 text-school-700 dark:text-lousa-300 p-6 md:p-10 font-sans"
  >
    <div class="max-w-6xl 2xl:max-w-[90rem] mx-auto space-y-8">
      <header
        class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
      >
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold text-school-800 dark:text-lousa-100 tracking-tight">
            Gabaritos Mestres
          </h1>
          <p class="text-school-500 dark:text-lousa-400 text-sm">
            Gerencie e crie as referências oficiais para a correção por IA.
          </p>
        </div>

        <div
          class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto"
        >
          <div class="relative w-full sm:w-64">
            <select
              v-model="classIdSelecionadaParaNovoGabarito"
              class="w-full appearance-none bg-white dark:bg-lousa-800 ring-1 ring-school-200 dark:ring-lousa-700 border border-school-100 dark:border-lousa-600 rounded-xl pl-4 pr-10 py-3 text-sm text-school-700 dark:text-lousa-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer shadow-sm"
            >
              <option value="" disabled>1. Selecione uma Turma</option>
              <option v-for="t in turmas ?? []" :key="t._id" :value="t._id">
                {{ t.name }}
              </option>
            </select>
            <i
              class="pi pi-chevron-down text-xs absolute right-4 top-1/2 -translate-y-1/2 text-school-400 dark:text-lousa-500 pointer-events-none"
            ></i>
          </div>

          <button
            @click="openModalParaCriar"
            :disabled="!classIdSelecionadaParaNovoGabarito"
            class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all bg-indigo-600 dark:bg-indigo-500 rounded-xl disabled:bg-school-200 dark:disabled:bg-lousa-700 disabled:text-school-400 dark:disabled:text-lousa-500 disabled:cursor-not-allowed hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-600/10 disabled:shadow-none whitespace-nowrap active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="h-48 bg-school-200/50 dark:bg-lousa-700/40 ring-1 ring-school-200/80 dark:ring-lousa-700/60 rounded-2xl animate-pulse"
        ></div>
      </div>

      <div
        v-else-if="templatesList.length === 0"
        class="flex flex-col items-center justify-center py-20 bg-white dark:bg-lousa-800 ring-1 ring-school-200/80 dark:ring-lousa-700 rounded-3xl border border-dashed border-school-300 dark:border-lousa-600 shadow-sm text-center px-4"
      >
        <i class="pi pi-file-check text-5xl text-indigo-600 dark:text-indigo-400 mb-4"></i>
        <h3 class="text-lg font-bold text-school-800 dark:text-lousa-100 mb-1">
          Nenhum gabarito mestre
        </h3>
        <p class="text-school-500 dark:text-lousa-400 text-sm max-w-xs font-medium">
          Selecione uma turma e clique em "Novo Modelo" para criar a prova de
          referência.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        <TemplateCard
          v-for="temp in templatesList"
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

    <ConfirmDialog></ConfirmDialog>
  </div>
</template>
