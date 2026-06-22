<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 font-sans px-6 py-12">
    <div class="z-10 w-full max-w-2xl bg-white dark:bg-slate-800 p-8 md:p-16 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">

      <div class="relative flex items-center justify-center py-6 md:py-10">
        <span class="select-none text-[12rem] md:text-[18rem] font-black leading-none text-slate-300 dark:text-slate-100/20">
          404
        </span>
        <img class="absolute w-56 md:w-72 confused-cat dark:hidden" src="@/assets/confused-cat.png" alt="gato confuso">
        <img class="absolute w-56 md:w-72 confused-cat hidden dark:block" src="@/assets/confused-car-dark.png" alt="gato confuso escuro">
      </div>

      <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-slate-100 mt-2 mb-3">
        Página não encontrada
      </h2>

      <p class="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-md mx-auto">
        Não deixe o nosso gatinho confuso assim novamente!  
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <RouterLink
          to="/"
          class="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm font-semibold text-white transition-all bg-emerald-600 dark:bg-emerald-500 rounded-xl hover:bg-emerald-800 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 active:scale-[0.98]"
        >
          <i class="pi pi-arrow-left text-xs"></i>
          Voltar para o Início
        </RouterLink>

        <button
          class="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm font-semibold text-white transition-all bg-red-500 border border-red-600 rounded-xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 active:scale-[0.98]"
        >
          <i class="pi pi-flag text-xs"></i>
          Reportar Bug
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.confused-cat {
  animation: tilt-wobble 3s ease-in-out infinite;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.08));
}

@keyframes tilt-wobble {
  0%, 100% { transform: rotate(0deg) scale(1); }
  15% { transform: rotate(-3deg) scale(1.02); }
  30% { transform: rotate(2deg) scale(1.01); }
  45% { transform: rotate(-1deg) scale(1.02); }
  60% { transform: rotate(2deg) scale(1); }
  80% { transform: rotate(-2deg) scale(1.01); }
}
</style>
