<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useStore } from "vuex";
import { vElementVisibility } from "@vueuse/components";
import debounce from "lodash/debounce";
import { key } from "@/store";
import useTerms from "@/terms/terms.composable";
import useTitle from "@/views/title.composable";
import TermTree from "@/terms/TermTree.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import type { QlitTerm } from "@/services/qlit.types";
import { getCollection } from "@/services/terms.service";

const PAGE_SIZE = 15;

const { getRoots, searchTerms } = useTerms();
const rootTerms = ref<QlitTerm[]>([]);
const terms = ref<QlitTerm[]>([]);
const { state } = useStore(key);
useTitle();
const termTextQuery = computed(() => state.termTextQuery);
const limit = ref(PAGE_SIZE);
const termsLimited = computed(() => terms.value.slice(0, limit.value));
const isLoading = ref(false);
const heading = ref<string>();

onMounted(async () => {
  isLoading.value = true;
  rootTerms.value = await getRoots();
  isLoading.value = false;
});

// A debounced function for loading terms matching text input
const findTerms = debounce(async () => {
  isLoading.value = true;
  terms.value = await searchTerms(termTextQuery.value);
  isLoading.value = false;
}, 400);

// Reactively determine what terms to show
watchEffect(async () => {
  if (termTextQuery.value) {
    // A text query has been entered
    heading.value = `Ämnen på "${termTextQuery.value}"`;
    findTerms();
  } else if (state.termCollection) {
    // A collection is selected
    heading.value = state.termCollection.label;
    isLoading.value = true;
    terms.value = await getCollection(state.termCollection.name);
    isLoading.value = false;
  } else {
    // Default case: show root terms
    heading.value = "Ämnesträd";
    terms.value = rootTerms.value;
  }
});

watch(terms, () => {
  limit.value = PAGE_SIZE;
});

function onBottomVisibility(visible: boolean) {
  if (visible && terms.value.length > limit.value) {
    limit.value += PAGE_SIZE;
  }
}
</script>

<template>
  <div class="container py-6">
    <LoadingSpinner v-if="isLoading" />
    <div v-else-if="terms.length" :key="termTextQuery">
      <h1 v-if="heading" class="text-4xl mb-6">{{ heading }}</h1>
      <TermTree
        v-for="term in termsLimited"
        :key="term.name"
        :parent="term"
        :level="0"
      />
      <div v-element-visibility="onBottomVisibility"></div>
    </div>
    <div v-else class="my-8 text-center text-xl">Inga träffar!</div>
  </div>
</template>

<style></style>
