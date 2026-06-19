<script setup lang="ts">
import TheAside from "./components/TheAside.vue";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import { isRouteLoading } from "./router";
</script>

<template>
    <main class="min-h-screen bg-white dark:bg-slate-900 flex flex-col justify-center">
        <div
            v-if="isRouteLoading"
            class="fixed top-0 left-0 right-0 h-1 bg-emerald-500 animate-pulse z-50"
        />
        <TheAside />
        <Toast />
        <ConfirmDialog />
        <RouterView />
    </main>
</template>
