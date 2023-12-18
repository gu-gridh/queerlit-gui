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

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Search",
    components: {
      side: SearchForm,
      default: () => import("@/search/SearchResults.vue"),
    },
  },
  {
    path: "/work/:id/:slug?",
    name: "Work",
    components: {
      side: SearchForm,
      default: () => import("@/views/WorkView.vue"),
    },
  },
  {
    path: "/special/:id",
    name: "LocalWork",
    components: {
      side: SearchForm,
      default: () => import("@/views/LocalWork.vue"),
    },
  },
  {
    path: "/subjects",
    name: "Thesaurus",
    components: {
      side: ThesaurusInfo,
      default: () => import("@/views/ThesaurusView.vue"),
    },
  },
  {
    path: "/subjects/:id/:slug?",
    name: "Term",
    components: {
      side: ThesaurusInfo,
      default: () => import("@/views/TermView.vue"),
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
