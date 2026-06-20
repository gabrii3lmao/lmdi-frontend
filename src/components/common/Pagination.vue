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
    class="flex flex-col sm:flex-row items-center justify-between gap-2 py-2"
  >
    <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">
      Página {{ currentPage }} de {{ totalPages }}
      ({{ totalItems }} {{ totalItems === 1 ? "registro" : "registros" }})
    </span>

    <div class="flex items-center gap-1">
      <button
        :disabled="currentPage <= 1"
        @click="emit('page-change', currentPage - 1)"
        class="inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-slate-200 dark:enabled:hover:bg-slate-700 enabled:text-slate-600 dark:enabled:text-slate-300"
      >
        <i class="pi pi-chevron-left text-[10px]"></i>
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
            'inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-semibold transition-all',
            p === currentPage
              ? 'bg-emerald-600 dark:bg-emerald-500 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700',
          ]"
        >
          {{ p }}
        </button>

        <span
          v-else-if="p === currentPage - 2 || p === currentPage + 2"
          :key="'ellipsis-' + p"
          class="text-slate-400 dark:text-slate-500 text-[11px] px-0.5 select-none"
        >
          ...
        </span>
      </template>

      <button
        :disabled="currentPage >= totalPages"
        @click="emit('page-change', currentPage + 1)"
        class="inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-slate-200 dark:enabled:hover:bg-slate-700 enabled:text-slate-600 dark:enabled:text-slate-300"
      >
        <i class="pi pi-chevron-right text-[10px]"></i>
      </button>
    </div>
  </div>
</template>
