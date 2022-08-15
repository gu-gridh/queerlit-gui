import { createRouter, createWebHistory } from "vue-router";
import SearchForm from "@/search/SearchForm.vue";
import Results from "@/search/Results.vue";
import ThesaurusInfo from "@/terms/ThesaurusInfo.vue";

const routes = [
  {
    path: "/",
    components: {
      side: SearchForm,
      default: Results,
    },
  },
  {
    path: "/verk/:id",
    components: {
      side: SearchForm,
      default: () => import(/* webpackChunkName: "work" */ "@/views/Work.vue"),
    },
  },
  {
    path: "/ao",
    components: {
      side: ThesaurusInfo,
      default: () =>
        import(/* webpackChunkName: "ao" */ "@/views/Thesaurus.vue"),
    },
    meta: { title: "Ämnen" },
  },
  {
    path: "/ao/:id",
    components: {
      side: ThesaurusInfo,
      default: () => import(/* webpackChunkName: "term" */ "@/views/Term.vue"),
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
