import { computed, reactive, watch } from "vue";
import { useRoute } from "vue-router";

const history = reactive<string[]>([]);

export default function useHistory() {
  const route = useRoute();

  const curr = computed<string | undefined>(() => history[history.length - 1]);
  const prev = computed<string | undefined>(() => history[history.length - 2]);

  function activateHistory() {
    // No need for `immediate: true`, because at the first load the route gets changed from "/" to the actual route.
    watch(route, (to) => updateHistory(to.path));
  }

  function updateHistory(path: string) {
    // Reloading same page.
    if (path == curr.value) {
      return;
    }
    // Going back.
    if (path == prev.value) {
      history.pop();
      return;
    }
    // Navigating (forward).
    history.push(path);
  }

  return {
    history,
    curr,
    prev,
    activateHistory,
  };
}
