<script setup lang="ts">
import TheAside from './components/TheAside.vue';
import Toast from 'primevue/toast';


</script>

<template>
  <main class="min-h-screen bg-gray-900 flex flex-col justify-center">
    <TheAside />
    <Toast />
    <RouterView />
  </main>
</template>
