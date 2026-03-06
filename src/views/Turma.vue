<script setup>
import { ref } from "vue";
import GabaritoOficialModal from "@/components/GabaritoOficialModal.vue";
import AdicionarAlunoModal from "@/components/AdicionarAlunoModal.vue";
const modalGabarito = ref(false);
const modalAluno = ref(false);
const enviando = ref(false);

const handleSalvarGabarito = async (dados) => {
  enviando.value = true;
  console.log("Dados do Gabarito:", dados);
  // Aqui você chama seu service.createExam(dados)
  enviando.value = false;
  modalGabarito.value = false;
};

const handleProcessarGabaritoAluno = async (dados) => {
  enviando.value = true;
  // Para enviar imagem, geralmente usamos FormData
  const formData = new FormData();
  formData.append("nome", dados.nome);
  formData.append("file", dados.arquivo);

  console.log("Enviando foto de:", dados.nome);
  // Aqui você chama seu service.processExam(formData)
  enviando.value = false;
  modalAluno.value = false;
};
</script>
<template>
  <div class="sm:ml-64 min-h-screen bg-gray-900 text-white p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <header class="mb-10 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold">
            Gerenciar <span class="text-indigo-400">Provas</span>
          </h1>
          <p class="text-gray-400">
            Cadastre gabaritos e realize correções via câmera.
          </p>
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
          <h3 class="text-xl font-bold mb-2">Gabarito Oficial</h3>
          <p class="text-sm text-gray-400">
            Configure as respostas corretas, quantidade de questões e pesos.
          </p>
        </div>

        <div
          @click="modalAluno = true"
          class="group p-6 bg-gray-800 border border-gray-700 rounded-2xl hover:border-emerald-500/50 cursor-pointer transition-all shadow-xl"
        >
          <div
            class="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all"
          >
            <i class="pi pi-camera text-xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-2">Corrigir Prova</h3>
          <p class="text-sm text-gray-400">
            Envie a foto do gabarito do aluno para correção instantânea por IA.
          </p>
        </div>
      </div>

      <section>
        <h3 class="text-lg font-semibold mb-4 text-gray-300">
          Correções Recentes
        </h3>
        <div
          class="bg-gray-800/50 border border-dashed border-gray-700 rounded-2xl p-12 text-center"
        >
          <p class="text-gray-500">
            Nenhuma correção processada nesta turma ainda.
          </p>
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
