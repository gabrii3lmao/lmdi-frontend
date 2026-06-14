<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";

const router = useRouter();

const currentSlide = ref(0);
let slideInterval: ReturnType<typeof setInterval>;

const features = [
  {
    icon: "pi-building",
    title: "Gestão de Turmas",
    desc: "Crie, edite e organize suas turmas em um painel intuitivo.",
  },
  {
    icon: "pi-pen-to-square",
    title: "Gabaritos Mestres",
    desc: "Defina o gabarito oficial de cada prova com poucos cliques.",
  },
  {
    icon: "pi-camera",
    title: "Correção por Imagem",
    desc: "Tire foto dos cartões-resposta e deixe a IA corrigir automaticamente.",
  },
  {
    icon: "pi-chart-line",
    title: "Métricas em Tempo Real",
    desc: "Acompanhe o desempenho da turma com estatísticas atualizadas.",
  },
  {
    icon: "pi-eye",
    title: "Notas em tempo real",
    desc: "Após o upload, veja a nota de cada aluno e acompanhe o desempenho.",
  },
  {
    icon: "pi-lock",
    title: "Segurança e Privacidade",
    desc: "Seus dados protegidos com autenticação segura e criptografia.",
  },
];

const depoimentos = [
  {
    quote:
      "Antes de conhecer o LetMeDoIt, eu passava horas corrigindo provas manualmente. Agora é só fotografar e pronto. Minhas noites livres voltaram.",
    author: "Dra. Carla Mendes",
    role: "Professora de Matemática · Ensino Médio",
  },
  {
    quote:
      "Com 200 alunos por turma, corrigir provas era inviável. O sistema de IA reduziu meu tempo de correção em 90% e ainda gera relatórios de desempenho automáticos.",
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
      "O relatório de desempenho que o sistema gera automaticamente me poupou dias de trabalho fechando notas no fim do bimestre. É impressionante.",
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

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % depoimentos.length;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 5000);
};

onMounted(() => {
  if (localStorage.getItem("token")) {
    router.replace("/dashboard");
    return;
  }
  slideInterval = setInterval(nextSlide, 5000);
});

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
});
</script>

