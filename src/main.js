import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "./store";
import "./index.scss";
import "./fontawesome";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { dragscrollNext } from "vue-dragscroll";
import matomo from "vue-matomo";

const app = createApp(App) //
  .use(router)
  .use(store)
  .component("Icon", FontAwesomeIcon)
  .directive("dragscroll", dragscrollNext);

// Use the Matomo plugin only if configured in env.
if (import.meta.env.VITE_MATOMO_URL && import.meta.env.VITE_MATOMO_ID) {
  app.use(matomo, {
    host: import.meta.env.VITE_MATOMO_URL,
    siteId: import.meta.env.VITE_MATOMO_ID,
    router,
  });
}

app.mount("#app");
