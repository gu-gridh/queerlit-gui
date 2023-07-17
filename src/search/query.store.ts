export type QueryState = {
  text: string;
  terms: any[];
  termsSecondary: any[];
  hierarchical: boolean;
  title: string;
  author: any;
  yearStart: number | null;
  yearEnd: number | null;
  genreform: any;
};

export const getInitialState: () => QueryState = () => ({
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
      state: QueryState,
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
      }: Partial<QueryState>
    ) {
      // Modify each value only if it is given.
      if (text !== undefined) state.text = text;
      if (terms !== undefined) state.terms = terms;
      if (termsSecondary !== undefined) state.termsSecondary = termsSecondary;
      if (hierarchical !== undefined) state.hierarchical = !!hierarchical;
      if (title !== undefined) state.title = title;
      if (author !== undefined) state.author = author;
      if (yearStart !== undefined) state.yearStart = yearStart;
      if (yearEnd !== undefined) state.yearEnd = yearEnd;
      if (genreform !== undefined) state.genreform = genreform;
    },
    resetQuery(state: QueryState) {
      Object.assign(state, getInitialState());
    },
  },
};
