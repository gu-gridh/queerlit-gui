<script setup>
import { ref } from "@vue/reactivity";
import Dragscroll from "./Dragscroll.vue";

defineProps(["heading", "items", "select"]);
defineEmits(["select"]);

const hscroll = ref(null);

function scroll(event) {
  if (!event.deltaX) hscroll.value.$el.scrollLeft += event.deltaY;
}
</script>

<template>
  <div v-if="items.length" class="my-2">
    <div class="text-sm mx-2">{{ heading }}</div>
    <Dragscroll
      ref="hscroll"
      class="overflow-hidden whitespace-nowrap pt-2 pb-3 px-1"
      @wheel.prevent="scroll"
    >
      <span
        v-for="(item, i) in items"
        :key="i"
        class="mx-1"
        @click="$emit('select', item)"
      >
        <slot :item="item">
          {{ item }}
        </slot>
      </span>
    </Dragscroll>
  </div>
</template>

<style>
.dragscroll:not(.dragging) {
  scroll-behavior: smooth;
}
</style>
