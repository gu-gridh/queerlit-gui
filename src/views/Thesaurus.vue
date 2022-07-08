<template>
  <div class="container">
    <h1 class="text-6xl my-10">Ämnen</h1>
    <TermTree
      v-for="term in rootTerms"
      :key="term.name"
      :parent="term"
      :level="0"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "@vue/runtime-core";
import useTerms from "@/terms/terms.composable";
import TermTree from "@/terms/TermTree.vue";

const { getRoots } = useTerms();
const rootTerms = ref([]);

onMounted(async () => {
  rootTerms.value = await getRoots();
});
</script>

<style></style>
