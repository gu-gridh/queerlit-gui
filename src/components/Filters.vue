<template>
  <aside id="filters" class="pr-8 py-4">
    <Filter />
    <Filter label="Språk" :values="{ Svenska: 34, Danska: 3 }" />
    <YearFilter />
  </aside>
</template>

<script setup>
import Filter from "@/components/Filter.vue";
import YearFilter from "./YearFilter.vue";
</script>
