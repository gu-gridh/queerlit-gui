<template>
  <div class="mx-2 mb-1" :class="{ 'ml-4': level > 0 }">
    <div class="mb-1 flex flex-wrap justify-between items-baseline gap-4">
      <Term :data="parent" :options="['search', 'goto']" />
    </div>

    <TermTreeSmall
      v-for="child in parent.narrower"
      :key="child.name"
      :parent="child"
      :level="(level || 0) + 1"
    />
  </div>
</template>

<script setup>
import Term from "@/terms/Term.vue";

defineProps(["parent", "level"]);
</script>

<style></style>
