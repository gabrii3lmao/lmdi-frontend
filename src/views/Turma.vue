<script setup>
import { ref, computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { examService } from "@/services/examService";
import { useExams } from "@/composables/useExams";
import { submissionService } from "@/services/submissionService";
import { useToast } from "primevue/usetoast";
import { useQueryClient, useQuery } from "@tanstack/vue-query";
import { turmaService } from "@/services/turmas";

// Componentes Modularizados
import ExamHeader from "@/components/Exams/ExamHeader.vue";
import ExamActionCards from "@/components/Exams/ExamActionCards.vue";
import SubmissionsList from "@/components/Submissions/SubmissionsList.vue";
import Pagination from "@/components/common/Pagination.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import GabaritoOficialModal from "@/components/Exams/GabaritoOficialModal.vue";
import AdicionarAlunoModal from "@/components/Submissions/AdicionarAlunoModal.vue";

const route = useRoute();
const toast = useToast();
const queryClient = useQueryClient();
const classIdAtual = ref(route.params.id);

const { data: turmas } = useQuery({
  queryKey: ["turmas"],
  queryFn: async () => {
    const { data } = await turmaService.getAll(1, 100);
    return data?.data || data || [];
  },
  placeholderData: [],
});

const turmaNome = computed(() => {
  const all = turmas.value || [];
  const found = all.find((t) => t._id === classIdAtual.value);
  return found?.name || classIdAtual.value.slice(-5).toUpperCase();
});

// Note que aqui só extraímos as variáveis reativas, o Vue Query faz o resto!
const { examIdSelecionado, provasDaTurma, submissoes, enviando, carregandoProvas, carregandoSubmissoes, page, totalPages, totalItems, changePage } = useExams(
  classIdAtual.value,
);

const modalGabarito = ref(false);
const modalAluno = ref(false);

const handleSalvarGabarito = async (dados) => {
  enviando.value = true;
  try {
    const response = await examService.createExam(
      dados.name,
      classIdAtual.value,
      dados.questionCount,
      dados.choicesCount,
      dados.answerKey,
    );

    examIdSelecionado.value = response.data.exam._id;

    // Invalida o cache e faz a tela puxar a prova recém criada
    queryClient.invalidateQueries({ queryKey: ["provas", classIdAtual.value] });

    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Gabarito oficial cadastrado com sucesso!",
      life: 3000,
    });

    modalGabarito.value = false;
  } catch (error) {
    let errorMessage = "Erro ao salvar o gabarito oficial.";
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

const handleProcessarGabaritoAluno = async (dados) => {
  if (!examIdSelecionado.value) {
    toast.add({
      severity: "warn",
      summary: "Atenção",
      detail: "Selecione uma prova ativa antes de corrigir.",
      life: 4000,
    });
    return;
  }

  enviando.value = true;
  let sucessos = 0;
  let erros = 0;

  try {
    const { data: signature } = await submissionService.getUploadSignature();

    const uploadResults = await Promise.allSettled(
      dados.itens.map((item) =>
        submissionService.uploadToCloudinary(item.arquivo, signature),
      ),
    );

    const submissions = [];

    uploadResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        submissions.push({
          studentName: dados.itens[index].nome,
          imageUrl: result.value,
        });
        sucessos++;
      } else {
        console.error("Falha no upload para Cloudinary:", result.reason);
        erros++;
      }
    });

    if (submissions.length > 0) {
      await submissionService.criarSubmissao(
        examIdSelecionado.value,
        submissions,
      );
    }
  } catch {
    erros = dados.itens.length;
  }

  if (sucessos > 0) {
    toast.add({
      severity: "success",
      summary: "Correção Iniciada",
      detail: `${sucessos} gabarito${sucessos !== 1 ? "s" : ""} enviado${sucessos !== 1 ? "s" : ""} com sucesso!`,
      life: 3000,
    });

    modalAluno.value = false;

    queryClient.invalidateQueries({
      queryKey: ["submissoes", examIdSelecionado.value],
    });
  }

  if (erros > 0) {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: `${erros} gabarito${erros !== 1 ? "s" : ""} não pode${erros !== 1 ? "s" : ""} ser enviado${erros !== 1 ? "s" : ""}. Tente novamente.`,
      life: 4000,
    });
  }

  enviando.value = false;
};
</script>

<template>
  <div
    class="sm:ml-64 min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-sans flex flex-col"
  >
    <div class="flex-1 p-6 md:p-10">
      <div class="max-w-6xl 2xl:max-w-[90rem] mx-auto space-y-8">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <RouterLink to="/classes" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-semibold">
            Turmas
          </RouterLink>
          <i class="pi pi-chevron-right text-[10px] text-slate-400"></i>
          <span class="text-slate-800 dark:text-slate-200 font-bold truncate">{{ turmaNome }}</span>
        </nav>

        <ExamHeader
          v-model="examIdSelecionado"
          :class-id="classIdAtual"
          :provas="provasDaTurma"
        />

        <ExamActionCards
          :has-active-exam="!!examIdSelecionado"
          @open-gabarito="modalGabarito = true"
          @open-aluno="modalAluno = true"
        />

        <LoadingSpinner v-if="carregandoProvas" message="Carregando provas..." />

        <LoadingSpinner
          v-else-if="carregandoSubmissoes"
          message="Carregando submissões..."
        />

        <SubmissionsList
          v-else
          :exam-id="examIdSelecionado"
          :submissoes="submissoes"
        />
      </div>
    </div>

    <div
      v-if="examIdSelecionado && submissoes.length > 0"
      class="sticky bottom-0 bg-slate-50 dark:bg-slate-800/95 border-t border-slate-200 dark:border-slate-700 px-6 md:px-10"
    >
      <div class="max-w-6xl 2xl:max-w-[90rem] mx-auto py-3">
        <Pagination
          :currentPage="page"
          :totalPages="totalPages"
          :totalItems="totalItems"
          @page-change="changePage"
        />
      </div>
    </div>

    <GabaritoOficialModal
      :is-open="modalGabarito"
      :enviando="enviando"
      @close="modalGabarito = false"
      @confirm="handleSalvarGabarito"
    />

    <AdicionarAlunoModal
      :is-open="modalAluno"
      :enviando="enviando"
      @close="modalAluno = false"
      @confirm="handleProcessarGabaritoAluno"
    />
  </div>
</template>
