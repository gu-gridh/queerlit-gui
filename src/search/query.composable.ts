import { computed } from "vue";
import useQueryStore from "@/stores/query.store";
import type { Person } from "@/services/libris.types";
import type { GenreForm } from "@/types/work";
import { storeToRefs } from "pinia";

export default function useQuery() {
  const queryStore = useQueryStore();

  // TODO Make this a getter in queryStore
  const serializedQuery = computed(() =>
    JSON.stringify([
      queryStore.text,
      queryStore.terms.map((term) => term.label),
      queryStore.termsSecondary.map((term) => term.label),
      queryStore.terms.length || queryStore.termsSecondary.length
        ? queryStore.hierarchical
        : null,
      queryStore.title,
      queryStore.author,
      queryStore.yearStart,
      queryStore.yearEnd,
      queryStore.genreform,
    ]),
  );

  // TODO Make this a getter in queryStore
  const isQueryEmpty = computed(
    () =>
      !queryStore.text &&
      !queryStore.terms?.length &&
      !queryStore.termsSecondary?.length &&
      !queryStore.title &&
      !queryStore.author &&
      !queryStore.yearStart &&
      !queryStore.yearEnd &&
      !queryStore.genreform,
  );

  const getPersonLabel = (item: Person) =>
    [item.givenName, item.familyName, item.name].filter(Boolean).join(" ") +
    (item.lifeSpan ? ` (${item.lifeSpan})` : "");

  const getGenreformLabel = (item: GenreForm) =>
    `${item.label} (${item.schemeCode})`;

  return {
    ...storeToRefs(queryStore),
    setQuery: queryStore.setQuery,
    resetQuery: queryStore.resetQuery,
    serializedQuery,
    isQueryEmpty,
    getPersonLabel,
    getGenreformLabel,
  };
}
