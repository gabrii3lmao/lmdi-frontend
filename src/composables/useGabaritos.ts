import { ref } from "vue";
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
  const templates = ref<Template[]>([]);
  const turmas = ref<Turma[]>([]);
  const loading = ref(false);

  const carregarDados = async () => {
    loading.value = true;
    try {
      const resTurmas = await turmaService.getAll();
      turmas.value = resTurmas.data;

      const promisesGabaritos = turmas.value.map(async (turma) => {
        const res = await examService.listarGabaritosMestre(turma._id);
        return res.data || [];
      });

      const resultadosArray = await Promise.all(promisesGabaritos);
      templates.value = resultadosArray.flat();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      loading.value = false;
    }
  };

  const getTurmaName = (classId: string) => {
    return (
      turmas.value.find((t) => t._id === classId)?.name ||
      "Turma não encontrada"
    );
  };

  return {
    templates,
    turmas,
    loading,
    carregarDados,
    getTurmaName,
  };
}
