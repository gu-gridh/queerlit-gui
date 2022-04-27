<script setup>
import { computed } from "@vue/reactivity";

const props = defineProps(["data"]);

const type = computed(() => props.data?.inScheme?.["@id"]?.split("/").pop());
const label = computed(() => props.data?.prefLabel);
</script>

<template>
  <span
    class="term inline-block px-1 py-1 leading-snug text-black"
    :class="[type && `type-${type}`]"
  >
    <slot>
      {{ label }}
    </slot>
  </span>
</template>

<style scoped>
.term {
  font-size: 20px !important;
  font-weight: 100 !important;
  background-color: rgb(255, 180, 0);
  border-radius: 6px;
  padding: 5px 12px 5px 12px !important;
  cursor: pointer;
  height: 38px;
  box-shadow: 0rem 0.1rem 0.5rem rgba(0, 0, 0, 0.2);
  transition: all 0.1s ease-in-out;
}

.term:hover {
  transform:scale(1.03);
}

.type-sao {
  @apply bg-gray-200 border-gray-300;
}
</style>
