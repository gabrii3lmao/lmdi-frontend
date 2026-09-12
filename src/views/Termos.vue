<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import { useToast } from "primevue/usetoast";
import api from "@/services/api";
import { disconnectSocket } from "@/services/socket";
import {
  ensureTermsAccepted,
  setTermsAcceptance,
  clearTerms,
  fetchCurrentTermsVersion,
} from "@/services/terms";
import logLight from "@/assets/logo1.webp";

const route = useRoute();
const router = useRouter();
const themeStore = useThemeStore();
const toast = useToast();

let savedTheme: "light" | "dark" | "system" = "light";

const hasToken = ref(false);
const alreadyAccepted = ref(false);
const acceptedAt = ref<string | null>(null);
const loading = ref(false);
const termsChecked = ref(false);
const termsVersion = ref("v1");

const showAcceptControls = computed(
  () => hasToken.value && !alreadyAccepted.value,
);

const formattedAcceptedAt = computed(() => {
  if (!acceptedAt.value) return "";
  const date = new Date(acceptedAt.value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
});

const secoes = ref([
  {
    id: "secao-1",
    titulo: "1. Aceitação dos Termos",
    texto:
      "Ao acessar ou utilizar a plataforma LetMeDoIt, você concorda integralmente com estes Termos de Uso e com a nossa Política de Privacidade. Caso não concorde com qualquer parte destes termos, você não deve criar uma conta nem utilizar os nossos serviços. O aceite é condição indispensável para o cadastro e para o uso contínuo da plataforma.",
  },
  {
    id: "secao-2",
    titulo: "2. Definições",
    texto:
      "Para fins destes Termos: 'Plataforma' refere-se ao site e serviços do LetMeDoIt; 'Usuário' é toda pessoa que cria uma conta, acessa ou utiliza a plataforma; 'Professor' é o usuário que cadastra turmas, gabaritos e provas; 'Cartão-resposta' é o documento preenchido pelo aluno e fotografado para correção; 'IA' refere-se ao modelo de inteligência artificial utilizado para processar e corrigir as provas; 'Conteúdo' abrange tudo o que for enviado, cadastrado ou gerado pelo usuário na plataforma.",
  },
  {
    id: "secao-3",
    titulo: "3. Descrição do Serviço",
    texto:
      "O LetMeDoIt é uma plataforma que oferece correção automática de provas por inteligência artificial. O professor cadastra suas turmas, define um gabarito modelo e submete fotografias dos cartões-resposta de seus alunos. A IA identifica as marcações, compara com o gabarito e gera as notas automaticamente. O serviço também oferece relatórios de desempenho e gestão de submissões para auxiliar o trabalho docente.",
  },
  {
    id: "secao-4",
    titulo: "4. Cadastro e Conta",
    texto:
      "Para utilizar a plataforma é necessário criar uma conta com informações verdadeiras e atualizadas. Você é responsável por manter a confidencialidade das suas credenciais de acesso e por todas as atividades realizadas na sua conta. É proibido criar contas falsas, usar a identidade de terceiros ou compartilhar sua conta. A plataforma se reserva o direito de suspender ou excluir contas que violem estes Termos. O cadastro de menores de 18 anos deve ser realizado por responsável legal.",
  },
  {
    id: "secao-5",
    titulo: "5. Uso da Plataforma",
    texto:
      "O usuário se compromete a utilizar a plataforma apenas para fins legítimos e educacionais, em conformidade com a legislação vigente. É vedado: enviar conteúdo ilegal, ofensivo, discriminatório ou que viole direitos de terceiros; tentar acessar dados de outros usuários; realizar engenharia reversa, ou copiar, distribuir ou revender o serviço sem autorização; utilizar automação ou meios fraudulentos para obter vantagens indevidas.",
  },
  {
    id: "secao-6",
    titulo: "6. Correção por IA e Limitações",
    texto:
      "A correção é realizada por inteligência artificial e pode apresentar variações de precisão conforme a qualidade da imagem, iluminação e legibilidade do cartão-resposta. O LetMeDoIt busca alta taxa de acerto, mas não garante resultado infalível. O professor é o responsável final pela validação dos resultados, podendo revisar e corrigir manualmente qualquer nota. A plataforma não substitui o julgamento profissional do educador.",
  },
  {
    id: "secao-7",
    titulo: "7. Conteúdo e Propriedade Intelectual",
    texto:
      "Todo o conteúdo enviado pelo usuário — turmas, provas, gabaritos e imagens de cartões — permanece de propriedade do usuário. Ao enviá-lo, você nos concede uma licença limitada para armazenar, processar e exibir o conteúdo exclusivamente para a prestação do serviço. A plataforma, seu código, logotipos, marcas e materiais são propriedade do LetMeDoIt e não podem ser utilizados sem autorização prévia por escrito.",
  },
  {
    id: "secao-8",
    titulo: "8. Privacidade e Proteção de Dados",
    texto:
      "O tratamento de dados pessoais, incluindo dados de alunos, é realizado em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018). Utilizamos criptografia para armazenamento e transmissão, não vendemos dados a terceiros e mantemos os dados armazenados em servidores seguros. Você pode solicitar acesso, correção ou exclusão completa dos seus dados a qualquer momento pelos nossos canais de contato.",
  },
  {
    id: "secao-9",
    titulo: "9. Planos, Assinatura e Cobrança",
    texto:
      "O LetMeDoIt oferece planos gratuitos e pagos. As condições de cada plano, valores e recursos estão descritas na página de Preços. Assinaturas pagas são renovadas automaticamente até o cancelamento, que pode ser feito a qualquer momento pela conta do usuário. Valores já pagos não são reembolsados, salvo previsão legal. Alterações de preço serão comunicadas com antecedência.",
  },
  {
    id: "secao-10",
    titulo: "10. Limitação de Responsabilidade",
    texto:
      "O serviço é fornecido 'no estado em que se encontra'. O LetMeDoIt não se responsabiliza por: interrupções do serviço, perda de dados decorrente de uso inadequado, decisões pedagógicas tomadas com base nas correções, ou danos indiretos, incidentais ou consequenciais. Nossa responsabilidade máxima fica limitada ao valor efetivamente pago pelo usuário nos últimos 12 meses.",
  },
  {
    id: "secao-11",
    titulo: "11. Suspensão e Encerramento",
    texto:
      "Você pode encerrar sua conta a qualquer momento pela área de Configurações. O LetMeDoIt pode suspender ou encerrar contas que violem estes Termos, apresentem uso fraudulento ou comprometam a segurança da plataforma. Encerrada a conta, os dados poderão ser excluídos após o período legal de retenção, conforme a LGPD.",
  },
  {
    id: "secao-12",
    titulo: "12. Alterações destes Termos",
    texto:
      "Estes Termos podem ser atualizados periodicamente para refletir melhorias do serviço ou mudanças legais. A versão vigente estará sempre disponível nesta página com a data de atualização. Quando houver alterações relevantes, os usuários serão notificados por e-mail ou por aviso na plataforma. O uso contínuo após a atualização implica aceitação das novas condições; usuários que não concordarem deverão encerrar a conta.",
  },
  {
    id: "secao-13",
    titulo: "13. Legislação Aplicável e Foro",
    texto:
      "Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de Picos — PI para dirimir eventuais controvérsias, sem prejuízo de outras comarcas quando a legislação for imperativa para o consumidor.",
  },
  {
    id: "secao-14",
    titulo: "14. Contato",
    texto:
      "Para dúvidas, solicitações relacionadas à LGPD ou comunicação de violações destes Termos, entre em contato pelo e-mail gabrielmluz56@gmail.com. Responderemos no prazo de até 10 dias úteis.",
  },
]);

const updatedAt = "10 de agosto de 2026";

function handlePrint() {
  window.print();
}

async function refreshStatus() {
  hasToken.value = !!localStorage.getItem("token");
  alreadyAccepted.value = false;
  acceptedAt.value = null;

  const version = await fetchCurrentTermsVersion();
  if (version) termsVersion.value = version;

  if (hasToken.value) {
    alreadyAccepted.value = await ensureTermsAccepted();
    acceptedAt.value = localStorage.getItem("acceptedTermsAt");
  }
}

async function handleAgree() {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/signup");
    return;
  }
  if (!termsChecked.value) return;

  loading.value = true;
  try {
    const res = await api.post("/auth/accept-terms");
    setTermsAcceptance(res.data);
    alreadyAccepted.value = true;
    acceptedAt.value = res.data.acceptedTermsAt || null;
    toast.add({
      severity: "success",
      summary: "Termos aceitos",
      detail: "Obrigado por aceitar os Termos de Uso.",
      life: 4000,
    });
    const redirect = route.query.redirect;
    router.push(typeof redirect === "string" && redirect ? redirect : "/dashboard");
  } catch {
    toast.add({
      severity: "error",
      summary: "Não foi possível registrar o aceite",
      detail: "Tente novamente em instantes.",
      life: 4000,
    });
  } finally {
    loading.value = false;
  }
}

