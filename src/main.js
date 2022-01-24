import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "./store";
import "./index.css";
import "./fontawesome";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

createApp(App) //
  .use(router)
  .use(store)
  .component("icon", FontAwesomeIcon)
  .mount("#app");
