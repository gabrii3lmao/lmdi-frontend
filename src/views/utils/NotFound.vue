<script setup lang="ts">
import { RouterLink } from "vue-router";
// Se estiver usando PrimeIcons, certifique-se de que está importado no main.ts
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 font-sans px-6 py-12">
    <!-- Container Principal com borda sutil e fundo branco para ar de "galeria/estúdio" -->
    <div class="z-10 w-full max-w-5xl bg-white p-8 md:p-16 rounded-3xl shadow-sm border border-slate-100">
      
      <div class="grid md:grid-cols-2 gap-12 items-center">
        
        <!-- Coluna da Esquerda: Visual (Professora e Número) -->
        <div class="relative flex flex-col items-center justify-center">
          
          <!-- AREA DA ILUSTRAÇÃO -->
          <div class="w-full h-64 md:h-80 rounded-2xl flex items-center justify-center mb-8">
            <div class="text-center p-6">
              <img class="rounded-xl border-8 border-slate-200" src="@/assets/confused_dog.webp" alt="cachorro confuso">
            </div>
          </div>
        </div>

        <!-- Coluna da Direita: Textos e Ação -->
        <div class="text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 mb-6">
            <i class="pi pi-question-circle text-sm"></i>
            <span class="text-xs font-semibold uppercase tracking-wider">Erramos o traço</span>
          </div>

          <h2 class="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-950 mb-4 leading-tight">
            Ops! Essa página saiu de perspectiva.
          </h2>
          
          <p class="text-lg text-slate-600 mb-12 leading-relaxed max-w-lg mx-auto md:mx-0">
            Até o nosso doguinho ficou confuso com essa situação. O conteúdo que você busca não foi encontrado no caderno de esboços.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <RouterLink
              to="/"
              class="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm font-semibold text-white transition-all bg-emerald-600 rounded-xl hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 active:scale-[0.98]"
            >
              <i class="pi pi-arrow-left text-xs"></i>
              Voltar para o Início
            </RouterLink>
            
            <!-- Botão secundário opcional para profissionalizar (ex: reportar erro) -->
            <button
              class="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm font-semibold text-white transition-all bg-red-500 border border-red-600 rounded-xl hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300 active:scale-[0.98]"
            >
              <i class="pi pi-flag text-xs"></i>
              Reportar Bug
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Adicionando uma fonte mono para o 404 parecer código/coordenada de desenho */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');

h1 {
  font-family: 'JetBrains Mono', monospace;
  /* Efeito sutil de traço de lápis no número */
  -webkit-text-stroke: 1px rgba(148, 163, 184, 0.5); 
  color: transparent;
}
</style>