import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";

export const isRouteLoading = ref(false);

const routes = [
  {
    path: "/",
    name: "landing",
    component: () => import("@/views/Landing.vue"),
    meta: { hideSidebar: true },
  },
  {
    path: "/dashboard",
    name: "home",
    component: () => import("@/views/Home.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/signin",
    name: "login",
    component: () => import("@/views/auth/Login.vue"),
    meta: { hideSidebar: true},
  },
  {
    path: "/signup",
    name: "register",
    component: () => import("@/views/auth/Cadastro.vue"),
    meta: { hideSidebar: true},
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("@/views/auth/SendEmailReset.vue"),
    meta: { hideSidebar: true}, 
  },
  {
    path: "/reset-password/:token",
    name: "reset-password",
    component: () => import("@/views/auth/ResetPassword.vue"),
    meta: { hideSidebar: true}, 
  },
  {
    path: "/verify-email/:token",
    name: "verify-email",
    component: () => import("@/views/auth/VerifyEmail.vue"),
    meta: { hideSidebar: true },
  },
  {
    path: "/classes",
    name: "showclasses",
    component: () => import("@/views/TurmasDashboard.vue"),
    meta: { requiresAuth: true, title: "Minhas Turmas" },
  },
  {
    path: "/faq",
    name: "duvidas-frequentes",
    component: () => import("@/views/utils/Duvidas.vue"),
    meta: { requiresAuth: true, title: "Perguntas Frequentes" },
  },
  {
    path: "/templates",
    name: "modelo-provas",
    component: () => import("@/views/Gabaritos.vue"),
    meta: { requiresAuth: true, title: "Meus Gabaritos" },
  },
  {
    path: `/classes/:id`,
    name: "provas-turma",
    // @ts-expect-error — Turma.vue não tem <script setup lang="ts">
    component: () => import("@/views/Turma.vue"),
    meta: { requiresAuth: true, title: "Provas da Turma" },
  },
  {
    path: "/submissions",
    name: "submissoes",
    component: () => import("@/views/Submissoes.vue"),
    meta: { requiresAuth: true, title: "Submissões dos Alunos" },
  },
  {
    path: "/analytics",
    name: "analytics",
    component: () => import("@/views/Analytics.vue"),
    meta: { requiresAuth: true, title: "Análise de Desempenho" },
  },
  {
    path: "/settings",
    name: "configuracoes",
    component: () => import("@/views/Configuracoes.vue"),
    meta: { requiresAuth: true, title: "Configurações" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/utils/NotFound.vue"),
    meta: { hideSidebar: true, title: "Página Não Encontrada" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  isRouteLoading.value = true;
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    return next("/signin");
  }

  const baseTitle = 'Let Me Do It | Gestão de Provas e Submissões';
  const pageTitle = to.meta.title as string;
  
  document.title = pageTitle ? pageTitle : baseTitle;

  next();
});

router.afterEach(() => {
  isRouteLoading.value = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

export default router;
