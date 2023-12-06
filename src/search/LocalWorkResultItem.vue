<script setup lang="ts">
import ResultItem from "./ResultItem.vue";
import type { LocalWork } from "./localWorks.types";

defineProps<{
  work: LocalWork;
  i: number;
}>();
</script>

<template>
  <ResultItem
    :i="i"
    :to="`/special/${work.id}`"
    :title="work.title"
    :creators="work.creators"
    :date="work.date.label"
    :genreform="work.genreform.map((gf) => gf.label)"
    :terms="work.terms"
    :terms-secondary="[]"
    :summary="work.motivation"
    class="hover:bg-pink-100 dark:hover:bg-pink-950/70"
  />
</template>

<style></style>
