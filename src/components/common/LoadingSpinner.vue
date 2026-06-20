<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <i class="pi pi-spin pi-spinner text-emerald-600 dark:text-emerald-400" style="font-size: 2.5rem"></i>
    <p v-if="message" class="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
      {{ message }}
    </p>
  </div>
</template>
