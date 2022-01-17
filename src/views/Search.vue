<template>
  <Search @search="search" />
  <div class="flex-1px-8 lg:container lg:max-w-screen-xl">
    <Results />
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { search as librisSearch } from "@/services/libris";
import Search from "@/components/Search.vue";
import Results from "@/components/Results.vue";
import { computed, onMounted } from "@vue/runtime-core";

const store = useStore();

const text = computed(() => store.state.query.text);
const terms = computed(() => store.state.query.terms);

onMounted(search());

async function search() {
  const { items } = await librisSearch(text.value, terms.value);
  store.commit("setResults", items);
}
</script>

<style></style>
