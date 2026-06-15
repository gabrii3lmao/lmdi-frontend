<script setup lang="ts">
import { ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import FileUploadZone from "@/components/common/FileUploadZone.vue";
import type { UploadItem } from "@/components/common/FileUploadZone.vue";

const props = defineProps<{ isOpen: boolean; enviando: boolean }>();
const emit = defineEmits(["close", "confirm"]);

const toast = useToast();

const itensUpload = ref<UploadItem[]>([]);

watch(
  () => props.isOpen,
  (aberto) => {
    if (aberto) {
      itensUpload.value = [];
    }
  },
);

function handleSubmit() {
  if (itensUpload.value.length === 0) {
    toast.add({
      severity: "warn",
      summary: "Atenção",
      detail: "Selecione pelo menos uma imagem ou PDF.",
      life: 4000,
    });
    return;
  }
  emit("confirm", {
    itens: itensUpload.value.map((item) => ({
      nome: item.studentName,
      arquivo: item.file,
    })),
  });
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
  >
    <div
      class="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
    >
      <div class="flex justify-between items-center mb-6 flex-shrink-0">
        <div>
          <h2 class="text-xl font-bold text-slate-800">
            Corrigir <span class="text-emerald-600">Gabarito</span>
          </h2>
          <p class="text-xs text-slate-500 mt-1 font-medium">
            Anexe a foto da prova do aluno.
          </p>
        </div>
        <button
          @click="emit('close')"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="flex flex-col flex-1 overflow-hidden">
        <div class="flex-1 overflow-y-auto custom-scrollbar -mx-1 px-1">
          <div class="space-y-6">
            <div>
              <label
                class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1"
              >
                Gabaritos dos Alunos
              </label>
              <FileUploadZone v-model="itensUpload" />
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-4 mt-4 border-t border-slate-100 flex-shrink-0">
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="enviando || itensUpload.length === 0"
            class="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-50 hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-emerald-600/10"
          >
            <i v-if="enviando" class="pi pi-spin pi-spinner animate-spin"></i>
            {{
              enviando
                ? "Enviando..."
                : `Corrigir ${itensUpload.length} gabarito${itensUpload.length !== 1 ? "s" : ""}`
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #10b981;
  border-radius: 10px;
}
</style>
