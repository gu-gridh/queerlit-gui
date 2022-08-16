import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

// Keep a global flag for the missing route path.
const missingRoute = ref();

export default function use404() {
  const route = useRoute();
  const is404 = computed(() => !!missingRoute.value);

  /** Flag the current route as missing. */
  function flag404() {
    missingRoute.value = route.fullPath;
  }

  // Reset the flag when navigating from the missing route.
  watch(route, () => (missingRoute.value = null));

  return {
    flag404,
    is404,
  };
}
