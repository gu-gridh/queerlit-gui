import { createRouter, createWebHistory } from "vue-router";
import SearchForm from "@/components/SearchForm.vue";
import Results from "@/components/Results.vue";
import ThesaurusInfo from "@/components/ThesaurusInfo.vue";

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
  },
  {
    path: "/ao/:id",
    component: () => import(/* webpackChunkName: "term" */ "@/views/Term.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
