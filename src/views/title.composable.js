import { useTitle as vueUseTitle } from "@vueuse/core";
import { useRoute } from "vue-router";

/** Decorate the useTitle of VueUse */
export default function useTitle(customTitle) {
  const route = useRoute();

  // `customTitle` can be a ref
  const title = customTitle || route.meta.title;
  if (title) {
    return vueUseTitle(title, { titleTemplate: "%s • Queerlit" });
  }
  // Fallback title (the view must still call `useTitle` for this to take effect)
  return vueUseTitle("Queerlit");
}
