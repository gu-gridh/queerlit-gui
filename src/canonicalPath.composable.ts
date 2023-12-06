import { useRouter, useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import { pathUrl, slugify, urlBasename } from "./util";
import type { Term, Work } from "./types/work";

type RouteParams = {
  slug?: string;
  [k: string]: any;
};

export function useCanonicalPath() {
  const route = useRoute();
  const router = useRouter();
  const head = useHead({});

  /** Get the preferred path for a route */
  function getCanonicalPath(name: string, params: RouteParams) {
    // Magically slugify any param named "slug"
    if (params.slug) params.slug = slugify(params.slug);
    // Get the route and its path
    const matchedRoute = router.resolve({ name, params });
    return matchedRoute.path;
  }

  /** Get the preferred path for a Libris work page */
  function getWorkPath(work: Work) {
    return getCanonicalPath("Work", { id: work.id, slug: work.title });
  }

  /** Get the preferred path for a QLIT term page */
  function getTermPath(term: Term) {
    // A QLIT term from Libris doesn't have the "name" prop, but it can be read from the uri
    const name = "name" in term ? term.name : urlBasename(term.id);
    return getCanonicalPath("Term", { id: name, slug: term.label });
  }

  /** Replace current path if needed */
  function ensurePath(path: string) {
    // Add canonical link
    head?.patch({ link: [{ rel: "canonical", href: pathUrl(path) }] });
    // Modify current url
    if (route.path != path) {
      window.history.replaceState(window.history.state, "", path);
    }
  }

  return {
    getCanonicalPath,
    getWorkPath,
    getTermPath,
    ensurePath,
  };
}
