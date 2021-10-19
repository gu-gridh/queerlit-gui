<template>
  <Search @search="search" />
  <div class="flex px-8 lg:container lg:max-w-screen-xl">
    <div class="bg-pink-50 -ml-96 w-96"></div>
    <Filters class="w-1/4 bg-pink-50" />
    <Results class="flex-1" />
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { search as librisSearch } from "@/services/libris";
import Search from "@/components/Search.vue";
import Filters from "@/components/Filters.vue";
import Results from "@/components/Results.vue";

const store = useStore();

async function search(terms) {
  const { list } = await librisSearch();
  store.commit("setResults", list);
}
</script>

<style></style>
