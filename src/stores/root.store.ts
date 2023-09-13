import type { LocalWork } from "@/search/localWorks.types";
import type { QlitCollection, QlitName } from "@/services/qlit.types";
import type { Histogram } from "@/types/app";
import union from "lodash/union";
import without from "lodash/without";
import { defineStore } from "pinia";

type State = {
  results: any[] | null;
  localResults: LocalWork[];
  total: number;
  sort: string;
  offset: number;
  currentSearch: string | null;
  dragged: any;
  /** User's input in the thesaurus search box. */
  termTextQuery: string;
  /** A collection chosen in the thesaurus view. */
  termCollection: QlitCollection | null;
  /** Which terms are expanded in the thesaurus tree view. */
  termsExpanded: QlitName[];
  histogram: Histogram;
  error: string | null;
};

export default defineStore("root", {
  state: (): State => ({
    results: null,
    localResults: [],
    total: 0,
    sort: "-meta.modified",
    offset: 0,
    currentSearch: null,
    dragged: null,
    termTextQuery: "",
    termCollection: null,
    // Remember which nodes in the term tree are expanded,
    // but forget it if the term search query changes.
    termsExpanded: [],
    // {1952: 5, ...}
    histogram: {},
    error: null,
  }),

  actions: {
    setSearching(query?: string) {
      this.currentSearch = query || null;
    },

    setTermTextQuery(termTextQuery: string) {
      this.termTextQuery = termTextQuery;
      this.termCollection = null;
      this.termsExpanded = [];
    },

    setTermCollection(collection: QlitCollection | null) {
      this.termTextQuery = "";
      this.termCollection = collection || null;
      this.termsExpanded = [];
    },

    toggleTermExpanded(name: string, expanded: boolean) {
      this.termsExpanded = expanded
        ? union(this.termsExpanded, [name])
        : without(this.termsExpanded, name);
    },

    patchHistogram(histogram: Record<number, number>) {
      for (const year in histogram) {
        this.histogram[year] = (this.histogram[year] || 0) + histogram[year];
      }
    },

    setError(message: string) {
      this.error = message;
      setTimeout(() => {
        this.error = null;
      }, 5000);
    },
  },

  getters: {
    isSearching(state): boolean {
      return state.currentSearch != null;
    },
  },
});
