import { createStore } from "vuex";
import { search } from "@/services/libris";

export default createStore({
  state() {
    return {
      query: {
        text: "",
        terms: [],
        title: "",
        author: null,
        yearStart: null,
        yearEnd: null,
        genreform: "",
      },
      results: null,
      total: 0,
      sort: "-publication.year",
      offset: 0,
      currentSearch: null,
    };
  },
  mutations: {
    setQuery(
      state,
      { text, terms, title, author, yearStart, yearEnd, genreform }
    ) {
      if (text !== undefined) state.query.text = text;
      if (terms) state.query.terms = terms;
      if (title !== undefined) state.query.title = title;
      if (author !== undefined) state.query.author = author;
      if (yearStart !== undefined) state.query.yearStart = parseInt(yearStart);
      if (yearEnd !== undefined) state.query.yearEnd = parseInt(yearEnd);
      if (genreform !== undefined) state.query.genreform = genreform;
    },
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
