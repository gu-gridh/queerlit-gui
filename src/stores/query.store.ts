import type { HasId, Person } from "@/services/libris.types";
import type { GenreForm, Term } from "@/types/work";
import { defineStore } from "pinia";

export type QueryState = {
  text: string;
  terms: Term[];
  termsSecondary: Term[];
  hierarchical: boolean;
  title: string;
  author: (Person & HasId) | null;
  yearStart: number | null;
  yearEnd: number | null;
  genreform: GenreForm | null;
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

export default defineStore("query", {
  state: (): QueryState => getInitialState(),
  actions: {
    setQuery({
      text,
      terms,
      termsSecondary,
      hierarchical,
      title,
      author,
      yearStart,
      yearEnd,
      genreform,
    }: Partial<QueryState>) {
      // Modify each value only if it is given.
      if (text !== undefined) this.text = text;
      if (terms !== undefined) this.terms = terms;
      if (termsSecondary !== undefined) this.termsSecondary = termsSecondary;
      if (hierarchical !== undefined) this.hierarchical = !!hierarchical;
      if (title !== undefined) this.title = title;
      if (author !== undefined) this.author = author;
      if (yearStart !== undefined) this.yearStart = yearStart;
      if (yearEnd !== undefined) this.yearEnd = yearEnd;
      if (genreform !== undefined) this.genreform = genreform;
    },
    resetQuery() {
      this.$reset();
    },
  },
});
