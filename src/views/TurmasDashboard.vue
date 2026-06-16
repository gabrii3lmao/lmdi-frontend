<script setup lang="ts">
import { ref } from "vue";
import { turmaService } from "@/services/turmas";
import TurmaCard from "@/components/Classes/TurmaCard.vue";
import TurmaModal from "@/components/Classes/TurmaModal.vue";
import Pagination from "@/components/common/Pagination.vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { useQuery, useQueryClient } from "@tanstack/vue-query";

const toast = useToast();
const confirm = useConfirm();
const queryClient = useQueryClient();

const page = ref(1);
const limit = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);

// O useQuery substitui o "turmas", "loading", "carregarTurmas" e o "onMounted"
const { data: turmas, isLoading: loading } = useQuery({
  queryKey: ["turmas", page, limit],
  queryFn: async () => {
    const { data } = await turmaService.getAll(page.value, limit.value);
    const paginated = data as any;
    if (paginated?.data) {
      totalItems.value = paginated.totalItems;
      totalPages.value = paginated.totalPages;
      return paginated.data;
    }
    return paginated || [];
  },
  initialData: [], // Garante que comece como um array vazio e não quebre a tela
});

function changePage(p: number) {
  page.value = p;
}

const isModalOpen = ref(false);
const enviando = ref(false);
const turmaSendoEditada = ref<any>(null);

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

    // Invalida o cache: o Vue Query vai buscar os dados atualizados no servidor automaticamente
    queryClient.invalidateQueries({ queryKey: ["turmas"] });
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
    acceptClass: "p-button-danger", // Deixa o botão de confirmar vermelho
    accept: async () => {
      try {
        await turmaService.delete(id);

        // Em vez de filtrar o array manualmente, apenas invalidamos a query
        queryClient.invalidateQueries({ queryKey: ["turmas"] });

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
</script>

<template>
  <div
    class="sm:ml-64 min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-sans flex flex-col"
  >
    <div class="flex-1 p-6 md:p-10">
      <div class="max-w-6xl mx-auto space-y-8">
        <header
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div class="space-y-1">
            <h1 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              Suas Turmas
            </h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm">
              Gerencie suas classes e acompanhe os gabaritos processados.
            </p>
          </div>
          <button
            @click="abrirModalCriacao"
            class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all bg-emerald-600 dark:bg-emerald-500 rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-lg shadow-emerald-500/20 active:scale-95"
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
            class="h-44 bg-slate-200/50 dark:bg-slate-700/40 ring-1 ring-slate-200/80 dark:ring-slate-700/60 rounded-2xl animate-pulse"
          ></div>
        </div>

        <div
          v-else-if="turmas.length === 0"
          class="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-700 rounded-3xl border border-dashed border-slate-300 dark:border-slate-600 shadow-sm"
        >
          <div
            class="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400"
          >
            <i class="pi pi-folder-open text-3xl" style="font-size: 2rem"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Nenhuma turma encontrada
          </h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm text-center font-medium">
            Você ainda não cadastrou nenhuma turma. Crie sua primeira turma para
            começar a corrigir gabaritos.
          </p>
          <button
            @click="abrirModalCriacao"
            class="text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-2"
          >
            <i class="pi pi-plus-circle"></i> Criar primeira turma
          </button>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <TurmaCard
              v-for="turma in turmas"
              :key="turma._id"
              :turma="turma"
              @delete="handleExcluir"
              @edit="abrirModalEdicao"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!loading && turmas.length > 0"
      class="sticky bottom-0 bg-slate-50 dark:bg-slate-800/95 border-t border-slate-200 dark:border-slate-700 px-6 md:px-10"
    >
      <div class="max-w-6xl mx-auto py-3">
        <Pagination
          :currentPage="page"
          :totalPages="totalPages"
          :totalItems="totalItems"
          @page-change="changePage"
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
