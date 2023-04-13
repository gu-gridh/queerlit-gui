<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
});

defineEmits(["clear"]);
</script>

<template>
  <span
    class="
      inline-block
      border-2 border-yellow-300
      bg-yellow-100
      rounded-2xl
      px-2
    "
  >
    <span class="flex items-baseline gap-1">
      <span class="font-label uppercase font-medium text-xs opacity-80">
        {{ label }}:
      </span>

      <var class="mr-1 not-italic">
        <slot />
      </var>

      <span class="cursor-pointer" @click="$emit('clear')" title="Rensa filter">
        <icon icon="times" size="xs" />
      </span>
    </span>
  </span>
</template>
