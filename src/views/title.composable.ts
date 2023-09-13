import { watch, type MaybeRef, type ComputedRef } from "vue";
import { useTitle as vueUseTitle } from "@vueuse/core";
import { useRoute } from "vue-router";
import useMatomo from "./matomo.composable";
import use404 from "./404.composable";

/** Decorate the useTitle of VueUse */
export default function useTitle(
  customTitle?:
    | MaybeRef<string | null | undefined>
    | ComputedRef<string | null | undefined>,
) {
  const route = useRoute();
  const { trackPage } = useMatomo();
  const { is404 } = use404();

  // `customTitle` can be a ref
  const title = customTitle || route.meta.title;
  const titleRef = title
    ? vueUseTitle(title, { titleTemplate: "%s • Queerlit" })
    : // Fallback title (the view must still call `useTitle` for this to take effect)
      vueUseTitle("Queerlit");

  // If/whenever the title is set, track the page view.
  // `titleRef` can be set (to "Queerlit") even if `title` is empty.
  // Not using watchEffect because of side effects in trackPage.
  const onTitleChange = () =>
    is404.value
      ? trackPage(`404/URL = ${route.fullPath}`)
      : titleRef.value && trackPage(titleRef.value);
  watch(titleRef, onTitleChange, { immediate: true });

  return titleRef;
}
