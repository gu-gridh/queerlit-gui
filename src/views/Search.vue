<template>
  <SearchForm @search="search" />
  <div class="flex-1 container lg:max-w-screen-xl">
    <Results />
  </div>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import useQuery from "@/composables/query";
import { search as librisSearch } from "@/services/libris";
import SearchForm from "@/components/SearchForm.vue";
import Results from "@/components/Results.vue";

const store = useStore();
const { text, terms, title, author, yearStart, yearEnd, genreform } =
  useQuery();

onMounted(search());

async function search() {
  const { items } = await librisSearch(
    text.value,
    terms.value.map((term) => term.label),
    title.value,
    author.value,
    yearStart.value,
    yearEnd.value,
    genreform.value
  );
  store.commit("setResults", items);
}
</script>

<style></style>
