import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";

export default function useQuery() {
  const store = useStore();

  const text = computed(() => store.state.query.text);
  const terms = computed(() => store.state.query.terms);
  const title = computed(() => store.state.query.title);
  const author = computed(() => store.state.query.author);

  function setQuery(obj) {
    store.commit("setQuery", obj);
  }

  return {
    text,
    terms,
    title,
    author,
    setQuery,
  };
}
