<script setup>
defineProps({
  hasActiveExam: Boolean,
});

defineEmits(["open-gabarito", "open-aluno"]);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
    <div
      @click="$emit('open-gabarito')"
      class="group p-6 bg-white border border-slate-200 hover:border-emerald-500/30 hover:shadow-lg cursor-pointer transition-all rounded-3xl"
    >
      <div
        class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm"
      >
        <i class="pi pi-file-edit text-xl"></i>
      </div>
      <h3 class="text-xl font-bold mb-1 text-slate-800 group-hover:text-emerald-600 transition-colors">Novo Gabarito Oficial</h3>
      <p class="text-xs text-slate-500 font-medium">
        Configure as respostas corretas para uma nova avaliação.
      </p>
    </div>

    <div
      @click="hasActiveExam ? $emit('open-aluno') : null"
      :class="[
        'group p-6 border rounded-3xl transition-all',
        hasActiveExam
          ? 'bg-white border-slate-200 hover:border-emerald-500/30 hover:shadow-lg cursor-pointer'
          : 'bg-slate-100/50 border-slate-200 opacity-40 cursor-not-allowed',
      ]"
    >
      <div
        class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm"
      >
        <i class="pi pi-camera text-xl"></i>
      </div>
      <h3 class="text-xl font-bold mb-1 text-slate-800 group-hover:text-emerald-600 transition-colors">Corrigir Gabarito Aluno</h3>
      <p class="text-xs text-slate-500 font-medium">
        Suba a foto da prova para correção automática por IA.
      </p>
    </div>
  </div>
</template>

<style scoped>
.group {
  transition: all 0.3s ease;
}
</style>
