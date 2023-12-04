import useRootStore from "@/stores/root.store";
import useQueryStore, { type QueryState } from "@/stores/query.store";
import { useRouter } from "vue-router";
import debounce from "lodash/debounce";
import type { DebouncedFunc } from "lodash";
import { search } from "@/services/libris.service";
import useLocalWorks from "./localWorks.composable";

// Keep the debounced function in module scope, because it needs to be identical across all usages of this composable.
// But the function can only be actually defined inside useSearch, as it depends on other composables.
let doSearchDebounced: DebouncedFunc<() => Promise<void>>;

export default function useSearch() {
  const store = useRootStore();
  const queryStore = useQueryStore();
  const { searchLocal } = useLocalWorks();
  const router = useRouter();

  /** Search Libris using the query, then set results. */
  async function doSearch({ retain }: { retain?: boolean } = {}) {
    // The query might change while waiting for response. Remember current query.
    const currentSerializedQuery = queryStore.serializedQuery;
    store.setSearching(currentSerializedQuery);

    if (!retain) {
      store.offset = 0;
      router.push("/");
    }
    try {
      const { items, total, histogram } = await search({
        text: queryStore.text,
        terms: queryStore.terms.map((term) => term.id),
        termsSecondary: queryStore.termsSecondary.map((term) => term.id),
        hierarchical: queryStore.hierarchical,
        title: queryStore.title,
        author: queryStore.author?.["@id"],
        yearStart:
          queryStore.yearStart != null ? queryStore.yearStart : undefined,
        yearEnd: queryStore.yearEnd != null ? queryStore.yearEnd : undefined,
        genreform: queryStore.genreform?.id,
        sort: store.sort,
        offset: store.offset,
      });

      // In case of concurrent requests, only use the last.
      if (queryStore.serializedQuery != currentSerializedQuery) {
        console.log(
          "Query has changed since search request; dropping results.",
        );
        return;
      }

      store.results = items;
      store.histogram = histogram;
      store.total = total;
    } catch (error) {
      console.error(error);
      if (error instanceof Error && !("reponse" in error)) {
        store.setError("Det går inte att nå Libris webbtjänst just nu");
      }
    } finally {
      store.setSearching();
    }
    searchLocal();
  }

  // For each usage of this composable, the function is debounced anew and assigned to the module-scope variable.
  doSearchDebounced = debounce(doSearch, 50);

  /** Modify query and trigger search */
  function setQuery(params: Partial<QueryState>) {
    const queryBefore = queryStore.serializedQuery;

    // Modify each value only if it is given.
    if (params.text !== undefined) queryStore.text = params.text;
    if (params.terms !== undefined) queryStore.terms = params.terms;
    if (params.termsSecondary !== undefined)
      queryStore.termsSecondary = params.termsSecondary;
    if (params.hierarchical !== undefined)
      queryStore.hierarchical = !!params.hierarchical;
    if (params.title !== undefined) queryStore.title = params.title;
    if (params.author !== undefined) queryStore.author = params.author;
    if (params.yearStart !== undefined) queryStore.yearStart = params.yearStart;
    if (params.yearEnd !== undefined) queryStore.yearEnd = params.yearEnd;
    if (params.genreform !== undefined) queryStore.genreform = params.genreform;

    // Search if there was a meaningful change.
    if (queryStore.serializedQuery != queryBefore) {
      // Use debounce, so multiple setQuery at the same time will trigger search only once.
      doSearchDebounced();
    }
  }

  return {
    doSearch,
    setQuery,
  };
}
