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
    resetQuery() {
      this.$reset();
    },
  },

  getters: {
    serializedQuery(): string {
      return JSON.stringify([
        this.text,
        this.terms.map((term) => term.label),
        this.termsSecondary.map((term) => term.label),
        this.terms.length || this.termsSecondary.length
          ? this.hierarchical
          : null,
        this.title,
        this.author,
        this.yearStart,
        this.yearEnd,
        this.genreform,
      ]);
    },

    isEmpty(): boolean {
      return (
        !this.text &&
        !this.terms.length &&
        !this.termsSecondary.length &&
        !this.title &&
        !this.author &&
        !this.yearStart &&
        !this.yearEnd &&
        !this.genreform
      );
    },
  },
});
