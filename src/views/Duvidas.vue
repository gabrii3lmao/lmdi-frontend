<script setup lang="ts">
import { ref } from "vue";

interface FAQItem {
  question: string;
  answer: string;
  open: boolean;
}

const faqs = ref<FAQItem[]>([
  {
    question: "Como devo fotografar o gabarito para evitar erros?",
    answer:
      "A foto deve ser tirada de cima para baixo (paralela ao papel), em um ambiente bem iluminado e, preferencialmente, sobre uma superfície escura. Certifique-se de que os quatro cantos da folha estão visíveis na imagem.",
    open: true,
  },
  {
    question: "O sistema aceita caneta azul ou apenas preta?",
    answer:
      "O motor de processamento funciona melhor com caneta preta devido ao alto contraste, mas caneta azul escura também é aceita. Evite lápis grafite claro, pois o brilho do grafite pode confundir o sensor.",
    open: false,
  },
  {
    question: "E se o aluno marcar duas alternativas na mesma questão?",
    answer:
      "O sistema detectará 'Múltipla Marcação' e atribuirá erro à questão automaticamente. Você poderá revisar essas ocorrências na tela de detalhes da prova do aluno.",
    open: false,
  },
  {
    question: "Como cadastro um novo modelo de gabarito?",
    answer:
      "Vá em 'Modelos de Prova', clique em novo e envie uma foto do gabarito preenchido corretamente. O sistema lerá essa imagem como o padrão (mestre) para as próximas correções.",
    open: false,
  },
  {
    question: "Posso exportar as notas para o Excel?",
    answer:
      "Sim. Na página de 'Relatórios' ou dentro de cada Turma, existe um botão 'Exportar CSV' que gera uma planilha compatível com Excel e Google Sheets.",
    open: false,
  },
]);

const toggleFaq = (index: number) => {
  faqs.value[index].open = !faqs.value[index].open;
};
</script>

<template>
  <div class="sm:ml-64 min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-3xl mx-auto">
      <header class="text-center mb-12">
        <div class="inline-block p-3 bg-indigo-600/10 rounded-2xl mb-4">
          <i class="pi pi-question-circle text-indigo-400 text-3xl"></i>
        </div>

        <h1 class="text-3xl font-bold">
          Central de <span class="text-indigo-400">Ajuda</span>
        </h1>

        <p class="text-gray-400 mt-2">
          Tudo o que você precisa saber para dominar o Let me do it.
        </p>
      </header>

      <div class="space-y-4">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          :class="[
            'bg-gray-800 border rounded-2xl overflow-hidden transition-all duration-300',
            faq.open
              ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/5'
              : 'border-gray-700',
          ]"
        >
          <button
            @click="toggleFaq(index)"
            class="w-full p-5 text-left flex justify-between items-center hover:bg-gray-750 transition-colors"
          >
            <span class="font-semibold text-gray-200">
              {{ faq.question }}
            </span>

            <i
              class="pi pi-chevron-down transition-transform duration-300 text-indigo-400"
              :class="{ 'rotate-180': faq.open }"
            ></i>
          </button>

          <Transition name="accordion">
            <div
              v-if="faq.open"
              class="px-5 text-gray-100 text-sm leading-relaxed overflow-hidden"
            >
              <div class="pt-4 pb-5 border-t border-gray-700">
                {{ faq.answer }}
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <footer
        class="mt-16 p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl text-center"
      >
        <h3 class="font-bold text-lg mb-2">Ainda precisa de suporte?</h3>

        <p class="text-gray-100 text-sm mb-6">
          Se sua dúvida não foi respondida, nossa equipe técnica pode te ajudar.
        </p>

        <a
          href="mailto:suporte@exemplo.com"
          class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold transition-all"
        >
          <i class="pi pi-envelope"></i>
          Falar com Suporte
        </a>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.35s ease;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 300px;
}

.bg-gray-750 {
  background-color: rgba(55, 65, 81, 0.5);
}
</style>