<template>
  <div class="min-h-screen bg-white font-sans">
    <!-- Navbar -->
    <header
      class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200"
    >
      <div
        class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between"
      >
        <RouterLink to="/" class="flex items-center gap-3 group">
          <img
            src="/logo1.png"
            alt="LetMeDoIt"
            class="h-9 w-auto"
          />
        <p class="text-xl md:text-xl lg:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">Let me <span class="text-emerald-600">Do it</span></p>
        </RouterLink>
        <nav class="flex items-center gap-3">
          <RouterLink
            to="/signin"
            class="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Entrar
          </RouterLink>
          <RouterLink
            to="/signup"
            class="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-sm active:scale-95"
          >
            Cadastre-se Grátis
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <section
      class="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-emerald-50/50 to-white"
    >
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent pointer-events-none"
      ></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-slate-200/20 via-transparent to-transparent pointer-events-none"
      ></div>

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div
          class="max-w-3xl mx-auto text-center space-y-8"
        >
          <div
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold border border-emerald-200"
          >
            <i class="pi pi-sparkles text-xs"></i>
            Correção de provas por inteligência artificial
          </div>

          <h1
            class="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            A maneira mais
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700"
            >inteligente</span
            >
            de corrigir provas.
          </h1>

          <p
            class="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            Crie gabaritos, fotografe os cartões-resposta e deixe a IA fazer a
            correção automaticamente. Economize horas de trabalho e acompanhe o
            desempenho da sua turma em tempo real.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <RouterLink
              to="/signup"
              class="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-95"
            >
              Começar Grátis
              <i class="pi pi-arrow-right text-sm"></i>
            </RouterLink>
            <RouterLink
              to="/signin"
              class="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200 hover:border-slate-300 shadow-sm active:scale-95"
            >
              Já tenho conta
            </RouterLink>
          </div>
        </div>

        <!-- App screenshot -->
        <div class="mt-16 max-w-5xl mx-auto relative">
          <div
            class="relative rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden"
          >
            <div
              class="h-10 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 px-4"
            >
              <span class="w-3 h-3 rounded-full bg-red-400"></span>
              <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span class="w-3 h-3 rounded-full bg-green-400"></span>
            </div>
            <img
              src="/app-screenshot-dashboard.png"
              alt="Dashboard do LetMeDoIt"
              class="w-full h-auto"
            />
          </div>

          <div
            class="absolute -bottom-4 -right-4 bg-emerald-600 text-white rounded-xl px-5 py-3 shadow-lg shadow-emerald-500/30 flex items-center gap-3"
          >
            <i class="pi pi-check-circle text-xl"></i>
            <div>
              <p class="text-sm font-bold">Correção Instantânea</p>
              <p class="text-xs text-emerald-200">com IA</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 md:py-28 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2
            class="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4"
          >
            Tudo que você precisa para
            <span class="text-emerald-600">gerenciar provas</span>
          </h2>
          <p class="text-slate-500 text-lg">
            Uma plataforma completa para educadores que querem economizar tempo
            e ter mais controle sobre o desempenho dos alunos.
          </p>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="(f, i) in features"
            :key="i"
            class="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
          >
            <div
              class="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300"
            >
              <i :class="['pi text-xl', f.icon]"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-800 mb-2">
              {{ f.title }}
            </h3>
            <p class="text-sm text-slate-500 leading-relaxed">
              {{ f.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-20 md:py-28 bg-slate-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2
            class="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4"
          >
            Como funciona
          </h2>
          <p class="text-slate-500 text-lg">
            Três passos simples para automatizar a correção das suas provas.
          </p>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div
            v-for="(step, i) in [
              {
                icon: 'pi-users',
                title: '1. Crie sua Turma',
                desc: 'Cadastre suas turmas e organize seus alunos em poucos cliques.',
              },
              {
                icon: 'pi-file-check',
                title: '2. Monte o Gabarito',
                desc: 'Defina o número de questões, alternativas e o gabarito oficial.',
              },
              {
                icon: 'pi-images',
                title: '3. Corrija por Foto',
                desc: 'Envie as fotos dos cartões-resposta e receba as notas automaticamente.',
              },
            ]"
            :key="i"
            class="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center"
          >
            <div
              class="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-6"
            >
              <i :class="['pi text-2xl', step.icon]"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-3">
              {{ step.title }}
            </h3>
            <p class="text-slate-500">
              {{ step.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 md:py-28 bg-white">
      <div class="max-w-5xl mx-auto px-6 text-center">
        <h2
          class="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4"
        >
          Quem usa, <span class="text-emerald-600">recomenda</span>
        </h2>
        <p class="text-slate-500 text-lg max-w-xl mx-auto">
          Veja o que professores estão falando sobre o LetMeDoIt.
        </p>

        <div class="relative mt-12 max-w-2xl mx-auto">
          <div
            class="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200"
          >
            <div class="flex items-center justify-center gap-1 mb-6">
              <i
                v-for="_ in 5"
                :key="_"
                class="pi pi-star-fill text-amber-400 text-xl"
              ></i>
            </div>
            <p
              class="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed italic mb-8"
            >
              "{{ depoimentos[currentSlide]!.quote }}"
            </p>
            <p class="text-lg font-bold text-slate-900">
              {{ depoimentos[currentSlide]!.author }}
            </p>
            <p class="text-sm text-slate-500 mt-1">
              {{ depoimentos[currentSlide]!.role }}
            </p>

            <div class="flex items-center justify-center gap-2 mt-8">
              <button
                v-for="(_, index) in depoimentos"
                :key="index"
                @click="goToSlide(index)"
                class="transition-all duration-500 rounded-full"
                :class="
                  currentSlide === index
                    ? 'w-8 h-2.5 bg-emerald-500'
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                "
              ></button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 md:py-28 bg-gradient-to-br from-emerald-600 to-emerald-800">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <h2
          class="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4"
        >
          Pronto para revolucionar suas correções?
        </h2>
        <p class="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
          Milhares de professores já estão usando. Comece gratuitamente hoje
          mesmo.
        </p>
        <RouterLink
          to="/signup"
          class="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold text-emerald-700 bg-white hover:bg-emerald-50 rounded-xl transition-all shadow-lg active:scale-95"
        >
          Criar conta gratuita
          <i class="pi pi-arrow-right text-sm"></i>
        </RouterLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-400">
      <div
        class="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
      >
        <!-- Brand -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <img
              src="/logo1.png"
              alt="LetMeDoIt"
              class="h-8 w-auto brightness-0 invert"
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

        <!-- Produto -->
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

        <!-- Empresa -->
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

        <!-- Contato -->
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

      <div
        class="border-t border-slate-800 py-6"
      >
        <div
          class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p class="text-xs text-slate-600">
            © 2026 LetMeDoIt. Todos os direitos reservados.
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
