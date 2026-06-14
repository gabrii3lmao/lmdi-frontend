<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
}>();

const emit = defineEmits<{
  (e: "page-change", page: number): void;
}>();
</script>

<template>
  <div
    v-if="totalPages > 0"
    class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
  >
    <span class="text-sm text-slate-500 font-medium">
      Página {{ currentPage }} de {{ totalPages }}
      ({{ totalItems }} {{ totalItems === 1 ? "registro" : "registros" }})
    </span>

    <div class="flex items-center gap-1.5">
      <button
        :disabled="currentPage <= 1"
        @click="emit('page-change', currentPage - 1)"
        class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-slate-200 enabled:text-slate-600"
      >
        <i class="pi pi-chevron-left text-xs"></i>
      </button>

      <template v-for="p in totalPages" :key="p">
        <button
          v-if="
            p === 1 ||
            p === totalPages ||
            (p >= currentPage - 1 && p <= currentPage + 1)
          "
          @click="emit('page-change', p)"
          :class="[
            'inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold transition-all',
            p === currentPage
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
              : 'text-slate-600 hover:bg-slate-100',
          ]"
        >
          {{ p }}
        </button>

        <span
          v-else-if="p === currentPage - 2 || p === currentPage + 2"
          :key="'ellipsis-' + p"
          class="text-slate-400 text-sm px-0.5 select-none"
        >
          ...
        </span>
      </template>

      <button
        :disabled="currentPage >= totalPages"
        @click="emit('page-change', currentPage + 1)"
        class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-slate-200 enabled:text-slate-600"
      >
        <i class="pi pi-chevron-right text-xs"></i>
      </button>
    </div>
  </div>
</template>
