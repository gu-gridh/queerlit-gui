<template>
  <div class="container">
    <h1 class="text-2xl">Tesaurus</h1>
  </div>
  <div class="container">
    <TermTree
      v-for="term in rootTerms"
      :key="term.id"
      :parent="term"
      :level="0"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "@vue/runtime-core";
import useTerms from "@/composables/terms";
import TermTree from "@/components/TermTree.vue";

const { getRoots } = useTerms();
const rootTerms = ref([]);

onMounted(() => {
  rootTerms.value = getRoots().map(({ term }) => term);
});
</script>

<style></style>
