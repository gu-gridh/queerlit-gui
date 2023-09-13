import type { InjectionKey } from "vue";
import { Store, createStore } from "vuex";
import { union, without } from "lodash";
import type { Histogram } from "@/types/app";
import type { QlitCollection, QlitName } from "@/services/qlit.types";
import type { LocalWork } from "@/search/localWorks.types";

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

// See https://vuex.vuejs.org/guide/typescript-support.html#typing-usestore-composition-function
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
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
  },
  mutations: {
    setSearching(state, query) {
      state.currentSearch = query ? JSON.stringify(query) : null;
    },
    setResults(state, results) {
      state.results = results;
    },
    setLocalResults(state, results) {
      state.localResults = results;
    },
    setTotal(state, total) {
      state.total = total;
    },
    setSort(state, sort) {
      state.sort = sort;
    },
    setOffset(state, offset) {
      state.offset = offset;
    },
    setDragged(state, item) {
      state.dragged = item;
    },
    setTermTextQuery(state, termTextQuery) {
      state.termTextQuery = termTextQuery;
      state.termCollection = null;
      state.termsExpanded = [];
    },
    setTermCollection(state, collection: QlitCollection | null) {
      state.termTextQuery = "";
      state.termCollection = collection || null;
      state.termsExpanded = [];
    },
    toggleTermExpanded(state, { name, expanded }) {
      state.termsExpanded = expanded
        ? union(state.termsExpanded, [name])
        : without(state.termsExpanded, name);
    },
    setHistogram(state, histogram) {
      state.histogram = histogram;
    },
    patchHistogram(state, histogram: Record<number, number>) {
      for (const year in histogram) {
        state.histogram[year] = (state.histogram[year] || 0) + histogram[year];
      }
    },
    setError(state, message) {
      state.error = message;
      setTimeout(function () {
        state.error = null;
      }, 5000);
    },
  },
  getters: {
    isSearching: (state) => state.currentSearch != null,
  },
  actions: {},
});
