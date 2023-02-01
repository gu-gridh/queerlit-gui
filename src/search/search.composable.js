import { useStore } from "vuex";
import { search } from "@/services/libris.service";

export default function useSearch() {
  const { commit, state } = useStore();

  /** Search Libris using the query, then set results. */
  async function doSearch({ retain } = {}) {
    if (!retain) {
      commit("setOffset", 0);
    }
    const query = state.query;
    try {
      const { items, total, histogram } = await search(
        query.text,
        query.terms,
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
    } catch (error) {
      console.error(error);
      if (!error.response) {
        commit("setError", "Det går inte att nå Libris webbtjänst just nu");
      }
    }
    commit("setSearching", false);
  }

  return {
    doSearch,
  };
}
