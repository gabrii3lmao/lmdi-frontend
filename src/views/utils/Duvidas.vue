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
        answer: "A foto deve ser tirada de cima para baixo (paralela ao papel), em um ambiente bem iluminado e, preferencialmente, sobre uma superfície escura. Certifique-se de que os quatro cantos da folha estão visíveis na imagem.",
        open: false,
    },
    {
        question: "O sistema aceita caneta azul ou apenas preta?",
        answer: "O motor de processamento funciona melhor com caneta preta devido ao alto contraste, mas caneta azul escura também é aceita. Evite lápis grafite claro, pois o brilho do grafite pode confundir o sensor.",
        open: false,
    },
    {
        question: "E se o aluno marcar duas alternativas na mesma questão?",
        answer: "O sistema detectará 'Múltipla Marcação' e atribuirá erro à questão automaticamente. Você poderá revisar essas ocorrências na tela de detalhes da prova do aluno.",
        open: false,
    },
    {
        question: "Como cadastro um novo modelo de gabarito?",
        answer: "Vá em 'Modelos de Prova', clique em novo e envie uma foto do gabarito preenchido corretamente. O sistema lerá essa imagem como o padrão (mestre) para as próximas correções.",
        open: false,
    },
    {
        question: "Posso exportar as notas para o Excel?",
        answer: "Sim. Na página de 'Relatórios' ou dentro de cada Turma, existe um botão 'Exportar CSV' que gera uma planilha compatível com Excel e Google Sheets.",
        open: false,
    },
    {
        question: "Existe limite de alunos por turma?",
        answer: "Sim, no plano gratuito, há um limite de até 30 alunos por turma. Assine o plano profissional para obter um limite de até 50 alunos.",
        open: false,
    },
    {
        question: "O que acontece se a imagem estiver inclinada?",
        answer: "O sistema aplica correção automática de perspectiva sempre que possível. No entanto, inclinações muito acentuadas ou cortes nas bordas podem comprometer a leitura. Sempre tente manter a câmera alinhada ao papel.",
        open: false,
    },
    {
        question: "É possível revisar manualmente uma correção?",
        answer: "Sim. Após o processamento automático, você pode acessar a prova do aluno e visualizar as marcações detectadas. Caso necessário, é possível ajustar o resultado manualmente.",
        open: false,
    },
]);

const toggleFaq = (index: number) => {
    faqs.value[index]!.open = !faqs.value[index]!.open;
};


</script>
<template>
    <div
        class="sm:ml-64 min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-8 overflow-y-auto"
    >
        <div class="max-w-3xl 2xl:max-w-4xl mx-auto">
            <!-- HEADER -->
            <header class="text-center mb-12">
                <div
                    class="inline-flex items-center justify-center p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-6 shadow-sm border border-indigo-100 dark:border-indigo-800"
                >
                    <i
                        class="pi pi-question-circle text-indigo-500 dark:text-indigo-400"
                        style="font-size: 4rem"
                    ></i>
                </div>

                <h1 class="text-3xl font-bold dark:text-slate-100">
                    Central de <span class="text-indigo-400">Ajuda</span>
                </h1>

                <p class="text-gray-500 dark:text-slate-400 mt-2">
                    Tudo o que você precisa saber para dominar o Let me do it.
                </p>
            </header>

            <div class="space-y-4">
                <div
                    v-for="(faq, index) in faqs"
                    :key="index"
                    :class="[
                        'bg-slate-50 dark:bg-slate-800 border rounded-2xl overflow-hidden transition-all duration-300 border-l-4 border-l-indigo-500',
                        faq.open
                            ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                            : 'border-slate-200/80 dark:border-slate-700',
                    ]"
                >
                    <button
                        @click="toggleFaq(index)"
                        class="w-full p-5 text-left flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                        <span class="font-semibold text-slate-800 dark:text-slate-200">
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
                            class="px-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed overflow-hidden"
                        >
                            <div class="pt-4 pb-5 border-t border-slate-200/80 dark:border-slate-700">
                                {{ faq.answer }}
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>

            <footer
                class="mt-16 p-8 bg-indigo-600/10 dark:bg-indigo-900/20 border border-indigo-500/20 dark:border-indigo-800 rounded-3xl text-center"
            >
                <h3 class="font-bold text-lg mb-2 dark:text-slate-100">
                    Ainda precisa de suporte?
                </h3>

                <p
                    class="bg-slate-100 dark:bg-slate-700 text-gray-750 dark:text-slate-300 text-sm mb-6 inline-block px-4 py-1 rounded-lg mt-2"
                >
                    Se sua dúvida não foi respondida, nossa equipe técnica pode
                    te ajudar.
                </p>
                <br />
                <a
                    href="mailto:suporte@exemplo.com"
                    class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold text-white transition-all"
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
