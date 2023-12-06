import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useHead } from "@unhead/vue";
import { pathUrl } from "./util";
import SearchForm from "@/search/SearchForm.vue";
import ThesaurusInfo from "@/terms/ThesaurusInfo.vue";
import NotFound from "@/views/NotFound.vue";
const Results = () => import("@/search/Results.vue");

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
    path: "/work/:id/:slug?",
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
  },
  {
    path: "/subjects/:id/:slug?",
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

router.afterEach((to) => {
  useHead({ link: [{ rel: "canonical", href: pathUrl(to.path) }] });
});

export default router;
