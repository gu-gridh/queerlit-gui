<template>
  <Header />
  <Search @search="search" />
  <div class="flex">
    <Filters />
    <Results />
  </div>
</template>

<script setup>
import Header from "./components/Header.vue";
import Search from "./components/Search.vue";
import Filters from "./components/Filters.vue";
import Results from "./components/Results.vue";

async function search(terms) {
  console.log("searching", terms);
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
</style>
