import { createRouter, createWebHistory } from "vue-router";
import Term from "@/views/Term.vue";
import Thesaurus from "@/views/Thesaurus.vue";
import ThesaurusInfo from "@/terms/ThesaurusInfo.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Thesaurus",
    components: {
      side: ThesaurusInfo,
      default: Thesaurus,
    },
    meta: { title: "Ämnen" },
  },
  {
    path: "/:id",
    name: "Term",
    components: {
      side: ThesaurusInfo,
      default: Term,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    components: {
      default: NotFound,
      side: ThesaurusInfo,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
