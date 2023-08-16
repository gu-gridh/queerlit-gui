<script setup lang="ts">
import type { Work } from "@/types/work";
import ResultItem from "./ResultItem.vue";

const props = defineProps<{
  work: Work;
  i: number;
}>();

const termsSecondary = props.work.termsSecondary.filter((term) => term.label);
const termsSecondaryMore =
  termsSecondary.length < props.work.termsSecondary.length;
</script>

<template>
  <ResultItem
    :i="i"
    :to="`/work/${work.id}`"
    :title="work.title"
    :creators="work.creators"
    :date="work.date"
    :genreform="work.genreform.map((gf) => gf.label)"
    :terms="work.terms"
    :terms-secondary="termsSecondary"
    :terms-secondary-more="termsSecondaryMore"
    :summary="work.summary"
    :motivation="work.motivation"
    class="hover:bg-smoke-100"
  />
</template>

<style></style>
