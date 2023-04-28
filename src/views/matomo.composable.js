import { ref } from "vue";
import { useRoute } from "vue-router";

/** Keep track of the route in order to skip tracking in case the title is changed again on the same page. */
const lastPath = ref("");

export default function useMatomo() {
  const route = useRoute();

  const host = import.meta.env.VITE_MATOMO_URL;
  const site = import.meta.env.VITE_MATOMO_ID;
  const enabled = host && site;

  const send = (...args) => window._paq.push(args);

  function trackPage(title) {
    if (!enabled) return;
    if (route.fullPath == lastPath.value) return;

    send("setReferrerUrl", lastPath.value);
    send("setCustomUrl", route.fullPath);
    send("setDocumentTitle", title);
    send("trackPageView");

    lastPath.value = route.fullPath;
  }

  return {
    trackPage,
  };
}
