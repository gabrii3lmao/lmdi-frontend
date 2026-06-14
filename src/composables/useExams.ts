import { ref, computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { examService } from "@/services/examService";
import { submissionService } from "@/services/submissionService";
import type { Submission } from "@/types/Submission";

export function useExams(classId: string) {
  const examIdSelecionado = ref("");
  const enviando = ref(false);

  const page = ref(1);
  const limit = ref(10);
  const totalItems = ref(0);
  const totalPages = ref(0);

  // Vue Query para as Provas
  const { data: provasDaTurma, isLoading: carregandoProvas } = useQuery({
    queryKey: ["provas", classId],
    queryFn: async () => {
      const response = await examService.listarGabaritosMestre(classId);
      return (response.data as any)?.data || response.data || [];
    },
    enabled: !!classId,
  });

  // Vue Query para as Submissões (com Auto-Polling a cada 3 segundos)
  const { data: submissoes, isLoading: carregandoSubmissoes } = useQuery({
    queryKey: ["submissoes", examIdSelecionado, page, limit],
    queryFn: async () => {
      if (!examIdSelecionado.value) return [];
      const response = await submissionService.getAllSubmission(
        examIdSelecionado.value,
        page.value,
        limit.value,
      );
      const paginated = response.data as any;
      if (paginated?.data) {
        totalItems.value = paginated.totalItems;
        totalPages.value = paginated.totalPages;
        page.value = paginated.currentPage;
        return paginated.data;
      }
      return paginated || [];
    },
    enabled: computed(() => !!examIdSelecionado.value),
    refetchInterval: (query) => {
      const dados = query.state.data as Submission[] | undefined;
      const temPendente = dados?.some((sub) => sub.status === "pending");
      return temPendente ? 3000 : false;
    },
  });

  function changePage(p: number) {
    page.value = p;
  }

  return {
    examIdSelecionado,
    submissoes: computed(() => submissoes.value || []),
    provasDaTurma: computed(() => provasDaTurma.value || []),
    enviando,
    carregandoProvas,
    carregandoSubmissoes,
    page: computed(() => page.value),
    limit: computed(() => limit.value),
    totalItems: computed(() => totalItems.value),
    totalPages: computed(() => totalPages.value),
    changePage,
  };
}
