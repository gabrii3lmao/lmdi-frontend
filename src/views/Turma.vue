<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import GabaritoOficialModal from "@/components/GabaritoOficialModal.vue";
import AdicionarAlunoModal from "@/components/AdicionarAlunoModal.vue";
import { examService } from "@/services/examService";

const route = useRoute();
const classIdAtual = ref(route.params.id); // ID da Turma vindo da URL
const examIdSelecionado = ref(""); // ID da Prova selecionada no Select

const modalGabarito = ref(false);
const modalAluno = ref(false);
const enviando = ref(false);

const submissoes = ref([]);
const provasDaTurma = ref([]);

/**
 * Busca os alunos que já realizaram a prova selecionada
 */
const buscarSubmissoes = async () => {
  if (!examIdSelecionado.value) {
    submissoes.value = [];
    return;
  }

  try {
    const response = await examService.getAllSubmission(
      examIdSelecionado.value,
    );
    submissoes.value = response.data || [];
  } catch (error) {
    console.error("Erro ao carregar correções:", error);
    submissoes.value = [];
  }
};

/**
 * Carrega todas as provas (gabaritos mestre) vinculadas a esta turma
 */
const carregarProvasDaTurma = async () => {
  try {
    const response = await examService.listarGabaritosMestre(
      classIdAtual.value,
    );
    // O backend já deve retornar apenas as provas desta classId
    provasDaTurma.value = response.data || [];
  } catch (error) {
    console.error("Erro ao carregar provas da turma:", error);
  }
};

// Sempre que trocar a prova no Select, busca os resultados dos alunos
watch(examIdSelecionado, (novoId) => {
  if (novoId) {
    buscarSubmissoes();
  } else {
    submissoes.value = [];
  }
});

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

    // O backend retorna { message, exam: { ... } }
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
    // Prepara o arquivo com o nome do aluno para o backend identificar
    const extensao = dados.arquivo.name.split(".").pop();
    const arquivoFinal = new File(
      [dados.arquivo],
      `${dados.nome}.${extensao}`,
      { type: dados.arquivo.type },
    );

    await examService.criarSubmissao(examIdSelecionado.value, [arquivoFinal]);

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
  <div class="sm:ml-64 min-h-screen bg-gray-900 text-white p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <header
        class="mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-gray-800 pb-6"
      >
        <div>
          <h1 class="text-3xl font-bold italic">
            GERENCIAR <span class="text-indigo-400">PROVAS</span>
          </h1>
          <p class="text-gray-400 text-sm">Turma ID: {{ classIdAtual }}</p>
        </div>

        <div
          class="bg-gray-800 p-2 rounded-xl border border-gray-700 flex items-center gap-3"
        >
          <label class="text-[10px] font-bold text-gray-500 uppercase ml-2"
            >Prova Ativa:</label
          >
          <select
            v-model="examIdSelecionado"
            class="bg-transparent text-sm font-semibold outline-none text-indigo-400 min-w-[200px] cursor-pointer"
          >
            <option value="" disabled>Selecione uma prova...</option>
            <option
              v-for="prova in provasDaTurma"
              :key="prova._id"
              :value="prova._id"
            >
              {{ prova.title }}
            </option>
          </select>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div
          @click="modalGabarito = true"
          class="group p-6 bg-gray-800 border border-gray-700 rounded-2xl hover:border-indigo-500/50 cursor-pointer transition-all shadow-xl"
        >
          <div
            class="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all"
          >
            <i class="pi pi-file-edit text-xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-1">Novo Gabarito Oficial</h3>
          <p class="text-xs text-gray-400">
            Configure as respostas corretas para uma nova avaliação.
          </p>
        </div>

        <div
          @click="examIdSelecionado ? (modalAluno = true) : null"
          :class="[
            'group p-6 border rounded-2xl transition-all shadow-xl',
            examIdSelecionado
              ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50 cursor-pointer'
              : 'bg-gray-800/30 border-gray-800 opacity-40 cursor-not-allowed',
          ]"
        >
          <div
            class="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all"
          >
            <i class="pi pi-camera text-xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-1">Corrigir Gabarito Aluno</h3>
          <p class="text-xs text-gray-400">
            Suba a foto da prova para correção automática por IA.
          </p>
        </div>
      </div>

      <section>
        <h3 class="text-lg font-semibold mb-6 flex items-center gap-2">
          <i class="pi pi-users text-indigo-400"></i>
          Alunos Processados
        </h3>

        <div
          v-if="!examIdSelecionado"
          class="bg-gray-800/50 border border-dashed border-gray-700 rounded-2xl p-12 text-center text-gray-500 italic"
        >
          Selecione uma prova acima para visualizar o desempenho da turma.
        </div>

        <div
          v-else-if="submissoes.length === 0"
          class="bg-gray-800/50 border border-dashed border-gray-700 rounded-2xl p-12 text-center text-gray-500"
        >
          Nenhuma submissão encontrada para esta prova.
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div
            v-for="sub in submissoes"
            :key="sub._id"
            class="bg-gray-800 border border-gray-700 p-5 rounded-2xl flex flex-col justify-between hover:border-gray-500 transition-all shadow-md"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h4 class="font-bold text-white truncate max-w-[150px]">
                  {{ sub.studentName }}
                </h4>
                <span
                  :class="[
                    'text-[10px] font-bold uppercase px-2 py-0.5 rounded',
                    sub.status === 'success'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-red-500/10 text-red-500',
                  ]"
                >
                  {{ sub.status === "success" ? "Corrigido" : "Erro" }}
                </span>
              </div>
              <div class="text-right">
                <p class="text-[10px] text-gray-500 uppercase font-bold">
                  Nota
                </p>
                <p class="text-2xl font-black text-indigo-400">
                  {{ sub.score !== undefined ? sub.score.toFixed(1) : "0.0" }}
                </p>
              </div>
            </div>

            <div
              class="pt-4 border-t border-gray-700 flex justify-between items-center text-[11px] text-gray-400"
            >
              <span
                >Acertos:
                <b class="text-white">{{ sub.totalCorrect ?? 0 }}</b></span
              >
              <span class="font-mono"
                >ID: {{ sub._id.slice(-4).toUpperCase() }}</span
              >
            </div>
          </div>
        </div>
      </section>
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

<style scoped>
/* Transição suave para o hover dos cards */
.group {
  transition: all 0.3s ease;
}
</style>
