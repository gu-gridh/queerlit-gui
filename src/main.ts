import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import { createPinia } from "pinia";
import "./index.scss";
import "./fontawesome";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueDragDrop from "vue3-drag-drop";
import matomo from "vue-matomo";
import { createHead } from "@unhead/vue";

const app = createApp(App) //
  .use(router)
  .use(createPinia())
  .use(createHead())
  .component("Icon", FontAwesomeIcon)
  .use(VueDragDrop);

// Use the Matomo plugin only if configured in env.
if (import.meta.env.VITE_MATOMO_URL && import.meta.env.VITE_MATOMO_ID) {
  app.use(matomo, {
    host: import.meta.env.VITE_MATOMO_URL,
    siteId: import.meta.env.VITE_MATOMO_ID,
  });
}

app.mount("#app");
