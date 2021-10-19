import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      query: {
        text: "",
        terms: [],
      },
      results: null,
    };
  },
  mutations: {
    setQuery(state, { text, terms }) {
      if (text != null) state.query.text = text;
      if (terms) state.query.terms = terms;
    },
    setResults(state, results) {
      state.results = results;
    },
  },
});
