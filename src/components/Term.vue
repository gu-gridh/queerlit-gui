<script setup>
import { computed } from "@vue/reactivity";

const props = defineProps(["data"]);

const type = computed(() => props.data?.inScheme?.["@id"]?.split("/").pop());
const label = computed(() => props.data?.prefLabel);
</script>

<template>
  <span
    class="
      term
      inline-block
      px-1
      py-1
      leading-snug
      bg-yellow-200
      border border-yellow-300
      text-black
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
  @apply bg-gray-200 border-gray-300;
}
</style>
