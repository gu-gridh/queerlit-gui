<template>
  <Search @search="search" />
  <div class="flex">
    <Filters class="w-64" />
    <Results class="flex-1" />
  </div>
</template>

<script setup>
import Search from "@/components/Search.vue";
import Filters from "@/components/Filters.vue";
import Results from "@/components/Results.vue";

async function search(terms) {
  console.log("searching", terms);
}
</script>

<style></style>
