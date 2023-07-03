import { useStore } from "vuex";
import { debounce } from "lodash";
import { search } from "@/services/libris.service";
import useLocalWorks from "./localWorks.composable";
import useQuery from "./query.composable";
import { useRouter } from "vue-router";

// Keep the debounced function in module scope, because it needs to be identical across all usages of this composable.
// But the function can only be actually defined inside useSearch, as it depends on other composables.
let doSearchDebounced;

export default function useSearch() {
  const { commit, state } = useStore();
  const { setQuery: setQueryReal, serializedQuery } = useQuery();
  const { searchLocal } = useLocalWorks();
  const router = useRouter();

  /** Search Libris using the query, then set results. */
  async function doSearch({ retain } = {}) {
    // The query might change while waiting for response. Remember current query.
    const currentSerializedQuery = serializedQuery.value;
    commit("setSearching", currentSerializedQuery);

    if (!retain) {
      commit("setOffset", 0);
      router.push("/");
    }
    const query = state.query;
    try {
      const { items, total, histogram } = await search({
        text: query.text,
        terms: query.terms,
        termsSecondary: query.termsSecondary,
        title: query.title,
        author: query.author,
        yearStart: query.yearStart,
        yearEnd: query.yearEnd,
        genreform: query.genreform,
        sort: state.sort,
        offset: state.offset,
      });

      // In case of concurrent requests, only use the last.
      if (serializedQuery.value != currentSerializedQuery) {
        console.log(
          "Query has changed since search request; dropping results."
        );
        return;
      }

      commit("setResults", items);
      commit("setHistogram", histogram);
      commit("setTotal", total);
    } catch (error) {
      console.error(error);
      if (!error.response) {
        commit("setError", "Det går inte att nå Libris webbtjänst just nu");
      }
    } finally {
      commit("setSearching", false);
    }
    searchLocal();
  }

  // For each usage of this composable, the function is debounced anew and assigned to the module-scope variable.
  doSearchDebounced = debounce(doSearch, 50);

  function setQuery(params) {
    const queryBefore = serializedQuery.value;
    setQueryReal(params);
    if (serializedQuery.value != queryBefore) {
      doSearchDebounced();
    }
  }

  return {
    doSearch,
    setQuery,
  };
}
