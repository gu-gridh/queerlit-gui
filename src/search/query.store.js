const getInitialState = () => ({
  text: "",
  terms: [],
  termsSecondary: [],
  hierarchical: true,
  title: "",
  author: null,
  yearStart: null,
  yearEnd: null,
  genreform: null,
});

export default {
  state: getInitialState(),
  mutations: {
    setQuery(
      state,
      {
        text,
        terms,
        termsSecondary,
        hierarchical,
        title,
        author,
        yearStart,
        yearEnd,
        genreform,
      }
    ) {
      // Modify each value only if it is given.
      if (text !== undefined) state.text = text;
      if (terms !== undefined) state.terms = terms;
      if (termsSecondary !== undefined) state.termsSecondary = termsSecondary;
      if (hierarchical !== undefined) state.hierarchical = !!hierarchical;
      if (title !== undefined) state.title = title;
      if (author !== undefined) state.author = author;
      if (yearStart !== undefined) state.yearStart = parseInt(yearStart);
      if (yearEnd !== undefined) state.yearEnd = parseInt(yearEnd);
      if (genreform !== undefined) state.genreform = genreform;
    },
    resetQuery(state) {
      Object.assign(state, getInitialState());
    },
  },
};
