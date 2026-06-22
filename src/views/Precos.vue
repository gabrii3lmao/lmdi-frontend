<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import logLight from "@/assets/logo1.webp";
import logDark from "@/assets/logo-white.png";

const router = useRouter();
const themeStore = useThemeStore();
const logoSrc = computed(() =>
  themeStore.theme === "dark" ? logDark : logLight,
);

const scrolled = ref(false);
function handleScroll() {
  scrolled.value = window.scrollY > 60;
}

const selectedPlan = ref<"monthly" | "annual">("monthly");

const planos = [
  {
    name: "Grátis",
    subtitle: "Para começar agora",
    monthlyPrice: 0,
    annualPrice: 0,
    period: "",
    features: [
      "Até 30 alunos por turma",
      "3 turmas ativas",
      "Correção por IA",
      "Exportação CSV",
      "Relatórios básicos",
      "Suporte por e-mail",
    ],
    highlighted: false,
    cta: "Cadastre-se Grátis",
    ctaTo: "/signup",
    gradient: "from-slate-500 to-slate-600",
  },
  {
    name: "Profissional",
    subtitle: "Para professores dedicados",
    monthlyPrice: 29,
    annualPrice: 290,
    period: "/mês",
    features: [
      "Até 50 alunos por turma",
      "Turmas ilimitadas",
      "Correção por IA prioritária",
      "Exportação CSV e Excel",
      "Relatórios avançados com gráficos",
      "Modelos de prova personalizados",
      "Suporte prioritário por chat",
    ],
    highlighted: true,
    cta: "Assine Agora",
    ctaTo: "/signup",
    gradient: "from-emerald-500 to-emerald-700",
  },
  {
    name: "Empresarial",
    subtitle: "Para instituições",
    monthlyPrice: 99,
    annualPrice: 990,
    period: "/mês",
    features: [
      "Alunos ilimitados",
      "Turmas ilimitadas",
      "Correção por IA em lote",
      "Exportação CSV, Excel e API",
      "Relatórios completos + dashboards",
      "Modelos de prova personalizados",
      "Múltiplos professores",
      "Suporte 24h dedicado + onboarding",
    ],
    highlighted: false,
    cta: "Falar com Vendas",
    ctaTo: "/signup",
    gradient: "from-amber-500 to-amber-600",
  },
];

const comparativo = [
  { feature: "Alunos por turma", gratis: "30", prof: "50", empres: "Ilimitado" },
  { feature: "Turmas ativas", gratis: "3", prof: "Ilimitado", empres: "Ilimitado" },
  { feature: "Correção por IA", gratis: "Sim", prof: "Sim (prioritário)", empres: "Sim (lote)" },
  { feature: "Exportação de dados", gratis: "CSV", prof: "CSV + Excel", empres: "CSV + Excel + API" },
  { feature: "Relatórios", gratis: "Básicos", prof: "Avançados", empres: "Completos + Dashboards" },
  { feature: "Modelos de prova", gratis: "Padrão", prof: "Personalizados", empres: "Personalizados" },
  { feature: "Suporte", gratis: "E-mail", prof: "Chat prioritário", empres: "24h dedicado" },
  { feature: "Múltiplos professores", gratis: "—", prof: "—", empres: "Sim" },
];

const faqPrecos = ref([
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. Você pode cancelar sua assinatura a qualquer momento sem taxas. Seu acesso continua até o fim do período já pago.",
    open: false,
  },
  {
    q: "O plano gratuito tem limite de tempo?",
    a: "Não. O plano gratuito é vitalício — você nunca será cobrado. Os limites de alunos e turmas são os únicos diferenciais.",
    open: false,
  },
  {
    q: "Como funciona o período de testes do plano Profissional?",
    a: "Oferecemos 7 dias grátis do plano Profissional sem precisar de cartão de crédito. Ao final, você escolhe se quer continuar.",
    open: false,
  },
  {
    q: "Aceitam pagamento por boleto?",
    a: "Sim. Aceitamos cartão de crédito, boleto bancário e PIX. Para instituições, também emitimos nota fiscal.",
    open: false,
  },
]);

function toggleFaq(index: number) {
  faqPrecos.value[index]!.open = !faqPrecos.value[index]!.open;
}

let observer: IntersectionObserver | null = null;

function initReveal() {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "-40px 0px" },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer?.observe(el));
}

