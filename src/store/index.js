import { createStore } from "vuex";

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
      expandSearch: 1,
      results: null,
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
    setResults(state, results) {
      state.results = results;
    },
    setExpandSearch(state, expandSearch) {
      state.expandSearch = expandSearch;
    },
  },
  getters: {
    isSearchExpanded(state) {
      const { terms, title, author, yearStart, yearEnd, genreform } =
        state.query;
      const hasTermsInput = terms.length > 0;
      const hasMoreInput = title || author || yearStart || yearEnd || genreform;
      const expandSearchAuto = hasMoreInput ? 2 : hasTermsInput ? 1 : 0;
      return Math.max(state.expandSearch, expandSearchAuto);
    },
  },
});
