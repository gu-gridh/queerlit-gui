<template>
  <TermTree v-for="term in rootTerms" :key="term.id" :parent="term" />
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
