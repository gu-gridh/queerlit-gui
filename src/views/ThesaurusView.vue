<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import debounce from "lodash/debounce";
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

// A debounced function for loading terms matching text input
const findTerms = debounce(async () => {
  termsSearched.value = undefined;
  termsSearched.value = await searchTerms(store.termTextQuery);
}, 400);

onMounted(async () => (termsRoot.value = await getRoots()));

// Search terms when query is changed
watch(
  () => store.termTextQuery,
  () => {
    termsSearched.value = undefined;
    findTerms();
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
</script>

<template>
  <div class="container py-6">
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

<style></style>
