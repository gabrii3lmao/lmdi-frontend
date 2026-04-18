<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { examService } from "@/services/examService";
import { useExams } from "@/composables/useExams";

// Componentes Modularizados
import ExamHeader from "@/components/ExamHeader.vue";
import ExamActionCards from "@/components/ExamActionCards.vue";
import SubmissionsList from "@/components/SubmissionsList.vue";
import GabaritoOficialModal from "@/components/GabaritoOficialModal.vue";
import AdicionarAlunoModal from "@/components/AdicionarAlunoModal.vue";

const route = useRoute();
const classIdAtual = ref(route.params.id);

// Lógica isolada no Composable
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

    // Seleciona automaticamente a nova prova criada
    examIdSelecionado.value = novoExame._id;

    alert("Gabarito oficial cadastrado com sucesso!");
    modalGabarito.value = false;
  } catch (error) {
    console.error("Erro ao salvar gabarito:", error);
    alert("Erro ao salvar o gabarito oficial.");
  } finally {
    enviando.value = false;
  }
};

const handleProcessarGabaritoAluno = async (dados) => {
  if (!examIdSelecionado.value) {
    alert("Selecione uma prova ativa antes de corrigir.");
    return;
  }

  enviando.value = true;
  try {
    // CORREÇÃO: Passamos os "dados" (que contém { nome, arquivo }) DIRETO pro Service!
    // O Service (api.ts) é quem vai fazer a mágica de renomear o arquivo que combinamos antes.
    await examService.criarSubmissao(examIdSelecionado.value, dados);

    // Recarrega a lista de submissões para mostrar o novo aluno e a nota da IA
    await buscarSubmissoes();

    alert("Gabarito enviado e processado!");
    modalAluno.value = false;
  } catch (error) {
    console.error("Erro no envio:", error);
    const msgErro = error.response?.data?.error || "Erro na correção via IA.";
    alert(msgErro);
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
    class="sm:ml-64 min-h-screen bg-[#0B0F19] text-gray-200 p-6 md:p-10 font-sans"
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
