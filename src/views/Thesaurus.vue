<template>
  <div class="container">
    <header class="flex flex-wrap my-10 items-end">
      <h1 class="flex-1 text-6xl">Ämnen</h1>
      <div class="flex-1 text-xl">
        <input
          v-model="termTextInput"
          type="text"
          class="border rounded p-2"
          placeholder="Sök bland ämnesord..."
        />
      </div>
    </header>
    <TermTree
      v-for="term in terms"
      :key="term.name"
      :parent="term"
      :level="0"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "@vue/runtime-core";
import useTerms from "@/terms/terms.composable";
import TermTree from "@/terms/TermTree.vue";
import debounce from "lodash/debounce";
import useTitle from "@/views/title.composable";

const { getRoots, searchTerms } = useTerms();
const rootTerms = ref([]);
const terms = ref([]);
const termTextInput = ref("");
useTitle();

onMounted(async () => {
  rootTerms.value = await getRoots();
});

const findTerms = debounce(async () => {
  terms.value = await searchTerms(termTextInput.value);
}, 400);

watchEffect(async () => {
  if (termTextInput.value) {
    findTerms();
  } else {
    terms.value = rootTerms.value;
  }
});
</script>

<style></style>
