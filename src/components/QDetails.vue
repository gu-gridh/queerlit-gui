<script setup lang="ts">
import TransitionExpand from "./TransitionExpand.vue";

defineProps<{
  heading: string;
  expanded?: Boolean;
}>();
defineEmits<{
  toggle: [];
}>();
</script>

<template>
  <section
    class="border-2 border-dotted border-gray-300 dark:border-stone-600 px-2 rounded-lg"
  >
    <header class="text-lg py-1 cursor-pointer" @click="$emit('toggle')">
      <icon v-if="expanded" icon="minus" size="sm" class="opacity-70" />
      <icon v-else icon="plus" size="sm" class="opacity-70" />
      <h4 class="inline ml-2">{{ heading }}</h4>
    </header>

    <TransitionExpand>
      <div v-if="expanded">
        <slot />
      </div>
    </TransitionExpand>
  </section>
</template>
