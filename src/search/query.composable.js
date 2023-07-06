import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";

export default function useQuery() {
  const store = useStore();

  const text = computed(() => store.state.query.text);
  const terms = computed(() => store.state.query.terms);
  const termsSecondary = computed(() => store.state.query.termsSecondary);
  const hierarchical = computed(() => store.state.query.hierarchical);
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
      terms.value.map((term) => term._label),
      termsSecondary.value.map((term) => term._label),
      terms.value.length || termsSecondary.value.length
        ? hierarchical.value
        : null,
      title.value,
      author.value,
      yearStart.value,
      yearEnd.value,
      genreform.value,
    ])
  );

  const isQueryEmpty = computed(
    () =>
      !text.value &&
      !terms.value.length &&
      !termsSecondary.value.length &&
      !title.value &&
      !author.value &&
      !yearStart.value &&
      !yearEnd.value &&
      !genreform.value
  );

  const getPersonLabel = (item) =>
    `${item.givenName} ${item.familyName}` +
    (item.lifeSpan ? ` (${item.lifeSpan})` : "");

  const getGenreformLabel = (item) =>
    `${item.prefLabel} (${item.inScheme.code})`;

  return {
    text,
    terms,
    termsSecondary,
    hierarchical,
    title,
    author,
    yearStart,
    yearEnd,
    genreform,
    setQuery,
    resetQuery,
    serializedQuery,
    isQueryEmpty,
    getPersonLabel,
    getGenreformLabel,
  };
}
