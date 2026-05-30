import { ref, computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { examService } from "@/services/examService";
import { submissionService } from "@/services/submissionService";
import type { Submission } from "@/types/Submission";

export function useExams(classId: string) {
  const examIdSelecionado = ref("");
  const enviando = ref(false);

  // Vue Query para as Provas
  const { data: provasDaTurma, isLoading: carregandoProvas } = useQuery({
    queryKey: ["provas", classId],
    queryFn: async () => {
      const response = await examService.listarGabaritosMestre(classId);
      return response.data || [];
    },
    enabled: !!classId,
  });

  // Vue Query para as Submissões (com Auto-Polling a cada 3 segundos)
  const { data: submissoes, isLoading: carregandoSubmissoes } = useQuery({
    queryKey: ["submissoes", examIdSelecionado],
    queryFn: async () => {
      if (!examIdSelecionado.value) return [];
      const response = await submissionService.getAllSubmission(
        examIdSelecionado.value,
      );
      return response.data || [];
    },
    enabled: computed(() => !!examIdSelecionado.value),
    refetchInterval: (query) => {
      const dados = query.state.data as Submission[] | undefined;
      const temPendente = dados?.some((sub) => sub.status === "pending");
      return temPendente ? 3000 : false;
    },
  });

  return {
    examIdSelecionado,
    submissoes: computed(() => submissoes.value || []),
    provasDaTurma: computed(() => provasDaTurma.value || []),
    enviando,
    carregandoProvas,
    carregandoSubmissoes,
  };
}
