import { createApp } from "vue";
import "@/assets/main.css";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import Aura from "@primevue/themes/aura";
import { definePreset } from "@primevue/themes";
import { createPinia } from "pinia";
import "primeicons/primeicons.css";
import vue3GoogleLogin from "vue3-google-login";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { useThemeStore } from "@/stores/theme";
import { useSidebarStore } from "@/stores/sidebar";
import { connectSocket } from "./services/socket";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Tema escuro "Lousa" — neutros verdes-acinzentados (mesmos hexes da paleta `lousa` do tailwind.config.js)
const lousaDark = {
  0: "#e6efea",
  50: "#f2f7f4",
  100: "#e6efea",
  200: "#c9d9d0",
  300: "#a9bcb2",
  400: "#8aa096",
  500: "#6e857a",
  600: "#4e6459",
  700: "#22312c",
  800: "#131c19",
  900: "#0b1210",
  950: "#060c09",
};

const LousaPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      dark: { surface: lousaDark },
    },
  },
});

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
    preset: LousaPreset,
    options: {
      darkModeSelector: ".my-app-dark",
    },
  },
});

app.use(router);

const themeStore = useThemeStore();
themeStore.init();

const sidebarStore = useSidebarStore();
sidebarStore.init();

const token = localStorage.getItem("token");
if (token) {
  connectSocket(token);
}

app.mount("#app");
