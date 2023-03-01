import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";

export default function useQuery() {
  const store = useStore();

  const text = computed(() => store.state.query.text);
  const terms = computed(() => store.state.query.terms);
  const title = computed(() => store.state.query.title);
  const author = computed(() => store.state.query.author);
  const yearStart = computed(() => store.state.query.yearStart);
  const yearEnd = computed(() => store.state.query.yearEnd);
  const genreform = computed(() => store.state.query.genreform);

  function setQuery(obj) {
    store.commit("setQuery", obj);
  }

  function resetQuery() {
    store.commit("resetQuery");
  }

  const serializedQuery = computed(() =>
    JSON.stringify([
      text.value,
      terms.value.map((term) => term.label),
      title.value,
      author.value,
      yearStart.value,
      yearEnd.value,
      genreform.value,
    ])
  );

  return {
    text,
    terms,
    title,
    author,
    yearStart,
    yearEnd,
    genreform,
    setQuery,
    resetQuery,
    serializedQuery,
  };
}
