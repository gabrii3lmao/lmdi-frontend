// composables/useExams.js
import { ref, watch } from "vue";
import { examService } from "@/services/examService";
import { submissionService } from "@/services/submissionService";

export function useExams(classId: string) {
  const examIdSelecionado = ref("");
  const submissoes = ref([]);
  const provasDaTurma = ref([]);
  const enviando = ref(false);

  const buscarSubmissoes = async () => {
    if (!examIdSelecionado.value) {
      submissoes.value = [];
      return;
    }
    try {
      const response = await submissionService.getAllSubmission(
        examIdSelecionado.value,
      );
      submissoes.value = response.data || [];
    } catch (error) {
      console.error("Erro ao carregar correções:", error);
      submissoes.value = [];
    }
  };

  const carregarProvasDaTurma = async () => {
    try {
      const response = await examService.listarGabaritosMestre(classId);
      provasDaTurma.value = response.data || [];
    } catch (error) {
      console.error("Erro ao carregar provas da turma:", error);
    }
  };

  watch(examIdSelecionado, (novoId) => {
    if (novoId) buscarSubmissoes();
    else submissoes.value = [];
  });

  return {
    examIdSelecionado,
    submissoes,
    provasDaTurma,
    enviando,
    buscarSubmissoes,
    carregarProvasDaTurma,
  };
}
