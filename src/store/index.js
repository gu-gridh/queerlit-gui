import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      query: {
        text: "",
        terms: [],
        title: "",
        author: "",
        yearStart: null,
        yearEnd: null,
        genreform: "",
      },
      results: null,
    };
  },
  mutations: {
    setQuery(
      state,
      { text, terms, title, author, yearStart, yearEnd, genreform }
    ) {
      if (text != null) state.query.text = text;
      if (terms) state.query.terms = terms;
      if (title != null) state.query.title = title;
      if (author != null) state.query.author = author;
      if (yearStart) state.query.yearStart = parseInt(yearStart);
      if (yearEnd) state.query.yearEnd = parseInt(yearEnd);
      if (genreform) state.query.genreform = genreform;
    },
    setResults(state, results) {
      state.results = results;
    },
  },
});
