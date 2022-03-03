import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "./store";
import "./index.css";
import "./fontawesome";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { dragscrollNext } from "vue-dragscroll";

createApp(App) //
  .use(router)
  .use(store)
  .component("icon", FontAwesomeIcon)
  .directive("dragscroll", dragscrollNext)
  .mount("#app");
