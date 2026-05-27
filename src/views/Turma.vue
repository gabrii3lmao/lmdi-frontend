<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { examService } from "@/services/examService";
import { useExams } from "@/composables/useExams";
import { submissionService } from "@/services/submissionService";
import { useToast } from "primevue/usetoast";

// Componentes Modularizados
import ExamHeader from "@/components/Exams/ExamHeader.vue";
import ExamActionCards from "@/components/Exams/ExamActionCards.vue";
import SubmissionsList from "@/components/Submissions/SubmissionsList.vue";
import GabaritoOficialModal from "@/components/Exams/GabaritoOficialModal.vue";
import AdicionarAlunoModal from "@/components/Submissions/AdicionarAlunoModal.vue";

const route = useRoute();
const toast = useToast();
const classIdAtual = ref(route.params.id);

// Lógica isolada no Composable (que já contém o Polling)
const {
  examIdSelecionado,
  provasDaTurma,
  submissoes,
  enviando,
  buscarSubmissoes,
  carregarProvasDaTurma,
} = useExams(classIdAtual.value);

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

    const novoExame = response.data.exam;
    provasDaTurma.value.push(novoExame);
    examIdSelecionado.value = novoExame._id;

    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Gabarito oficial cadastrado com sucesso!",
      life: 3000,
    });

    modalGabarito.value = false;
  } catch (error) {
    console.error("Erro ao salvar gabarito:", error);

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
  try {
    await submissionService.criarSubmissao(examIdSelecionado.value, dados);

    toast.add({
      severity: "success",
      summary: "Correção Iniciada",
      detail: "Imagem enviada! Correção em segundo plano.",
      life: 3000,
    });

    modalAluno.value = false;

    // Dispara a busca que vai iniciar o loop do polling
    await buscarSubmissoes();
  } catch (error) {
    console.error("Erro no envio:", error);

    // Fallback padrão se não houver erro detalhado
    let msgErro = error.response?.data?.error || "Erro no upload do gabarito.";

    if (error.response?.data?.errors && error.response.data.errors.length > 0) {
      msgErro = error.response.data.errors[0].message;
    } else if (error.response?.data?.message) {
      msgErro = error.response.data.message;
    }

    toast.add({
      severity: "error",
      summary: "Erro",
      detail: msgErro,
      life: 4000,
    });
  } finally {
    enviando.value = false;
  }
};

onMounted(() => {
  carregarProvasDaTurma();
});
</script>

<template>
  <div
    class="sm:ml-64 min-h-screen bg-slate-50 text-slate-700 p-6 md:p-10 font-sans relative overflow-hidden"
  >
    <div class="max-w-6xl mx-auto space-y-8">
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

      <SubmissionsList :exam-id="examIdSelecionado" :submissoes="submissoes" />
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
