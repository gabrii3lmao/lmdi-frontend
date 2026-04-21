// router/index.ts (ou router.js)
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/auth/Login.vue";
import Cadastro from "@/views/auth/Cadastro.vue";
import Home from "@/views/Home.vue";
import SendEmailReset from "@/views/auth/SendEmailReset.vue";
import ResetPassword from "@/views/auth/ResetPassword.vue";
import TurmasDashboard from "@/views/TurmasDashboard.vue";
import Duvidas from "@/views/utils/Duvidas.vue";
import ModeloProva from "@/views/ModeloProva.vue";
// @ts-ignore
import Turma from "../views/Turma.vue";
import NotFound from "@/views/utils/NotFound.vue"; // <-- Nova importação
import Submissoes from "@/views/Submissoes.vue";

const routes = [
  {
    path: "/signin",
    name: "login",
    component: Login,
    meta: { hideSidebar: true },
  },
  {
    path: "/signup",
    name: "register",
    component: Cadastro,
    meta: { hideSidebar: true },
  },
  {
    path: "/",
    name: "home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: SendEmailReset,
    meta: { hideSidebar: true }, // Sugestão: esconder sidebar nessas também
  },
  {
    path: "/reset-password/:token",
    name: "reset-password",
    component: ResetPassword,
    meta: { hideSidebar: true }, // Sugestão: esconder sidebar nessas também
  },
  {
    path: "/classes",
    name: "showclasses",
    component: TurmasDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/faq",
    name: "duvidas-frequentes",
    component: Duvidas,
    meta: { requiresAuth: true },
  },
  {
    path: "/templates",
    name: "modelo-provas",
    component: ModeloProva,
    meta: { requiresAuth: true },
  },
  {
    path: `/classes/:id`,
    name: "provas-turma",
    component: Turma,
    meta: { requiresAuth: true },
  },
  {
    path: "/submissions",
    name: "submissoes",
    component: Submissoes,
    meta: { requiresAuth: true },
  },

  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
    meta: { hideSidebar: true }, // Esconde a sidebar para a tela de erro ficar limpa
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    next("/signin");
  } else {
    next();
  }
});

export default router;