onMounted(() => {
  if (localStorage.getItem("token")) {
    router.replace("/dashboard");
    return;
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  requestAnimationFrame(initReveal);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  observer?.disconnect();
});
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 font-sans">
    <!-- Navbar -->
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      :class="
        scrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-slate-900/5 dark:shadow-black/30 border-b border-slate-200/50 dark:border-slate-700/50'
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-transparent'
      "
    >
      <div
        class="max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 transition-all duration-300"
        :class="scrolled ? 'h-14' : 'h-16'"
      >
        <div class="flex items-center justify-between gap-2 h-full">
          <RouterLink to="/" class="flex items-center gap-2 sm:gap-3 shrink-0">
            <img
              :src="logoSrc"
              alt="LetMeDoIt"
              class="h-8 sm:h-9 w-auto"
            />
            <p class="text-base sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight whitespace-nowrap">Let me <span class="text-emerald-600 dark:text-emerald-400">Do it</span></p>
          </RouterLink>
          <nav class="flex items-center gap-1.5 sm:gap-3">
            <RouterLink
              to="/signin"
              class="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap"
            >
              Entrar
            </RouterLink>
            <RouterLink
              to="/signup"
              class="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap"
            >
              Cadastre-se Grátis
            </RouterLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden bg-gradient-to-b from-emerald-50/60 to-white dark:from-slate-800 dark:to-slate-900">
      <div class="hero-glow"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent pointer-events-none"></div>
      <div class="max-w-7xl 2xl:max-w-[90rem] mx-auto px-6 relative z-10">
        <div class="max-w-3xl mx-auto text-center space-y-6">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-semibold border border-emerald-200 dark:border-emerald-700 hero-fade-in">
            <i class="pi pi-tag text-xs"></i>
            Planos para todos os tamanhos
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight hero-fade-in" style="animation-delay: 0.1s">
            Invista no que
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700">realmente importa</span>
          </h1>
          <p class="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto hero-fade-in" style="animation-delay: 0.2s">
            Escolha o plano ideal para sua realidade. Do professor individual à
            instituição de ensino.
          </p>
        </div>

        <!-- Toggle mensal/anual -->
        <div class="flex items-center justify-center gap-4 mt-10 hero-fade-in" style="animation-delay: 0.3s">
          <button
            @click="selectedPlan = 'monthly'"
            class="text-sm font-semibold transition-colors"
            :class="selectedPlan === 'monthly' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'"
          >
            Mensal
          </button>
          <button
            @click="selectedPlan = 'annual'"
            class="relative inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all"
            :class="selectedPlan === 'annual' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'"
          >
            Anual
            <span class="text-[10px] font-bold bg-emerald-500 px-1.5 py-0.5 rounded-full text-white">-17%</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Pricing Cards -->
    <section class="pb-20 md:pb-28 -mt-6 relative z-10">
      <div class="max-w-7xl 2xl:max-w-[90rem] mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          <div
            v-for="plano in planos"
            :key="plano.name"
            class="reveal relative rounded-2xl border bg-white dark:bg-slate-800 p-8 transition-all duration-300 hover:shadow-xl"
            :class="
              plano.highlighted
                ? 'border-emerald-300 dark:border-emerald-600 shadow-lg shadow-emerald-500/10 scale-[1.02] lg:scale-110 z-10'
                : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700'
            "
          >
            <!-- Badge destaque -->
            <div
              v-if="plano.highlighted"
              class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold shadow-lg"
            >
              MAIS POPULAR
            </div>

            <div class="text-center mb-6">
              <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100">
                {{ plano.name }}
              </h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {{ plano.subtitle }}
              </p>
            </div>

            <div class="text-center mb-6">
              <span class="text-5xl font-extrabold text-slate-900 dark:text-slate-100">
                <template v-if="plano.monthlyPrice === 0">Grátis</template>
                <template v-else>
                  R$ {{ selectedPlan === 'monthly' ? plano.monthlyPrice : plano.annualPrice }}
                </template>
              </span>
              <span v-if="plano.monthlyPrice > 0" class="text-slate-400 dark:text-slate-500 text-lg font-medium">
                {{ plano.period }}
              </span>
            </div>

            <ul class="space-y-3 mb-8">
              <li
                v-for="feature in plano.features"
                :key="feature"
                class="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300"
              >
                <i class="pi pi-check-circle text-emerald-500 mt-0.5 text-base shrink-0"></i>
                {{ feature }}
              </li>
            </ul>

            <RouterLink
              :to="plano.ctaTo"
              class="block w-full text-center py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
              :class="
                plano.highlighted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
              "
            >
              {{ plano.cta }}
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Table -->
    <section class="py-20 md:py-28 bg-slate-50 dark:bg-slate-800/50">
      <div class="max-w-5xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
            Compare os
            <span class="text-emerald-600 dark:text-emerald-400">planos</span>
          </h2>
          <p class="text-slate-500 dark:text-slate-400 text-lg">
            Todos os detalhes para você escolher com confiança.
          </p>
        </div>

        <div class="overflow-x-auto reveal">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-700">
                <th class="py-4 pr-6 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recurso</th>
                <th class="py-4 px-6 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">Grátis</th>
                <th class="py-4 px-6 text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-center bg-emerald-50 dark:bg-emerald-900/20 rounded-t-2xl">Profissional</th>
                <th class="py-4 px-6 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">Empresarial</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, i) in comparativo"
                :key="item.feature"
                class="border-b border-slate-100 dark:border-slate-700/50"
                :class="i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/30'"
              >
                <td class="py-4 pr-6 text-sm font-medium text-slate-700 dark:text-slate-300">{{ item.feature }}</td>
                <td class="py-4 px-6 text-sm text-slate-500 dark:text-slate-400 text-center">{{ item.gratis }}</td>
                <td class="py-4 px-6 text-sm font-semibold text-slate-800 dark:text-slate-200 text-center bg-emerald-50 dark:bg-emerald-900/10">{{ item.prof }}</td>
                <td class="py-4 px-6 text-sm text-slate-500 dark:text-slate-400 text-center">{{ item.empres }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- FAQ Preços -->
    <section class="py-20 md:py-28 bg-white dark:bg-slate-900">
      <div class="max-w-3xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
            Dúvidas sobre
            <span class="text-emerald-600 dark:text-emerald-400">planos</span>
          </h2>
        </div>

        <div class="space-y-3 reveal">
          <div
            v-for="(item, i) in faqPrecos"
            :key="i"
            class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300"
            :class="item.open ? 'border-emerald-200 dark:border-emerald-700 shadow-lg' : ''"
          >
            <button
              @click="toggleFaq(i)"
              class="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
            >
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ item.q }}</span>
              <i
                class="pi pi-chevron-down text-emerald-500 transition-transform duration-300 shrink-0"
                :class="{ 'rotate-180': item.open }"
              ></i>
            </button>
            <Transition name="accordion">
              <div v-if="item.open" class="px-5 pb-5">
                <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ item.a }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 md:py-28 bg-gradient-to-br from-emerald-600 to-emerald-800 relative overflow-hidden">
      <div class="hero-glow opacity-20"></div>
      <div class="max-w-3xl mx-auto px-6 text-center relative z-10">
        <h2 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
          Comece gratuitamente hoje
        </h2>
        <p class="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
          Sem cartão de crédito. Cancele quando quiser.
        </p>
        <RouterLink
          to="/signup"
          class="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold text-emerald-700 bg-white hover:bg-emerald-50 rounded-xl transition-all shadow-lg shadow-emerald-950/20 active:scale-95"
        >
          Criar conta gratuita
          <i class="pi pi-arrow-right text-sm"></i>
        </RouterLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-400">
      <div class="max-w-7xl 2xl:max-w-[90rem] mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <img :src="logoSrc" alt="LetMeDoIt" class="h-8 w-auto" />
          </div>
          <p class="text-sm text-slate-500 leading-relaxed max-w-xs">
            Plataforma inteligente para correção automática de provas e gestão de submissões escolares.
          </p>
        </div>
        <div class="space-y-4">
          <h4 class="text-xs font-bold text-white uppercase tracking-widest">Produto</h4>
          <nav class="flex flex-col gap-3">
            <RouterLink to="/signup" class="text-sm text-slate-400 hover:text-white transition-colors">Cadastre-se</RouterLink>
            <RouterLink to="/signin" class="text-sm text-slate-400 hover:text-white transition-colors">Entrar</RouterLink>
            <RouterLink to="/pricing" class="text-sm text-slate-400 hover:text-white transition-colors">Preços</RouterLink>
            <RouterLink to="/perguntas-frequentes" class="text-sm text-slate-400 hover:text-white transition-colors">FAQ</RouterLink>
          </nav>
        </div>
        <div class="space-y-4">
          <h4 class="text-xs font-bold text-white uppercase tracking-widest">Empresa</h4>
          <nav class="flex flex-col gap-3">
            <a href="#" class="text-sm text-slate-400 hover:text-white transition-colors">Sobre Nós</a>
            <a href="#" class="text-sm text-slate-400 hover:text-white transition-colors">Blog</a>
            <a href="#" class="text-sm text-slate-400 hover:text-white transition-colors">Carreiras</a>
            <a href="#" class="text-sm text-slate-400 hover:text-white transition-colors">Termos de Uso</a>
          </nav>
        </div>
        <div class="space-y-4">
          <h4 class="text-xs font-bold text-white uppercase tracking-widest">Entre em contato</h4>
          <nav class="flex flex-col gap-3">
            <a href="mailto:oi@letmedoit.app" class="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              <i class="pi pi-envelope text-xs text-emerald-400"></i>
              oi@letmedoit.app
            </a>
            <a href="#" class="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              <i class="pi pi-comments text-xs text-emerald-400"></i>
              Chat ao Vivo
            </a>
          </nav>
        </div>
      </div>
      <div class="border-t border-slate-800 py-6">
        <div class="max-w-7xl 2xl:max-w-[90rem] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p class="text-xs text-slate-600">&copy; 2026 LetMeDoIt. Todos os direitos reservados.</p>
          <div class="flex items-center gap-4">
            <a href="#" class="text-xs text-slate-600 hover:text-slate-400 transition-colors">Privacidade</a>
            <a href="#" class="text-xs text-slate-600 hover:text-slate-400 transition-colors">Termos</a>
            <a href="#" class="text-xs text-slate-600 hover:text-slate-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.hero-glow {
  position: absolute;
  inset: -50%;
  background: conic-gradient(from 0deg, transparent, rgba(16, 185, 129, 0.04), transparent, rgba(16, 185, 129, 0.04), transparent);
  animation: rotateGlow 30s linear infinite;
  pointer-events: none;
}

@keyframes rotateGlow {
  to {
    transform: rotate(360deg);
  }
}

.hero-fade-in {
  opacity: 0;
  transform: translateY(24px);
  animation: heroFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes heroFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0ms),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0ms);
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

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
</style>
