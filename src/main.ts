import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import { createPinia } from "pinia";
import "@/index.css";
import "@/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueDragDrop from "vue3-drag-drop";
import matomo from "vue-matomo";
import { createHead } from "@unhead/vue/client";

const app = createApp(App) //
  .use(router)
  .use(createPinia())
  .use(createHead())
  .component("Icon", FontAwesomeIcon)
  .use(VueDragDrop);

// vue-matomo is a CommonJS-only package; some bundlers (e.g. Rolldown in
// Vite 8) wrap its default export in an extra module object, which would make
// app.use() silently do nothing. Unwrap it if needed.
const matomoPlugin = (matomo as { default?: typeof matomo }).default ?? matomo;

// Use the Matomo plugin only if configured in env.
if (import.meta.env.VITE_MATOMO_URL && import.meta.env.VITE_MATOMO_ID) {
  app.use(matomoPlugin, {
    host: import.meta.env.VITE_MATOMO_URL,
    siteId: import.meta.env.VITE_MATOMO_ID,
  });
}

app.mount("#app");
