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
    class="
      w-6
      flex
      justify-center
      cursor-pointer
      transform
      hover:scale-125
      transition-transform
      text-xs
    "
    :class="{ 'scale-125': value }"
    @click="toggle()"
  >
    <slot>
      <icon :icon="icon" />
    </slot>
  </div>
</template>
