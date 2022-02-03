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
      results: null,
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
  },
  getters: {
    isSearching: (state) => state.currentSearch != null,
  },
});
