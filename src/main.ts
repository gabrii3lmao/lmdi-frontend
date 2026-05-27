import { createApp } from "vue";
import "@/assets/main.css";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import ToastService from 'primevue/toastservice';
import Aura from "@primevue/themes/aura";
import { createPinia } from "pinia";
import "primeicons/primeicons.css"
const app = createApp(App);
const pinia = createPinia();

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
// teste
