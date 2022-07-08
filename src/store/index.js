import { createStore } from "vuex";
import { search } from "@/services/libris.service";
import query from "@/search/query.store";

export default createStore({
  modules: {
    query,
  },
  state: {
    results: null,
    total: 0,
    sort: "-publication.year",
    offset: 0,
    currentSearch: null,
  },
  mutations: {
    setSearching(state, query) {
      state.currentSearch = query ? JSON.stringify(query) : null;
    },
    setResults(state, results) {
      state.results = results;
    },
    setTotal(state, total) {
      state.total = total;
    },
    setSort(state, sort) {
      state.sort = sort;
    },
    setOffset(state, offset) {
      state.offset = offset;
    },
  },
  getters: {
    isSearching: (state) => state.currentSearch != null,
  },
  actions: {
    /** Search Libris using the query, then set results. */
    async search({ commit, state }) {
      const query = state.query;
      const { items, total } = await search(
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
      commit("setTotal", total);
      commit("setSearching", false);
    },
  },
});
