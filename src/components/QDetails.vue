<script setup lang="ts">
defineProps<{
  heading: string;
  expanded?: Boolean;
}>();
defineEmits<{
  toggle: [];
}>();
</script>

<template>
  <div class="border-2 border-dashed border-gray-300 px-2 rounded-lg">
    <header class="text-lg my-1 cursor-pointer" @click="$emit('toggle')">
      <icon v-if="expanded" icon="minus" size="sm" class="opacity-70" />
      <icon v-else icon="plus" size="sm" class="opacity-70" />
      {{ heading }}
    </header>

    <div v-if="expanded">
      <slot />
    </div>
  </div>
</template>
