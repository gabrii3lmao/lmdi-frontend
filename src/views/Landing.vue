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

const screenshots = [
  "/app-screenshot-dashboard.png",
  "/app-screenshot-provas.png",
  "/app-screenshot-turma.png",
];
const currentScreenshot = ref(0);
let screenshotTimer: ReturnType<typeof setInterval>;

function nextScreenshot() {
  currentScreenshot.value = (currentScreenshot.value + 1) % screenshots.length;
}

const currentSlide = ref(0);
let slideTimer: ReturnType<typeof setInterval>;

const depoimentos = [
  {
    quote:
      "Antes de conhecer o LetMeDoIt, eu passava horas corrigindo provas manualmente. Agora é só fotografar e pronto. Minhas noites livres voltaram.",
    author: "Dra. Carla Mendes",
    role: "Professora de Matemática · Ensino Médio",
  },
  {
    quote:
      "Com 200 alunos por turma, o sistema de IA reduziu meu tempo de correção em 90% e ainda gera relatórios de desempenho automáticos.",
    author: "Prof. Ricardo Oliveira",
    role: "Coordenador Pedagógico · Colégio Sigma",
  },
  {
    quote:
      "No começo desconfiei da precisão, mas depois de conferir os resultados, vi que acertava até mais que eu. Hoje não abro mão.",
    author: "Juliana Farias",
    role: "Professora de Português · Rede Estadual SP",
  },
  {
    quote:
      "O relatório que o sistema gera automaticamente me poupou dias de trabalho fechando notas no fim do bimestre. É impressionante.",
    author: "Felipe Nogueira",
    role: "Professor de Ciências · Escola Municipal RJ",
  },
  {
    quote:
      "Uso com minhas turmas de cursinho pré-vestibular. Corrijo 300 provas por semana em minutos. Nunca mais volto ao jeito antigo.",
    author: "Ana Beatriz Lins",
    role: "Professora de Redação · Curso Elite",
  },
];

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % depoimentos.length;
}

function goToSlide(index: number) {
  currentSlide.value = index;
  clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 5000);
}

const metrics = [
  { label: "Professores ativos", value: 2000, suffix: "+", icon: "pi-users" },
  { label: "Provas corrigidas", value: 15000, suffix: "+", icon: "pi-book" },
  { label: "Precisão na correção", value: 98, suffix: "%", icon: "pi-check-circle" },
  { label: "Tempo economizado", value: 90, suffix: "%", icon: "pi-clock" },
];

const counts = ref<number[]>([0, 0, 0, 0]);
let counting = false;
let rafId: number | null = null;

function animateMetrics() {
  if (counting) return;
  counting = true;
  const targets = metrics.map((m) => m.value);
  const start = performance.now();
  const duration = 2200;

  function tick(now: number) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    counts.value = targets.map((v) => Math.floor(v * ease));
    if (t < 1) rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);
}

let observer: IntersectionObserver | null = null;

function initReveal() {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.id === "metrics") animateMetrics();
          observer?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "-40px 0px" },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer?.observe(el));
}

const features = [
  {
    icon: "pi-building",
    title: "Gestão de Turmas",
    desc: "Organize suas salas em segundos. Cada turma mantém seu histórico completo de provas e desempenho.",
    bgIcon: "pi-building",
  },
  {
    icon: "pi-camera",
    title: "Correção Instantânea",
    desc: "Fotografe os cartões-resposta e receba as notas automaticamente. Funciona com qualquer modelo de prova.",
    bgIcon: "pi-camera",
  },
  {
    icon: "pi-chart-line",
    title: "Métricas Inteligentes",
    desc: "Relatórios de desempenho individuais e coletivos gerados automaticamente após cada correção.",
    bgIcon: "pi-chart-line",
  },
];

const steps = [
  {
    icon: "pi-users",
    title: "Cadastre sua Turma",
    desc: "Adicione seus alunos em poucos cliques. Cada turma mantém seu histórico organizado.",
    time: "2 min",
    img: "/app-screenshot-turma.png",
  },
  {
    icon: "pi-file-check",
    title: "Monte o Gabarito",
    desc: "Defina as questões, alternativas e o gabarito oficial. O sistema guarda tudo automaticamente.",
    time: "3 min",
    img: "/app-screenshot-provas.png",
  },
  {
    icon: "pi-images",
    title: "Fotografe e Pronto",
    desc: "Tire foto dos cartões-resposta. A IA identifica, corrige e gera as notas na hora.",
    time: "Instantâneo",
    img: "/app-screenshot-alunos.png",
  },
];

