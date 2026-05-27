<script setup lang="ts">
import TheAside from "./components/TheAside.vue";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
</script>

<template>
  <main class="min-h-screen bg-gray-900 flex flex-col justify-center">
    <TheAside />
    <Toast />
    <ConfirmDialog />
    <RouterView />
  </main>
</template>
