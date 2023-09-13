<script setup lang="ts">
import { useToggle } from "@vueuse/core";
import { watch } from "vue";

const props = defineProps<{
  expanded: boolean;
}>();

const [expandedNow, toggle] = useToggle(props.expanded);

watch(
  () => props.expanded,
  () => (expandedNow.value = props.expanded),
);
</script>

<template>
  <div class="relative">
    <div class="overflow-hidden" :class="expandedNow ? [] : ['h-12', 'mask']">
      <slot />
    </div>

    <div v-if="!expandedNow" class="absolute bottom-0 right-0 text-sm flex">
      <div
        class="bg-gray-100 shadow rounded-lg px-2 cursor-pointer"
        @click="toggle()"
      >
        + Läs mer
      </div>
    </div>
  </div>
</template>

<style scoped>
.mask {
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
}
</style>
