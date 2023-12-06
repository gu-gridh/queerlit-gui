import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import useMatomo from "./matomo.composable";
import use404 from "./404.composable";

const titleTemplate = (s?: string) => (s ? `${s} • Queerlit` : "Queerlit");

export default function useTitle(customTitle?: string) {
  const route = useRoute();
  const { trackPage } = useMatomo();
  const { is404 } = use404();
  const head = useHead({ titleTemplate });

  function setTitle(title: string = "") {
    // Set the head <title> element
    head?.patch({ title, titleTemplate });
    // Track the page view
    is404.value ? trackPage(`404/URL = ${route.fullPath}`) : trackPage(title);
  }

  // Supply argument to set the title immediately
  if (customTitle != undefined) setTitle(customTitle);

  return { setTitle };
}
