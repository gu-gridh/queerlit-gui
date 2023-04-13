import { useStore } from "vuex";
import { debounce } from "lodash";
import { search } from "@/services/libris.service";
import useLocalWorks from "./localWorks.composable";
import useQuery from "./query.composable";
import { useRouter } from "vue-router";

export default function useSearch() {
  const { commit, state } = useStore();
  const { setQuery: setQueryReal, serializedQuery } = useQuery();
  const { searchLocal } = useLocalWorks();
  const router = useRouter();

  /** Search Libris using the query, then set results. */
  async function doSearch({ retain } = {}) {
    console.log("doSearch");

    if (state.currentSearch) {
      console.log("not searching again");
      return;
    }

    commit("setSearching", serializedQuery.value);

    if (!retain) {
      commit("setOffset", 0);
      router.push("/");
    }
    const query = state.query;
    try {
      const { items, total, histogram } = await search(
        query.text,
        query.terms,
        query.termsSecondary,
        query.title,
        query.author,
        query.yearStart,
        query.yearEnd,
        query.genreform,
        state.sort,
        state.offset
      );
      commit("setResults", items);
      commit("setHistogram", histogram);
      commit("setTotal", total);
      searchLocal();
    } catch (error) {
      console.error(error);
      if (!error.response) {
        commit("setError", "Det går inte att nå Libris webbtjänst just nu");
      }
    } finally {
      commit("setSearching", false);
    }
  }

  const doSearchDebounced = debounce(doSearch, 50);

  function setQuery(params) {
    const queryBefore = serializedQuery.value;
    setQueryReal(params);
    if (serializedQuery.value != queryBefore) {
      console.log(serializedQuery.value, queryBefore);
      doSearchDebounced();
    }
  }

  return {
    doSearch,
    setQuery,
  };
}