onMounted(() => {
  if (localStorage.getItem("token")) {
    router.replace("/dashboard");
    return;
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  slideTimer = setInterval(nextSlide, 5000);
  screenshotTimer = setInterval(nextScreenshot, 4500);
  requestAnimationFrame(initReveal);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  clearInterval(slideTimer);
  clearInterval(screenshotTimer);
  if (rafId) cancelAnimationFrame(rafId);
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
    <section
      class="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-emerald-50/60 to-white dark:from-slate-800 dark:to-slate-900"
    >
      <div class="hero-glow"></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent pointer-events-none"
      ></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-slate-200/20 via-transparent to-transparent pointer-events-none"
      ></div>

      <div class="max-w-7xl 2xl:max-w-[90rem] mx-auto px-6 relative z-10">
        <div class="max-w-3xl mx-auto text-center space-y-8">
          <div
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-semibold border border-emerald-200 dark:border-emerald-700 hero-fade-in"
          >
            <i class="pi pi-sparkles text-xs"></i>
            Correção de provas por inteligência artificial
          </div>

          <h1
            class="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight hero-fade-in"
            style="animation-delay: 0.1s"
          >
            <span class="block">Corrigir provas é</span>
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700"
            >trabalho da IA.</span>
            <span class="block mt-1">Ensinar é trabalho seu.</span>
          </h1>

          <p
            class="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed hero-fade-in"
            style="animation-delay: 0.2s"
          >
            Crie gabaritos, fotografe os cartões-resposta e veja as notas
            surgirem automaticamente. Enquanto a inteligência artificial
            trabalha, você volta a fazer o que importa: ensinar.
          </p>

          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-4 hero-fade-in"
            style="animation-delay: 0.3s"
          >
            <RouterLink
              to="/signup"
              class="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-95"
            >
              Começar Grátis
              <i class="pi pi-arrow-right text-sm"></i>
            </RouterLink>
            <RouterLink
              to="/signin"
              class="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 shadow-sm active:scale-95"
            >
              Já tenho conta
            </RouterLink>
          </div>
        </div>

        <!-- Screenshot carousel -->
        <div class="mt-16 max-w-5xl mx-auto hero-fade-in" style="animation-delay: 0.5s">
          <div
            class="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden"
          >
            <div
              class="h-10 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-1.5 px-4"
            >
              <span class="w-3 h-3 rounded-full bg-red-400"></span>
              <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span class="w-3 h-3 rounded-full bg-green-400"></span>
              <span class="ml-auto flex items-center gap-1.5">
                <span
                  v-for="(_, i) in screenshots"
                  :key="i"
                  class="w-1.5 h-1.5 rounded-full transition-all duration-500"
                  :class="i === currentScreenshot ? 'bg-emerald-500 w-3' : 'bg-slate-300 dark:bg-slate-600'"
                ></span>
              </span>
            </div>
            <div class="relative overflow-hidden">
              <Transition name="screenshot" mode="out-in">
                <img
                  :key="currentScreenshot"
                  :src="screenshots[currentScreenshot]"
                  :alt="'Tela do sistema'"
                  class="w-full h-auto"
                />
              </Transition>
            </div>
          </div>

          <!-- Floating badge -->
          <div
            class="absolute -bottom-4 right-4 lg:right-8 bg-emerald-600 text-white rounded-xl px-5 py-3 shadow-lg shadow-emerald-500/30 flex items-center gap-3"
          >
            <i class="pi pi-check-circle text-xl"></i>
            <div>
              <p class="text-sm font-bold">+2.000 professores</p>
              <p class="text-xs text-emerald-200">já utilizam</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Metrics -->
    <section id="metrics" class="reveal py-16 md:py-20 bg-white dark:bg-slate-900">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(m, i) in metrics"
            :key="m.label"
            class="text-center"
          >
            <div
              class="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-4"
            >
              <i :class="['pi text-2xl', m.icon]"></i>
            </div>
            <p class="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
              {{ counts[i] }}{{ m.suffix }}
            </p>
            <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {{ m.label }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 md:py-28 bg-slate-50 dark:bg-slate-800/50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2
            class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4"
          >
            Mais tempo para
            <span class="text-emerald-600 dark:text-emerald-400">ensinar</span>
          </h2>
          <p class="text-slate-500 dark:text-slate-400 text-lg">
            Uma plataforma completa para educadores que querem economizar horas
            e ter controle total sobre o desempenho dos alunos.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(f, i) in features"
            :key="f.title"
            class="reveal group relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500 overflow-hidden"
            :style="{ '--delay': i * 120 + 'ms' }"
          >
            <div
              class="absolute -top-10 -right-10 text-8xl text-emerald-500/5 dark:text-emerald-400/5 group-hover:text-emerald-500/10 dark:group-hover:text-emerald-400/10 transition-all duration-700 rotate-12 group-hover:rotate-0"
            >
              <i :class="['pi', f.bgIcon]"></i>
            </div>
            <div
              class="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 relative"
            >
              <i :class="['pi text-xl', f.icon]"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 relative">
              {{ f.title }}
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed relative">
              {{ f.desc }}
            </p>
            <div
              class="mt-5 flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 relative"
            >
              <span>Saiba mais</span>
              <i class="pi pi-arrow-right text-xs"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-20 md:py-28 bg-white dark:bg-slate-900">
      <div class="max-w-7xl 2xl:max-w-[90rem] mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2
            class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4"
          >
            Comece em
            <span class="text-emerald-600 dark:text-emerald-400">5 minutos</span>
          </h2>
          <p class="text-slate-500 dark:text-slate-400 text-lg">
            Três passos simples. Zero complicação.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          <!-- Connector line -->
          <div
            class="hidden md:block absolute top-24 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 dark:from-emerald-800 dark:via-emerald-600 dark:to-emerald-800"
          ></div>

          <div
            v-for="(step, i) in steps"
            :key="step.title"
            class="reveal relative text-center"
            :style="{ '--delay': i * 150 + 'ms' }"
          >
            <!-- Step number -->
            <div
              class="w-12 h-12 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center text-lg font-bold mx-auto mb-6 relative z-10 shadow-lg shadow-emerald-500/20"
            >
              {{ i + 1 }}
            </div>

            <!-- Time badge -->
            <div
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-4 border border-emerald-200 dark:border-emerald-700"
            >
              <i class="pi pi-clock text-2xs"></i>
              {{ step.time }}
            </div>

            <div
              class="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-5"
            >
              <i :class="['pi text-2xl', step.icon]"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              {{ step.title }}
            </h3>
            <p class="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              {{ step.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 md:py-28 bg-slate-50 dark:bg-slate-800/50">
      <div class="max-w-5xl mx-auto px-6 text-center">
        <h2
          class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4"
        >
          Quem usa,
          <span class="text-emerald-600 dark:text-emerald-400">recomenda</span>
        </h2>
        <p class="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
          Veja o que professores estão falando sobre o LetMeDoIt.
        </p>

        <div class="relative mt-12 max-w-2xl mx-auto">
          <!-- Progress bar -->
          <div class="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-8">
            <div
              class="h-full bg-emerald-500 rounded-full transition-all duration-150 ease-linear"
              :style="{ animation: 'progressBar 5s linear infinite' }"
            ></div>
          </div>

          <div
            class="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="flex items-center justify-center gap-1 mb-6">
              <i
                v-for="_ in 5"
                :key="_"
                class="pi pi-star-fill text-amber-400 text-xl"
              ></i>
            </div>

            <Transition name="testimonial" mode="out-in">
              <div :key="currentSlide">
                <p
                  class="text-xl md:text-2xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic mb-8"
                >
                  "{{ depoimentos[currentSlide]!.quote }}"
                </p>
                <div
                  class="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg mx-auto mb-3"
                >
                  {{ depoimentos[currentSlide]!.author.charAt(0) }}
                </div>
                <p class="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {{ depoimentos[currentSlide]!.author }}
                </p>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {{ depoimentos[currentSlide]!.role }}
                </p>
              </div>
            </Transition>

            <div class="flex items-center justify-center gap-2 mt-8">
              <button
                v-for="(_, index) in depoimentos"
                :key="index"
                @click="goToSlide(index)"
                class="transition-all duration-500 rounded-full"
                :class="
                  currentSlide === index
                    ? 'w-8 h-2.5 bg-emerald-500'
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500'
                "
              ></button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 md:py-28 bg-gradient-to-br from-emerald-600 to-emerald-800 relative overflow-hidden">
      <div class="hero-glow opacity-20"></div>
      <div class="max-w-3xl mx-auto px-6 text-center relative z-10">
        <h2
          class="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4"
        >
          O que você faria com +10 horas por semana?
        </h2>
        <p class="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
          Milhares de professores já recuperaram seu tempo. Comece gratuitamente
          hoje mesmo.
        </p>
        <RouterLink
          to="/signup"
          class="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold text-emerald-700 bg-white hover:bg-emerald-50 rounded-xl transition-all shadow-lg shadow-emerald-950/20 active:scale-95"
        >
          Criar conta gratuita
          <i class="pi pi-arrow-right text-sm"></i>
        </RouterLink>

        <!-- Trust badges -->
        <div class="flex flex-wrap items-center justify-center gap-6 mt-10 text-emerald-100/80 text-sm">
          <span class="inline-flex items-center gap-1.5">
            <i class="pi pi-lock text-xs"></i>
            Dados criptografados
          </span>
          <span class="inline-flex items-center gap-1.5">
            <i class="pi pi-credit-card text-xs"></i>
            Sem cartão de crédito
          </span>
          <span class="inline-flex items-center gap-1.5">
            <i class="pi pi-shield text-xs"></i>
            Privacidade garantida
          </span>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-400">
      <div
        class="max-w-7xl 2xl:max-w-[90rem] mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
      >
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <img
              :src="logoSrc"
              alt="LetMeDoIt"
              class="h-8 w-auto"
            />
          </div>
          <p class="text-sm text-slate-500 leading-relaxed max-w-xs">
            Plataforma inteligente para correção automática de provas e gestão
            de submissões escolares.
          </p>
          <div class="flex items-center gap-4 pt-2">
            <a
              href="#"
              class="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              aria-label="Instagram"
            >
              <i class="pi pi-instagram text-sm"></i>
            </a>
            <a
              href="#"
              class="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              aria-label="YouTube"
            >
              <i class="pi pi-youtube text-sm"></i>
            </a>
            <a
              href="#"
              class="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              aria-label="LinkedIn"
            >
              <i class="pi pi-linkedin text-sm"></i>
            </a>
          </div>
        </div>

        <div class="space-y-4">
          <h4 class="text-xs font-bold text-white uppercase tracking-widest">
            Produto
          </h4>
          <nav class="flex flex-col gap-3">
            <RouterLink
              to="/signup"
              class="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Cadastre-se
            </RouterLink>
            <RouterLink
              to="/signin"
              class="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Entrar
            </RouterLink>
            <a
              href="#"
              class="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Preços
            </a>
            <a
              href="#"
              class="text-sm text-slate-400 hover:text-white transition-colors"
            >
              FAQ
            </a>
          </nav>
        </div>

        <div class="space-y-4">
          <h4 class="text-xs font-bold text-white uppercase tracking-widest">
            Empresa
          </h4>
          <nav class="flex flex-col gap-3">
            <a
              href="#"
              class="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Sobre Nós
            </a>
            <a
              href="#"
              class="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Blog
            </a>
            <a
              href="#"
              class="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Carreiras
            </a>
            <a
              href="#"
              class="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Termos de Uso
            </a>
          </nav>
        </div>

        <div class="space-y-4">
          <h4 class="text-xs font-bold text-white uppercase tracking-widest">
            Entre em contato
          </h4>
          <nav class="flex flex-col gap-3">
            <a
              href="mailto:oi@letmedoit.app"
              class="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <i class="pi pi-envelope text-xs text-emerald-400"></i>
              oi@letmedoit.app
            </a>
            <a
              href="#"
              class="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <i class="pi pi-comments text-xs text-emerald-400"></i>
              Chat ao Vivo
            </a>
            <a
              href="#"
              class="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <i class="pi pi-whatsapp text-xs text-emerald-400"></i>
              WhatsApp
            </a>
            <a
              href="#"
              class="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <i class="pi pi-question-circle text-xs text-emerald-400"></i>
              Central de Ajuda
            </a>
          </nav>
        </div>
      </div>

      <div class="border-t border-slate-800 py-6">
        <div
          class="max-w-7xl 2xl:max-w-[90rem] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p class="text-xs text-slate-600">
            &copy; 2026 LetMeDoIt. Todos os direitos reservados.
          </p>
          <div class="flex items-center gap-4">
            <a
              href="#"
              class="text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              Privacidade
            </a>
            <a
              href="#"
              class="text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              Termos
            </a>
            <a
              href="#"
              class="text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              Cookies
            </a>
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

.testimonial-enter-active,
.testimonial-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.testimonial-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.testimonial-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.screenshot-enter-active,
.screenshot-leave-active {
  transition: all 0.6s ease;
}

.screenshot-enter-from {
  opacity: 0;
}

.screenshot-leave-to {
  opacity: 0;
}

@keyframes progressBar {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
</style>
