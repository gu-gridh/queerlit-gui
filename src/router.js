import { createRouter, createWebHistory } from "vue-router";
import Search from "@/views/Search.vue";

const routes = [
  {
    path: "/",
    component: Search,
  },
  {
    path: "/verk/:id",
    component: () => import(/* webpackChunkName: "work" */ "@/views/Work.vue"),
  },
  {
    path: "/ao/:id",
    component: () => import(/* webpackChunkName: "term" */ "@/views/Term.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
