<template>
  <div class="container py-6">
    <TermTree
      v-for="term in terms"
      :key="term.name"
      :parent="term"
      :level="0"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watchEffect } from "@vue/runtime-core";
import useTerms from "@/terms/terms.composable";
import TermTree from "@/terms/TermTree.vue";
import debounce from "lodash/debounce";
import useTitle from "@/views/title.composable";
import { useStore } from "vuex";

const { getRoots, searchTerms } = useTerms();
const rootTerms = ref([]);
const terms = ref([]);
const { state } = useStore();
useTitle();
const termTextQuery = computed(() => state.termTextQuery);

onMounted(async () => {
  rootTerms.value = await getRoots();
});

const findTerms = debounce(async () => {
  terms.value = await searchTerms(termTextQuery.value);
}, 400);

watchEffect(async () => {
  if (termTextQuery.value) {
    findTerms();
  } else {
    terms.value = rootTerms.value;
  }
});
</script>

<style></style>
