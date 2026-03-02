<script setup lang="ts">
import TheAside from './components/TheAside.vue';


</script>

<template>
  <main class="min-h-screen bg-gray-900 flex flex-col justify-center">
    <TheAside />
    <RouterView />
  </main>
</template>
