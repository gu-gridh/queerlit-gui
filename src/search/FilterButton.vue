<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";

defineProps<{
  label: string;
}>();

defineEmits(["clear"]);

// Thanks to @Simon https://stackoverflow.com/a/76208995
const hasClearListener = computed(
  () => !!getCurrentInstance()?.vnode.props?.onClear,
);
</script>

<template>
  <span
    class="inline-block bg-blue-400 dark:text-stone-200 px-2 filter-boxes"
  >
    <span class="flex items-baseline gap-1">
      <span class="font-label uppercase font-medium text-xs opacity-80">
        {{ label + ($slots.default ? ":" : "") }}
      </span>

      <var class="not-italic">
        <slot />
        &ZeroWidthSpace;
      </var>

      <span
        v-if="hasClearListener"
        class="ml-1 cursor-pointer"
        title="Rensa filter"
        @click="$emit('clear')"
      >
        <icon icon="times" size="xs" />
      </span>
    </span>
  </span>
</template>

<style scoped>
  .filter-boxes{
color:white;
background-color:rgb(111,126,121);
  border-radius:8px;
  line-height:1.1;
  padding:5px 10px;
  }
  
  </style>
