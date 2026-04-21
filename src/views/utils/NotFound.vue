<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div
    class="relative min-h-screen flex items-center justify-center bg-[#0B0F19] overflow-hidden font-sans px-4"
  >
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"
    ></div>

    <div
      class="relative z-10 text-center animate-in fade-in zoom-in-95 duration-500"
    >
      <div class="relative inline-block mb-4">
        <h1
          class="text-[150px] leading-none font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600 tracking-tighter drop-shadow-2xl"
        >
          404
        </h1>
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)] pointer-events-none"
        ></div>
      </div>

      <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
        Página não encontrada 
      </h2>
      <p class="text-lg text-gray-400 max-w-md mx-auto mb-10 leading-relaxed">
        Desculpe, a página que você está tentando acessar ainda não existe ou foi
        movida para outro endereço.
      </p>

      <RouterLink
        to="/"
        class="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white transition-all bg-indigo-600 rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0F19] focus:ring-indigo-500 shadow-lg shadow-indigo-500/25 active:scale-95 group"
      >
        <i
          class="pi pi-home transition-transform group-hover:-translate-y-0.5"
        ></i>
        Voltar para o Painel
      </RouterLink>
    </div>
  </div>
</template>
