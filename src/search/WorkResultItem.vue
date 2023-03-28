<template>
  <ResultItem
    :i="i"
    :to="`/work/${work.id}`"
    :title="work.title"
    :creators="work.creators"
    :date="work.date"
    :genreform="work.genreform.map((gf) => gf._label)"
    :terms="work.terms"
    :terms-secondary="work.termsSecondary"
    :summary="work.summary"
    :motivation="work.motivation"
  />
</template>

<script setup>
import ResultItem from "./ResultItem.vue";

defineProps({
  work: { type: Object, required: true },
  i: { type: [Number, String], required: true },
});
</script>

<style></style>
