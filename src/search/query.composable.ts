import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "@/store";
import { getInitialState, type QueryState } from "./query.store";
import type { LibrisGenreForm, LibrisPerson } from "@/services/libris.types";

export default function useQuery() {
  const store = useStore(key);

  // TODO Switch to Pinia and remove the `?.` and `|| X`.
  const initialQuery = getInitialState();
  const text = computed(() => store.state.query?.text || "");
  const terms = computed(() => store.state.query?.terms || []);
  const termsSecondary = computed(
    () => store.state.query?.termsSecondary || []
  );
  const hierarchical = computed(
    () => store.state.query?.hierarchical || initialQuery.hierarchical
  );
  const title = computed(() => store.state.query?.title || "");
  const author = computed(() => store.state.query?.author);
  const yearStart = computed(() => store.state.query?.yearStart);
  const yearEnd = computed(() => store.state.query?.yearEnd);
  const genreform = computed(() => store.state.query?.genreform);

  function setQuery(obj: Partial<QueryState>) {
    store.commit("setQuery", obj);
  }

  function resetQuery() {
    store.commit("resetQuery");
  }

  const serializedQuery = computed(() =>
    JSON.stringify([
      text.value,
      terms.value?.map((term) => term._label) || [],
      termsSecondary.value?.map((term) => term._label) || [],
      terms.value?.length || termsSecondary.value?.length
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
      !terms.value?.length &&
      !termsSecondary.value?.length &&
      !title.value &&
      !author.value &&
      !yearStart.value &&
      !yearEnd.value &&
      !genreform.value
  );

  const getPersonLabel = (item: LibrisPerson) =>
    `${item.givenName} ${item.familyName}` +
    (item.lifeSpan ? ` (${item.lifeSpan})` : "");

  const getGenreformLabel = (item: LibrisGenreForm) =>
    `${item.prefLabel} (${item.inScheme?.code})`;

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
