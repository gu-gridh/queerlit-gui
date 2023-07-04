<script setup>
defineProps({
  value: Boolean,
  toggle: {
    type: Function,
    required: true,
  },
  icon: {
    type: String,
    default: () => null,
  },
});
</script>

<template>
  <div
    class="flex justify-center cursor-pointer hover:scale-125 transition-transform text-xs opacity-70"
    :class="{ 'scale-110': value }"
    @click="toggle()"
  >
    <slot>
      <icon :icon="icon" fixed-width />
    </slot>
  </div>
</template>
