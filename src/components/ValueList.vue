<script setup>
import { enarray } from "@/util";

defineProps(["values"]);
</script>

<template>
  <div v-for="(value, i) in enarray(values)" :key="i">
    {{ value }}
  </div>
  <div v-if="!values?.length">—</div>
</template>

<style></style>
