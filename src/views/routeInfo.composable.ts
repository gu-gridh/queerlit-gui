import { useSchemaOrg, defineWebPage } from "@unhead/schema-org/vue";
import { pathUrl } from "@/util";
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import useMatomo from "./matomo.composable";
import use404 from "./404.composable";

type RouteInfo = {
  title?: string;
  path?: string;
  description?: string;
};

const titleTemplate = (s?: string) => (s ? `${s} • Queerlit` : "Queerlit");

/** Update metadata markup and track page view. */
export function useRouteInfo() {
  const route = useRoute();
  const head = useHead({});
  const { is404 } = use404();
  const { trackPage } = useMatomo();

  function setRouteInfo(data: RouteInfo) {
    const path = data.path || route?.path;
    const title = data.title || "";

    // Update url
    if (route.path != path) {
      window.history.replaceState(window.history.state, "", path);
    }

    // Track the page view
    is404.value ? trackPage(`404/URL = ${route.fullPath}`) : trackPage(title);

    // Update head tags
    head?.patch({
      title,
      titleTemplate,
      meta: [
        data.description
          ? { name: "description", content: data.description }
          : {},
      ],
      link: [{ rel: "canonical", href: pathUrl(path) }],
    });

    // Generate structured data snippets
    // Some values are set automatically: https://unhead.unjs.io/schema-org/getting-started/how-it-works#site-page-level-config
    useSchemaOrg([
      // TODO Specify page subtypes, https://unhead.unjs.io/schema-org/schema/webpage#sub-types
      defineWebPage({
        url: pathUrl(path),
        inLanguage: "sv",
      }),
    ]);
  }

  return { setRouteInfo };
}
