<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";

defineProps<{
  label: string;
}>();

defineEmits(["clear"]);

// Thanks to @Simon https://stackoverflow.com/a/76208995
const hasClearListener = computed(
  () => !!getCurrentInstance()?.vnode.props?.onClear
);
</script>

<template>
  <span
    class="inline-block border-2 border-blue-300 bg-blue-100 rounded-2xl px-2"
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
