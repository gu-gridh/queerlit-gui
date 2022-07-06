<script setup>
import { computed } from "@vue/reactivity";

const props = defineProps(["data"]);

const type = computed(() => props.data?.inScheme?.["@id"]?.split("/").pop());
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
      shadow-md
      transition-all
    "
    :class="[type && `type-${type}`]"
  >
    <slot>
      {{ label }}
    </slot>
  </span>
</template>

<style scoped>
.type-sao {
  @apply bg-gray-200;
}
</style>
