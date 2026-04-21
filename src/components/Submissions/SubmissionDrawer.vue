<script setup lang="ts">
defineProps<{
  submission: any;
  exam: any;
  open: boolean;
}>();

defineEmits(["close"]);
</script>

<template>
  <div v-if="open && submission" class="fixed inset-0 z-50 overflow-hidden">
    <div
      class="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-sm transition-opacity"
      @click="$emit('close')"
    ></div>

    <div
      class="absolute inset-y-0 right-0 w-full max-w-md bg-[#111827] shadow-2xl flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-300"
    >
      <div
        class="p-6 border-b border-white/5 flex justify-between items-center"
      >
        <h2 class="text-xl font-bold text-white">
          {{ submission.studentName }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-white p-2"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div class="p-6 flex-1 overflow-y-auto">
        <div
          class="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-4"
        >
          <span class="text-indigo-400 font-medium">Nota:</span>
          <span class="text-2xl font-bold text-white ml-2">{{
            submission.score ?? "-"
          }}</span>
        </div>

        <p class="text-sm text-gray-500">
          Prova vinculada: {{ exam?.title || "Desconhecida" }}
        </p>
      </div>
    </div>
  </div>
</template>
