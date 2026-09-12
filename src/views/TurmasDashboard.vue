<script setup lang="ts">
import { ref, computed } from "vue";
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

const { data: rawTurmas, isPending } = useQuery({
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
  placeholderData: (prev) => prev,
});

const turmas = computed(() => rawTurmas.value ?? []);

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
    class="min-h-screen bg-school-50 dark:bg-lousa-900 text-school-700 dark:text-lousa-300 font-sans flex flex-col"
  >
    <div class="flex-1 p-6 md:p-10">
      <div class="max-w-6xl 2xl:max-w-[90rem] mx-auto space-y-8">
        <header
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div class="space-y-1">
            <h1 class="text-3xl font-extrabold text-school-800 dark:text-lousa-100 tracking-tight">
              Suas Turmas
            </h1>
            <p class="text-school-500 dark:text-lousa-400 text-sm">
              Gerencie suas classes e acompanhe os gabaritos processados.
            </p>
          </div>
          <button
            @click="abrirModalCriacao"
            class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all bg-indigo-600 dark:bg-indigo-500 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <i
              class="pi pi-plus text-xs transition-transform group-hover:rotate-90"
            ></i>
            Nova Turma
          </button>
        </header>

        <div
          v-if="isPending"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
        >
          <div
            v-for="i in 6"
            :key="i"
            class="h-44 bg-school-200/50 dark:bg-lousa-700/40 ring-1 ring-school-200/80 dark:ring-lousa-700/60 rounded-2xl animate-pulse"
          ></div>
        </div>

        <div
          v-else-if="turmas.length === 0"
          class="flex flex-col items-center justify-center py-20 bg-white dark:bg-lousa-800 ring-1 ring-school-200/80 dark:ring-lousa-700 rounded-3xl border border-dashed border-school-300 dark:border-lousa-600 shadow-sm"
        >
          <i class="pi pi-folder-open text-5xl text-indigo-600 dark:text-indigo-400 mb-6"></i>
          <h3 class="text-xl font-bold text-school-800 dark:text-lousa-100 mb-2">
            Nenhuma turma encontrada
          </h3>
          <p class="text-school-500 dark:text-lousa-400 text-sm mb-6 max-w-sm text-center font-medium">
            Você ainda não cadastrou nenhuma turma. Crie sua primeira turma para
            começar a corrigir gabaritos.
          </p>
          <button
            @click="abrirModalCriacao"
            class="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-2"
          >
            <i class="pi pi-plus-circle"></i> Criar primeira turma
          </button>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
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
      v-if="!isPending && turmas.length > 0"
      class="sticky bottom-0 bg-school-50 dark:bg-lousa-800/95 border-t border-school-200 dark:border-lousa-700 px-6 md:px-10"
    >
      <div class="max-w-6xl 2xl:max-w-[90rem] mx-auto py-3">
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
