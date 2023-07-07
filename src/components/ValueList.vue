<script setup lang="ts">
import type { MaybeArray } from "@/types/util";
import { enarray } from "@/util";

defineProps<{
  values: MaybeArray<string>;
  optional: boolean;
}>();
</script>

<template>
  <div v-for="(value, i) in enarray(values)" :key="i">
    {{ value }}
  </div>
  <div v-if="!values?.length && !optional">—</div>
</template>

<style></style>