async function handleDisagree() {
  if (!localStorage.getItem("token")) {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
    return;
  }

  loading.value = true;
  try {
    await api.post("/auth/signout");
  } catch {
    /* ignora falhas no logout */
  } finally {
    disconnectSocket();
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("userPhoto");
    localStorage.removeItem("supportPromptDismissed");
    clearTerms();
    loading.value = false;
    router.push("/signin");
  }
}

onMounted(() => {
  savedTheme = themeStore.theme;
  themeStore.applyTheme("light");
  refreshStatus();
});

onUnmounted(() => {
  themeStore.applyTheme(savedTheme);
});
</script>

<template>
  <div class="min-h-screen bg-white text-gray-900">
    <!-- Barra superior -->
    <header class="no-print sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div class="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-6">
        <RouterLink to="/" class="flex items-center gap-2">
          <img :src="logLight" alt="LetMeDoIt" class="h-7 w-auto" />
          <span class="text-sm font-semibold tracking-tight text-gray-900">
            LetMeDoIt
          </span>
        </RouterLink>
        <button
          type="button"
          @click="handlePrint"
          class="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <i class="pi pi-print text-xs"></i>
          Imprimir
        </button>
      </div>
    </header>

    <main class="mx-auto max-w-[1100px] px-6 py-12">
      <div class="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
        <!-- Índice lateral -->
        <aside class="no-print hidden lg:block">
          <nav class="sticky top-20">
            <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Índice
            </p>
            <ul class="border-l border-gray-200">
              <li v-for="secao in secoes" :key="secao.id">
                <a
                  :href="`#${secao.id}`"
                  class="-ml-px block border-l-2 border-transparent py-1 pl-3 text-sm leading-snug text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
                >
                  {{ secao.titulo }}
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <article class="max-w-[768px]">
          <!-- Cabeçalho do documento -->
          <header class="mb-10 border-b border-gray-200 pb-8">
            <h1 class="text-3xl font-semibold tracking-tight text-gray-900">
              Termos de Uso
            </h1>
            <p class="mt-3 leading-relaxed text-gray-600">
              As regras que regem a sua utilização da plataforma LetMeDoIt.
            </p>
            <dl class="mt-5 flex flex-wrap gap-x-8 gap-y-1 text-sm text-gray-500">
              <div class="flex gap-1.5">
                <dt class="font-medium text-gray-700">Última atualização:</dt>
                <dd>{{ updatedAt }}</dd>
              </div>
              <div class="flex gap-1.5">
                <dt class="font-medium text-gray-700">Versão:</dt>
                <dd>{{ termsVersion }}</dd>
              </div>
            </dl>
          </header>

          <!-- Índice mobile -->
          <details class="no-print mb-8 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 lg:hidden">
            <summary class="cursor-pointer text-sm font-semibold text-gray-700">
              Índice
            </summary>
            <ul class="mt-3 space-y-1.5">
              <li v-for="secao in secoes" :key="secao.id">
                <a
                  :href="`#${secao.id}`"
                  class="block text-sm text-gray-600 hover:text-gray-900"
                >
                  {{ secao.titulo }}
                </a>
              </li>
            </ul>
          </details>

          <!-- Aviso de aceite já registrado -->
          <p
            v-if="hasToken && alreadyAccepted"
            class="mb-10 border-l-2 border-gray-300 pl-3 text-sm text-gray-600"
          >
            Você aceitou estes termos<template v-if="formattedAcceptedAt">
              em {{ formattedAcceptedAt }}</template
            >.
          </p>

          <!-- Seções -->
          <section
            v-for="secao in secoes"
            :id="secao.id"
            :key="secao.id"
            class="mb-8 scroll-mt-24"
          >
            <h2 class="mb-2 text-lg font-semibold text-gray-900">
              {{ secao.titulo }}
            </h2>
            <p class="text-[15px] leading-7 text-gray-700">
              {{ secao.texto }}
            </p>
          </section>
        </article>
      </div>
    </main>

    <!-- Rodapé -->
    <footer class="no-print border-t border-gray-200">
      <div
        class="mx-auto flex max-w-[1100px] flex-col gap-3 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>&copy; 2026 LetMeDoIt. Todos os direitos reservados.</p>
        <a
          href="mailto:gabrielmluz56@gmail.com"
          class="transition-colors hover:text-gray-900"
        >
          gabrielmluz56@gmail.com
        </a>
      </div>
    </footer>

    <div v-if="showAcceptControls" class="no-print h-32" />

    <!-- Card fixo de aceite -->
    <div
      v-if="showAcceptControls"
      class="no-print fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white"
    >
      <div
        class="mx-auto flex max-w-[1100px] flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <label class="flex cursor-pointer items-start gap-3">
          <input
            v-model="termsChecked"
            type="checkbox"
            class="mt-0.5 h-4 w-4 rounded border-gray-300 accent-gray-900"
          />
          <span class="text-sm text-gray-700">
            Li e concordo com os Termos de Uso.
          </span>
        </label>
        <div class="flex items-center gap-4 sm:justify-end">
          <button
            type="button"
            @click="handleDisagree"
            :disabled="loading"
            class="text-xs text-gray-500 underline transition-colors hover:text-gray-700 disabled:opacity-50"
          >
            Não concordo
          </button>
          <button
            type="button"
            @click="handleAgree"
            :disabled="!termsChecked || loading"
            class="inline-flex items-center gap-2 rounded-md bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner text-xs"></i>
            <span>{{ loading ? "Registrando..." : "Aceitar e continuar" }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }

  article {
    max-width: 100% !important;
  }

  section {
    break-inside: avoid;
  }

  * {
    background: #fff !important;
    color: #000 !important;
    box-shadow: none !important;
  }
}
</style>
