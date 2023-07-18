<script setup lang="ts">
import type { MaybeArray } from "@/types/util";
import { enarray } from "@/util";

defineProps<{
  values?: MaybeArray<string>;
}>();
</script>

<template>
  <div v-if="!values?.length">—</div>
  <div v-for="(value, i) in enarray(values)" v-else :key="i">
    {{ value }}
  </div>
</template>

<style></style>
