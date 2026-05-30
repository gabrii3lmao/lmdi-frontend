import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { examService } from "@/services/examService";
import { turmaService } from "@/services/turmas";

export interface Template {
  _id: string;
  title: string;
  questionsCount: number;
  choicesCount: number;
  createdAt: string;
  classId: string;
}

export interface Turma {
  _id: string;
  name: string;
}

export function useGabaritos() {
  // 1. Busca as turmas usando o MESMO cache compartilhado das outras páginas
  const { data: turmas, isLoading: carregandoTurmas } = useQuery({
    queryKey: ["turmas"],
    queryFn: async () => {
      const resTurmas = await turmaService.getAll();
      return (resTurmas.data || []) as Turma[];
    },
    initialData: [],
  });

  // 2. Busca os gabaritos DEPOIS que as turmas forem carregadas (Query Dependente)
  const { data: templates, isLoading: carregandoTemplates } = useQuery({
    queryKey: [
      "todos-gabaritos",
      // Essa key recarrega os gabaritos automaticamente se uma turma nova for criada!
      computed(() => turmas.value.map((t: Turma) => t._id).join(",")),
    ],
    queryFn: async () => {
      if (!turmas.value || turmas.value.length === 0) return [];

      const promisesGabaritos = turmas.value.map(async (turma: Turma) => {
        const res = await examService.listarGabaritosMestre(turma._id);
        return res.data || [];
      });

      const resultadosArray = await Promise.all(promisesGabaritos);
      return resultadosArray.flat() as Template[];
    },
    // O fetch só é disparado se existir pelo menos uma turma carregada
    enabled: computed(() => turmas.value.length > 0),
    initialData: [],
  });

  // 3. Status global consolidado (verdadeiro se qualquer uma das duas estiver carregando)
  const loading = computed(
    () => carregandoTurmas.value || carregandoTemplates.value,
  );

  // 4. Função auxiliar agora reativa baseada no cache
  const getTurmaName = (classId: string) => {
    return (
      turmas.value.find((t: Turma) => t._id === classId)?.name ||
      "Turma não encontrada"
    );
  };

  return {
    templates,
    turmas,
    loading,
    getTurmaName,
  };
}
