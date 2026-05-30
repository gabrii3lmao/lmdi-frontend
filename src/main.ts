import { createApp } from "vue";
import "@/assets/main.css";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import Aura from "@primevue/themes/aura";
import { createPinia } from "pinia";
import "primeicons/primeicons.css";
import vue3GoogleLogin from "vue3-google-login";
import { VueQueryPlugin } from "@tanstack/vue-query";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const app = createApp(App);
const pinia = createPinia();

app.use(vue3GoogleLogin, {
  clientId: googleClientId,
});

app.use(VueQueryPlugin);
app.use(ConfirmationService);
app.use(ToastService);
app.use(pinia);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: ".my-app-dark",
    },
  },
});

app.use(router);

app.mount("#app");
