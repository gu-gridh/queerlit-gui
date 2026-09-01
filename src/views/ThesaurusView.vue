<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { useWindowSize } from "@vueuse/core";
import useRootStore from "@/stores/root.store";
import useTerms from "@/terms/terms.composable";
import type { QlitTerm } from "@/services/qlit.types";
import { getCollection } from "@/services/terms.service";
import { useRouteInfo } from "./routeInfo.composable";
import TermTreeList from "@/terms/TermTreeList.vue";

const store = useRootStore();
const { getRoots, searchTerms } = useTerms();
const { setRouteInfo } = useRouteInfo();

// Undefined means loading, [] means no results
const termsRoot = ref<QlitTerm[] | undefined>(undefined);
const termsSearched = ref<QlitTerm[] | undefined>(undefined);
const termsCollection = ref<QlitTerm[] | undefined>(undefined);

setRouteInfo({
  title: "Ämnen",
  description:
    "Till Queerlit-databasen skapas en tesaurus, det vill säga en ordlista som sorterar ämnesord, för att göra skönlitteraturen i databasen mer lättillgänglig.",
});

onMounted(async () => (termsRoot.value = await getRoots()));

// Search terms when query is changed
watch(
  () => store.termTextQuery,
  async () => {
    termsSearched.value = undefined;
    termsSearched.value = await searchTerms(store.termTextQuery);
  },
  { immediate: true },
);

// Load terms in a selected collection
watch(
  () => store.termCollection,
  async (collection) => {
    termsCollection.value = undefined;
    if (collection)
      termsCollection.value = await getCollection(collection.name);
  },
  { immediate: true },
);

const resultsEl = ref<HTMLElement | null>(null);
const { width } = useWindowSize();

/** On narrow screens the term list sits below the sidebar; ease down to it. */
function scrollToResults() {
  if (width.value >= 1024) return;
  // Small pause so the interaction feels acknowledged before the view moves.
  setTimeout(() => {
    resultsEl.value?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 300);
}

// Scroll to the results when the user picks a collection. (Not while typing a
// text search, to keep the search field in view.)
watch(
  () => store.termCollection,
  async (collection) => {
    if (collection) {
      await nextTick();
      scrollToResults();
    }
  },
);

// Scroll to the results when explicitly requested, e.g. by pressing Enter in
// the search field.
watch(
  () => store.termScrollSignal,
  async () => {
    await nextTick();
    scrollToResults();
  },
);
</script>

<template>
  <div ref="resultsEl" class="container py-6">
    <TermTreeList
      v-if="store.termTextQuery"
      :heading="`Ämnen på &quot;${store.termTextQuery}&quot;`"
      :terms="termsSearched"
    />

    <TermTreeList
      v-else-if="store.termCollection"
      :heading="store.termCollection.label"
      :terms="termsCollection"
    />

    <TermTreeList v-else heading="Ämnesträd" :terms="termsRoot" />
  </div>
</template>

<style scoped>
  .container{
    height:calc(100% + 0px);
  }
</style>
