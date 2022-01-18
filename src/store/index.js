import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      query: {
        text: "",
        terms: [],
        title: "",
        author: "",
        yearStart: 1850,
        yearEnd: 2022,
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
      if (yearStart) state.query.yearStart = yearStart;
      if (yearEnd) state.query.yearEnd = yearEnd;
      if (genreform) state.query.genreform = genreform;
    },
    setResults(state, results) {
      state.results = results;
    },
  },
});
