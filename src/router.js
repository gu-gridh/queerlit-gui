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
    path: "/work/:id",
    name: "Work",
    components: {
      side: SearchForm,
      default: () => import(/* webpackChunkName: "work" */ "@/views/Work.vue"),
    },
  },
  {
    path: "/subjects",
    name: "Thesaurus",
    components: {
      side: ThesaurusInfo,
      default: () =>
        import(/* webpackChunkName: "subjects" */ "@/views/Thesaurus.vue"),
    },
    meta: { title: "Ämnen" },
  },
  {
    path: "/subjects/:id",
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
