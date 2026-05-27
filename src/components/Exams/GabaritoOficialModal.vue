<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useToast } from "primevue/usetoast"; // <-- Importamos o useToast

const toast = useToast(); // <-- Inicializamos o toast

interface InitialData {
  _id?: string;
  title: string;
  questionsCount: number;
  choicesCount: number;
  answerKey?: string[];
}

const props = defineProps<{
  isOpen: boolean;
  enviando: boolean;
  initialData?: InitialData | null;
}>();

const emit = defineEmits(["close", "confirm"]);

const nomeProva = ref("");
const qtdQuestoes = ref(10);
const qtdAlternativas = ref(5);
const respostas = ref<string[]>([]);

const alternativas = computed(() =>
  Array.from({ length: qtdAlternativas.value }, (_, i) =>
    String.fromCharCode(65 + i),
  ),
);

// 2. Este watch reage quando o Modal abre ou fecha.
watch(
  () => props.isOpen,
  (modalAberto) => {
    if (modalAberto) {
      if (props.initialData) {
        // MODO EDIÇÃO: Preenche os dados recebidos do componente pai
        nomeProva.value = props.initialData.title;
        qtdAlternativas.value = props.initialData.choicesCount;
        qtdQuestoes.value = props.initialData.questionsCount;

        // Garante que se a API já tiver as respostas, a gente as copia pro ref
        if (
          props.initialData.answerKey &&
          props.initialData.answerKey.length > 0
        ) {
          respostas.value = [...props.initialData.answerKey];
        }
      } else {
        // MODO CRIAÇÃO: Reseta o formulário
        nomeProva.value = "";
        qtdAlternativas.value = 5;
        qtdQuestoes.value = 10;
        respostas.value = Array(10).fill("");
      }
    }
  },
);

// Mantemos esse watch para ajustar o array de respostas quando o usuário muda o input numérico
watch(
  qtdQuestoes,
  (novaQtd) => {
    const diff = novaQtd - respostas.value.length;
    if (diff > 0) respostas.value.push(...Array(diff).fill(""));
    else respostas.value.splice(novaQtd);
  },
  { immediate: true },
);

function handleSubmit() {
  if (respostas.value.some((r) => r === "")) {
    toast.add({
      severity: "warn",
      summary: "Atenção",
      detail: "Preencha o gabarito de todas as questões antes de salvar.",
      life: 4000,
    });
    return;
  }

  emit("confirm", {
    name: nomeProva.value,
    questionCount: qtdQuestoes.value,
    choicesCount: qtdAlternativas.value,
    answerKey: respostas.value,
  });
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
  >
    <div
      class="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl p-6 max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-slate-800">
          {{ props.initialData ? "Editar Gabarito" : "Novo Gabarito Oficial" }}
        </h2>
        <button
          @click="emit('close')"
          class="text-slate-400 hover:text-slate-600 p-2 transition-colors hover:bg-slate-50 rounded-lg"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="flex flex-col gap-1">
          <label
            class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1"
            >Nome</label
          >
          <input
            v-model="nomeProva"
            class="bg-slate-50/50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors shadow-sm"
            placeholder="Ex: Simulado A"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label
            class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1"
            >Questões</label
          >
          <input
            v-model.number="qtdQuestoes"
            type="number"
            min="1"
            class="bg-slate-50/50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors shadow-sm"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label
            class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1"
            >Opções</label
          >
          <div
            class="flex bg-slate-50 rounded-xl p-1 border border-slate-200 shadow-sm"
          >
            <button
              v-for="n in [4, 5]"
              :key="n"
              @click="qtdAlternativas = n"
              :class="[
                'flex-1 text-xs py-2 rounded-lg transition-all font-semibold',
                qtdAlternativas === n
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/10'
                  : 'text-slate-500 hover:text-slate-800',
              ]"
            >
              {{ n }}
            </button>
          </div>
        </div>
      </div>

      <div
        class="flex-1 overflow-y-auto custom-scrollbar pr-2 pt-4 border-t border-slate-100"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="i in qtdQuestoes"
            :key="i"
            class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50 border border-slate-200/80 shadow-sm"
          >
            <span class="text-xs font-mono font-semibold text-slate-400">{{
              String(i).padStart(2, "0")
            }}</span>
            <div class="flex gap-1">
              <button
                v-for="alt in alternativas"
                :key="alt"
                @click="respostas[i - 1] = alt"
                :class="[
                  'w-8 h-8 rounded-lg text-xs font-bold border transition-all flex items-center justify-center',
                  respostas[i - 1] === alt
                    ? 'bg-emerald-600 border-transparent text-white shadow-md shadow-emerald-600/10'
                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600',
                ]"
              >
                {{ alt }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-3 mt-6 pt-6 border-t border-slate-100">
        <button
          @click="emit('close')"
          class="flex-1 py-3 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-slate-100 hover:bg-slate-200 rounded-xl"
        >
          Cancelar
        </button>
        <button
          @click="handleSubmit"
          :disabled="enviando || nomeProva.trim() === ''"
          class="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-700 transition-all rounded-xl font-bold text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/10 active:scale-95"
        >
          <span v-if="enviando" class="flex items-center justify-center gap-2">
            <i class="pi pi-spin pi-spinner animate-spin"></i> Salvando...
          </span>
          <span v-else-if="props.initialData">Atualizar Gabarito</span>
          <span v-else>Confirmar Gabarito</span>
        </button>
      </div>
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
