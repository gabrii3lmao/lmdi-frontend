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
      @click="hasActiveExam ? $emit('open-aluno') : null"
      :class="[
        'group p-6 border rounded-2xl transition-all shadow-xl',
        hasActiveExam
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
</template>

<style scoped>
.group {
  transition: all 0.3s ease;
}
</style>
