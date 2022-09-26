import { createRouter, createWebHistory } from "vue-router";
import SearchForm from "@/search/SearchForm.vue";
import Results from "@/search/Results.vue";
import ThesaurusInfo from "@/terms/ThesaurusInfo.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Search",
    components: {
      side: SearchForm,
      default: Results,
    },
  },
  {
    path: "/verk/:id",
    name: "Work",
    components: {
      side: SearchForm,
      default: () => import(/* webpackChunkName: "work" */ "@/views/Work.vue"),
    },
  },
  {
    path: "/ao",
    name: "Thesaurus",
    components: {
      side: ThesaurusInfo,
      default: () =>
        import(/* webpackChunkName: "ao" */ "@/views/Thesaurus.vue"),
    },
    meta: { title: "Ämnen" },
  },
  {
    path: "/ao/:id",
    name: "Term",
    components: {
      side: ThesaurusInfo,
      default: () => import(/* webpackChunkName: "term" */ "@/views/Term.vue"),
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    components: {
      default: NotFound,
      side: SearchForm,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
