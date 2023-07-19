<script setup lang="ts" generic="T">
import { ref, watch } from "vue";
import Dragscroll from "./Dragscroll.vue";
import Labeled from "@/components/Labeled.vue";

const props = defineProps<{
  heading: string;
  items: T[];
}>();
defineEmits(["select"]);

const hscroll = ref<InstanceType<typeof Dragscroll>>();
const isScrolledToStart = ref(true);
const isScrolledToEnd = ref(false);

function scroll(event: WheelEvent) {
  if (!event.deltaX) hscroll.value!.$el.scrollLeft += event.deltaY;
}

function scrollStepLeft() {
  hscroll.value!.$el.scrollLeft -= hscroll.value!.$el.clientWidth * 0.5;
}

function scrollStepRight() {
  hscroll.value!.$el.scrollLeft += hscroll.value!.$el.clientWidth * 0.5;
}

function checkScrollPosition() {
  if (!hscroll.value) return;
  const el = hscroll.value.$el;
  // Update our flags.
  isScrolledToStart.value = el.scrollLeft == 0;
  isScrolledToEnd.value = el.scrollLeft + el.clientWidth == el.scrollWidth;
}

// If the suggestion list is short, the scrolled-to-end flag should be true.
watch(
  () => props.items,
  () => setTimeout(checkScrollPosition)
);
</script>

<template>
  <Labeled
    v-if="items.length"
    :label="heading"
    class="my-2"
    label-class="mx-2 opacity-80"
  >
    <div class="relative" @wheel.prevent="scroll">
      <span
        v-show="!isScrolledToStart"
        class="absolute left-0 top-0 bottom-0 z-10 flex flex-col justify-center p-1 pr-2 prev-button"
        @click="scrollStepLeft"
      >
        <icon icon="angle-double-left" size="xs" />
      </span>
      <Dragscroll
        ref="hscroll"
        class="overflow-hidden whitespace-nowrap pt-2 pb-3 px-1"
        @scroll="checkScrollPosition"
      >
        <span
          v-for="(item, i) in items"
          :key="i"
          class="mx-1 cursor-pointer"
          @click="$emit('select', item)"
        >
          <slot :item="item">
            {{ item }}
          </slot>
        </span>
      </Dragscroll>
      <span
        v-show="!isScrolledToEnd"
        class="absolute right-0 top-0 bottom-0 z-10 flex flex-col justify-center p-1 pl-2 next-button"
        @click="scrollStepRight"
      >
        <icon icon="angle-double-right" size="xs" />
      </span>
    </div>
  </Labeled>
</template>

<style>
.dragscroll:not(.dragging) {
  scroll-behavior: smooth;
}
.next-button {
  background: linear-gradient(
    90deg,
    rgba(231, 235, 233, 0) 0%,
    rgba(231, 235, 233, 1) 30%
  );
}
.prev-button {
  background: linear-gradient(
    270deg,
    rgba(231, 235, 233, 0) 0%,
    rgba(231, 235, 233, 1) 30%
  );
}
</style>
