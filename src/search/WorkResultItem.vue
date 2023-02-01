<template>
  <ResultItem
    :i="i"
    :to="`/work/${work.id}`"
    :title="work.title"
    :creators="work.creators"
    :date="work.date"
    :terms="work.terms"
    :summary="work.summary"
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
