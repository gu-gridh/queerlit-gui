<template>
  <div class="container py-6">
    <LoadingSpinner v-if="isLoading" />
    <div v-else-if="terms.length" :key="termTextQuery">
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

<script setup>
import {
  computed,
  onMounted,
  ref,
  watch,
  watchEffect,
} from "@vue/runtime-core";
import { useStore } from "vuex";
import { vElementVisibility } from "@vueuse/components";
import debounce from "lodash/debounce";
import useTerms from "@/terms/terms.composable";
import useTitle from "@/views/title.composable";
import TermTree from "@/terms/TermTree.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const PAGE_SIZE = 15;

const { getRoots, searchTerms } = useTerms();
const rootTerms = ref([]);
const terms = ref([]);
const { state } = useStore();
useTitle();
const termTextQuery = computed(() => state.termTextQuery);
const limit = ref(PAGE_SIZE);
const termsLimited = computed(() => terms.value.slice(0, limit.value));
const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  rootTerms.value = await getRoots();
  isLoading.value = false;
});

const findTerms = debounce(async () => {
  isLoading.value = true;
  terms.value = await searchTerms(termTextQuery.value);
  isLoading.value = false;
}, 400);

watchEffect(async () => {
  if (termTextQuery.value) {
    findTerms();
  } else {
    terms.value = rootTerms.value;
  }
});

watch(terms, () => {
  limit.value = PAGE_SIZE;
});

function onBottomVisibility(visible) {
  if (visible && terms.value.length > limit.value) {
    limit.value += PAGE_SIZE;
  }
}
</script>

<style></style>
