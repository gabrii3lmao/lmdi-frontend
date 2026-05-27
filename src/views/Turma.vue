<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { examService } from "@/services/examService";
import { useExams } from "@/composables/useExams";
import { submissionService } from "@/services/submissionService";

// Componentes Modularizados
import ExamHeader from "@/components/Exams/ExamHeader.vue";
import ExamActionCards from "@/components/Exams/ExamActionCards.vue";
import SubmissionsList from "@/components/Submissions/SubmissionsList.vue";
import GabaritoOficialModal from "@/components/Exams/GabaritoOficialModal.vue";
import AdicionarAlunoModal from "@/components/Submissions/AdicionarAlunoModal.vue";

const route = useRoute();
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

// Sistema de Flash Messages (Toast)
const toast = ref({ show: false, message: "", type: "success" });
const showToast = (message, type = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 4000);
};

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

    showToast("Gabarito oficial cadastrado com sucesso!", "success");
    modalGabarito.value = false;
  } catch (error) {
    console.error("Erro ao salvar gabarito:", error);
    showToast("Erro ao salvar o gabarito oficial.", "error");
  } finally {
    enviando.value = false;
  }
};

const handleProcessarGabaritoAluno = async (dados) => {
  if (!examIdSelecionado.value) {
    showToast("Selecione uma prova ativa antes de corrigir.", "error");
    return;
  }

  enviando.value = true;
  try {
    await submissionService.criarSubmissao(examIdSelecionado.value, dados);

    showToast("Imagem enviada! Correção iniciada em segundo plano.", "success");
    modalAluno.value = false;

    // Dispara a busca que vai iniciar o loop do polling
    await buscarSubmissoes();
  } catch (error) {
    console.error("Erro no envio:", error);
    const msgErro =
      error.response?.data?.error || "Erro no upload do gabarito.";
    showToast(msgErro, "error");
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

    <!-- Flash Message / Toast Component -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform translate-y-10 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-10 opacity-0"
    >
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border',
          toast.type === 'success'
            ? 'bg-white border-emerald-200 text-slate-800'
            : 'bg-white border-red-200 text-slate-800',
        ]"
      >
        <i
          :class="[
            'pi text-xl shrink-0',
            toast.type === 'success'
              ? 'pi-check-circle text-emerald-600'
              : 'pi-exclamation-triangle text-red-500',
          ]"
        ></i>
        <span class="font-semibold text-slate-700">{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>
