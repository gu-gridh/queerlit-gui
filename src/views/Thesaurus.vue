<template>
  <div class="thesaurus-container">
    <h1 class="text-6xl">Tesaurus</h1>
  </div>
  <div style="padding: 0px 40px 50px 40px;">
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

onMounted(async () => {
  rootTerms.value = (await getRoots()).map(({ term }) => term);
});
</script>

<style>
.thesaurus-container{
  padding:40px;
}
</style>
