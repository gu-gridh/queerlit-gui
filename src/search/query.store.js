export default {
  state: {
    text: "",
    terms: [],
    title: "",
    author: null,
    yearStart: null,
    yearEnd: null,
    genreform: null,
  },
  mutations: {
    setQuery(
      state,
      { text, terms, title, author, yearStart, yearEnd, genreform }
    ) {
      // Modify each value only if it is given.
      if (text !== undefined) state.text = text;
      if (terms !== undefined) state.terms = terms;
      if (title !== undefined) state.title = title;
      if (author !== undefined) state.author = author;
      if (yearStart !== undefined) state.yearStart = parseInt(yearStart);
      if (yearEnd !== undefined) state.yearEnd = parseInt(yearEnd);
      if (genreform !== undefined) state.genreform = genreform;
    },
  },
  getters: {
    isQueryEmpty(state) {
      return (
        !state.text &&
        !state.title &&
        !state.author &&
        !state.yearStart &&
        !state.yearEnd &&
        !state.genreform &&
        !state.terms.length
      );
    },
  },
};
