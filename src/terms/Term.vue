<script setup>
import { computed } from "@vue/reactivity";

const props = defineProps(["data"]);

const isQlit = computed(
  () =>
    !props.data ||
    props.data.inScheme?.["@id"] == "https://queerlit.dh.gu.se/qlit/v1"
);
const label = computed(() => props.data?.prefLabel);
</script>

<template>
  <span
    class="
      transform
      hover:scale-105
      inline-block
      px-2
      py-1
      leading-snug
      text-black
      bg-tagyellow
      font-thin
      rounded-md
      shadow
      transition-all
    "
    :class="{ 'tag-external': !isQlit }"
  >
    <slot>
      {{ label }}
    </slot>
  </span>
</template>

<style scoped>
.tag-external {
  @apply bg-gray-200;
}
</style>
