// router/index.ts (ou router.js)
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/auth/Login.vue";
import Cadastro from "@/views/auth/Cadastro.vue";
import Home from "@/views/Home.vue";
import Landing from "@/views/Landing.vue";
import SendEmailReset from "@/views/auth/SendEmailReset.vue";
import ResetPassword from "@/views/auth/ResetPassword.vue";
import TurmasDashboard from "@/views/TurmasDashboard.vue";
import Duvidas from "@/views/utils/Duvidas.vue";
import ModeloProva from "@/views/Gabaritos.vue";
// @ts-ignore
import Turma from "../views/Turma.vue";
import NotFound from "@/views/utils/NotFound.vue"; // <-- Nova importação
import Submissoes from "@/views/Submissoes.vue";
import Configuracoes from "@/views/Configuracoes.vue";

const routes = [
  {
    path: "/",
    name: "landing",
    component: Landing,
    meta: { hideSidebar: true },
  },
  {
    path: "/dashboard",
    name: "home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/signin",
    name: "login",
    component: Login,
    meta: { hideSidebar: true},
  },
  {
    path: "/signup",
    name: "register",
    component: Cadastro,
    meta: { hideSidebar: true},
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: SendEmailReset,
    meta: { hideSidebar: true}, 
  },
  {
    path: "/reset-password/:token",
    name: "reset-password",
    component: ResetPassword,
    meta: { hideSidebar: true}, 
  },
  {
    path: "/classes",
    name: "showclasses",
    component: TurmasDashboard,
    meta: { requiresAuth: true, title: "Minhas Turmas" },
  },
  {
    path: "/faq",
    name: "duvidas-frequentes",
    component: Duvidas,
    meta: { requiresAuth: true, title: "Perguntas Frequentes" },
  },
  {
    path: "/templates",
    name: "modelo-provas",
    component: ModeloProva,
    meta: { requiresAuth: true, title: "Meus Gabaritos" },
  },
  {
    path: `/classes/:id`,
    name: "provas-turma",
    component: Turma,
    meta: { requiresAuth: true, title: "Provas da Turma" },
  },
  {
    path: "/submissions",
    name: "submissoes",
    component: Submissoes,
    meta: { requiresAuth: true, title: "Submissões dos Alunos" },
  },

  {
    path: "/settings",
    name: "configuracoes",
    component: Configuracoes,
    meta: { requiresAuth: true, title: "Configurações" },
  },

  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
    meta: { hideSidebar: true, title: "Página Não Encontrada" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    return next("/signin");
  }

  const baseTitle = 'Let Me Do It | Gestão de Provas e Submissões';
  const pageTitle = to.meta.title as string;
  
  document.title = pageTitle ? pageTitle : baseTitle;

  next();
});

export default router;
