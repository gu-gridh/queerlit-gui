<template>
  <ResultItem
    :i="i"
    :to="`/work/${work.id}`"
    :title="work.title"
    :creators="work.creators"
    :date="work.date"
    :genreform="work.genreform.map((gf) => gf._label)"
    :terms="work.terms"
    :terms-secondary="termsSecondary"
    :terms-secondary-more="termsSecondaryMore"
    :summary="work.summary"
    :motivation="work.motivation"
    class="hover:bg-smoke-100"
  />
</template>

<script setup>
import ResultItem from "./ResultItem.vue";

const props = defineProps({
  work: { type: Object, required: true },
  i: { type: [Number, String], required: true },
});

const termsSecondary = props.work.termsSecondary.filter((term) => term._label);
const termsSecondaryMore =
  termsSecondary.length < props.work.termsSecondary.length;
</script>

<style></style>
