<script setup>
import { enarray } from "@/util";

defineProps({
  values: {
    type: Object,
    default: () => null,
  },
  optional: {
    type: Boolean,
  },
});
</script>

<template>
  <div v-for="(value, i) in enarray(values)" :key="i">
    {{ value }}
  </div>
  <div v-if="!values?.length && !optional">—</div>
</template>

<style></style>
