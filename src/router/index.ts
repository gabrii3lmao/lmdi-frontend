import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/auth/Login.vue";
import Cadastro from "@/views/auth/Cadastro.vue";
import Home from "@/views/Home.vue";
import SendEmailReset from "@/views/auth/SendEmailReset.vue";
import ResetPassword from "@/views/auth/ResetPassword.vue";
import Turmas from "@/views/Turmas.vue";
import Duvidas from "@/views/Duvidas.vue";
import ModeloProva from "@/views/ModeloProva.vue";

const routes = [
  {
    path: "/signin",
    name: "login",
    component: Login,
  },
  {
    path: "/signup",
    name: "register",
    component: Cadastro,
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
  },
  {
    path: "/reset-password/:token",
    name: "reset-password",
    component: ResetPassword,
  },
  {
    path: "/classes",
    name: "showclasses",
    component: Turmas,
  },
  {
    path: "/faq",
    name: "duvidas-frequentes",
    component: Duvidas,
  },
  {
    path: "/templates",
    name: "modelo-provas",
    component: ModeloProva,
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
