<script setup lang="ts">
import { ref, onMounted } from "vue";
import { turmaService } from "@/services/turmas";
import TurmaCard from "@/components/Classes/TurmaCard.vue";
import TurmaModal from "@/components/Classes/TurmaModal.vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm"; // <-- Importamos o useConfirm

const toast = useToast();
const confirm = useConfirm(); // <-- Inicializamos o confirm

const turmas = ref<any[]>([]);
const loading = ref(true);
const isModalOpen = ref(false);
const enviando = ref(false);

const turmaSendoEditada = ref<any>(null);

async function carregarTurmas() {
  try {
    const { data } = await turmaService.getAll();
    turmas.value = data;
  } catch (error) {
    console.error("Erro ao carregar turmas:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Não foi possível carregar suas turmas.",
      life: 4000,
    });
  } finally {
    loading.value = false;
  }
}

function abrirModalCriacao() {
  turmaSendoEditada.value = null;
  isModalOpen.value = true;
}

function abrirModalEdicao(turma: any) {
  turmaSendoEditada.value = turma;
  isModalOpen.value = true;
}

function fecharModal() {
  isModalOpen.value = false;
  turmaSendoEditada.value = null;
}

async function handleSalvar(nome: string) {
  enviando.value = true;
  try {
    if (turmaSendoEditada.value) {
      await turmaService.put(turmaSendoEditada.value._id, nome);
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Turma atualizada com sucesso!",
        life: 3000,
      });
    } else {
      await turmaService.create(nome);
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Nova turma criada com sucesso!",
        life: 3000,
      });
    }
    await carregarTurmas();
    fecharModal();
  } catch (error: any) {
    let errorMessage = "Ocorreu um erro ao salvar as alterações.";
    let errorSummary = "Erro";

    if (error.response?.data?.errors && error.response.data.errors.length > 0) {
      errorMessage = error.response.data.errors[0].message;
      errorSummary = "Aviso";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    toast.add({
      severity: "error",
      summary: errorSummary,
      detail: errorMessage,
      life: 4000,
    });
  } finally {
    enviando.value = false;
  }
}

// Transformamos a função para acionar o ConfirmDialog do PrimeVue
function handleExcluir(id: string) {
  confirm.require({
    message:
      "Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita.",
    header: "Confirmação de Exclusão",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "Sim, Excluir",
    rejectLabel: "Cancelar",
    acceptClass: "p-button-danger", // Deixa o botão de confirmar vermelho (dependendo do seu tema)
    accept: async () => {
      try {
        await turmaService.delete(id);
        turmas.value = turmas.value.filter((t) => t._id !== id);
        toast.add({
          severity: "success",
          summary: "Excluída",
          detail: "A turma foi removida com sucesso.",
          life: 3000,
        });
      } catch (e) {
        toast.add({
          severity: "error",
          summary: "Erro",
          detail: "Não foi possível excluir esta turma.",
          life: 4000,
        });
      }
    },
  });
}

onMounted(carregarTurmas);
</script>

<template>
  <div
    class="sm:ml-64 min-h-screen bg-slate-50 text-slate-700 p-6 md:p-10 font-sans"
  >
    <div class="max-w-6xl mx-auto space-y-8">
      <header
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">
            Suas Turmas
          </h1>
          <p class="text-slate-500 text-sm">
            Gerencie suas classes e acompanhe os gabaritos processados.
          </p>
        </div>
        <button
          @click="abrirModalCriacao"
          class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <i
            class="pi pi-plus text-xs transition-transform group-hover:rotate-90"
          ></i>
          Nova Turma
        </button>
      </header>

      <div
        v-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="h-44 bg-slate-200/50 ring-1 ring-slate-200/80 rounded-2xl animate-pulse"
        ></div>
      </div>

      <div
        v-else-if="turmas.length === 0"
        class="flex flex-col items-center justify-center py-20 bg-white ring-1 ring-slate-200/80 rounded-3xl border border-dashed border-slate-300 shadow-sm"
      >
        <div
          class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-600"
        >
          <i class="pi pi-folder-open text-3xl" style="font-size: 2rem;"></i>
        </div>
        <h3 class="text-xl font-bold text-slate-800 mb-2">
          Nenhuma turma encontrada
        </h3>
        <p class="text-slate-500 text-sm mb-6 max-w-sm text-center font-medium">
          Você ainda não cadastrou nenhuma turma. Crie sua primeira turma para
          começar a corrigir gabaritos.
        </p>
        <button
          @click="abrirModalCriacao"
          class="text-emerald-600 font-bold hover:text-emerald-700 transition-colors flex items-center gap-2"
        >
          <i class="pi pi-plus-circle"></i> Criar primeira turma
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TurmaCard
          v-for="turma in turmas"
          :key="turma._id"
          :turma="turma"
          @delete="handleExcluir"
          @edit="abrirModalEdicao"
        />
      </div>
    </div>

    <TurmaModal
      :is-open="isModalOpen"
      :enviando="enviando"
      :turma-inicial="turmaSendoEditada"
      @close="fecharModal"
      @confirm="handleSalvar"
    />

    <ConfirmDialog></ConfirmDialog>
  </div>
</template>
