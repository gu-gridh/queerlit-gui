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
.term:hover {
  transform: scale(1.03);
}

.type-sao {
  @apply bg-gray-200;
}
</style>
