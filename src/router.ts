import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import SearchForm from "@/search/SearchForm.vue";
import ThesaurusInfo from "@/terms/ThesaurusInfo.vue";
import NotFound from "@/views/NotFound.vue";
const Results = () => import("@/search/Results.vue");

// Specify typing for router meta.
import "vue-router";
declare module "vue-router" {
  interface RouteMeta {
    title?: string;
  }
}

const routes: RouteRecordRaw[] = [
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
    path: "/special/:id",
    name: "LocalWork",
    components: {
      side: SearchForm,
      default: () =>
        import(/* webpackChunkName: "work" */ "@/views/LocalWork.vue"),
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
