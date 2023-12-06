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
  <section class="border-2 border-dashed border-gray-300 px-2 rounded-lg">
    <header class="text-lg my-1 cursor-pointer" @click="$emit('toggle')">
      <icon v-if="expanded" icon="minus" size="sm" class="opacity-70" />
      <icon v-else icon="plus" size="sm" class="opacity-70" />
      <h4 class="inline ml-1">{{ heading }}</h4>
    </header>

    <div v-if="expanded">
      <slot />
    </div>
  </section>
</template>
