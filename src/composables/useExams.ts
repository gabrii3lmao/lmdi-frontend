// composables/useExams.js
import { ref, watch, onUnmounted } from "vue";
import { examService } from "@/services/examService";
import { submissionService } from "@/services/submissionService";
import type { Submission } from "@/types/Submission";

export function useExams(classId: string) {
  const examIdSelecionado = ref("");
  const submissoes = ref([]);
  const provasDaTurma = ref([]);
  const enviando = ref(false);

  let pollTimer: number | null | undefined = null;

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

      const temPendente = submissoes.value.some(
        (sub: Submission) => sub.status === "pending",
      );

      // Limpa o timer antigo para não criar múltiplos loops
      if (pollTimer) clearTimeout(pollTimer);

      if (temPendente) {
        pollTimer = setTimeout(() => {
          buscarSubmissoes();
        }, 3000);
      }
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
    if (novoId) {
      buscarSubmissoes();
    } else {
      submissoes.value = [];
      if (pollTimer) clearTimeout(pollTimer);
    }
  });

  onUnmounted(() => {
    if (pollTimer) clearTimeout(pollTimer);
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
