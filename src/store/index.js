import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      results: null,
    };
  },
  mutations: {
    setResults(state, results) {
      state.results = results;
    },
  },
});
