import { createStore } from "vuex";
import query from "@/search/query.store";
import { union, without } from "lodash";

export default createStore({
  modules: {
    query,
  },
  state: {
    results: null,
    localResults: {},
    total: 0,
    sort: "-meta.modified",
    offset: 0,
    currentSearch: null,
    termTextQuery: "",
    // Remember which nodes in the term tree are expanded,
    // but forget it if the term search query changes.
    termsExpanded: [],
    histogram: {},
    error: null,
  },
  mutations: {
    setSearching(state, query) {
      state.currentSearch = query ? JSON.stringify(query) : null;
    },
    setResults(state, results) {
      state.results = results;
    },
    setLocalResults(state, results) {
      state.localResults = results;
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
    setTermTextQuery(state, termTextQuery) {
      state.termTextQuery = termTextQuery;
      state.termsExpanded = [];
    },
    toggleTermExpanded(state, { name, expanded }) {
      state.termsExpanded = expanded
        ? union(state.termsExpanded, [name])
        : without(state.termsExpanded, name);
    },
    setHistogram(state, histogram) {
      state.histogram = histogram;
    },
    setError(state, message) {
      state.error = message;
      setTimeout(function () {
        state.error = null;
      }, 5000);
    },
  },
  getters: {
    isSearching: (state) => state.currentSearch != null,
  },
  actions: {},
});
