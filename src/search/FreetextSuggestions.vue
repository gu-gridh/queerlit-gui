<script setup>
import { ref } from "@vue/reactivity";
import Dragscroll from "./Dragscroll.vue";

defineProps(["heading", "items", "select"]);
defineEmits(["select"]);

const hscroll = ref(null);
const isScrolledToStart = ref(true);
const isScrolledToEnd = ref(false);

function scroll(event) {
  if (!event.deltaX) hscroll.value.$el.scrollLeft += event.deltaY;
}

function scrollStepLeft() {
  hscroll.value.$el.scrollLeft -= hscroll.value.$el.clientWidth * 0.5;
}

function scrollStepRight() {
  hscroll.value.$el.scrollLeft += hscroll.value.$el.clientWidth * 0.5;
}

function checkScrollPosition() {
  isScrolledToStart.value = hscroll.value.$el.scrollLeft == 0;
  isScrolledToEnd.value =
    hscroll.value.$el.scrollLeft + hscroll.value.$el.clientWidth ==
    hscroll.value.$el.scrollWidth;
}
</script>

<template>
  <div v-if="items.length" class="my-2">
    <div class="text-sm mx-2">{{ heading }}</div>
    <div class="relative" @wheel.prevent="scroll">
      <span
        v-show="!isScrolledToStart"
        class="
          absolute
          left-0
          top-0
          bottom-0
          z-10
          flex flex-col
          justify-center
          p-1
          pr-2
          prev-button
        "
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
          class="mx-1"
          @click="$emit('select', item)"
        >
          <slot :item="item">
            {{ item }}
          </slot>
        </span>
      </Dragscroll>
      <span
        v-show="!isScrolledToEnd"
        class="
          absolute
          right-0
          top-0
          bottom-0
          z-10
          flex flex-col
          justify-center
          p-1
          pl-2
          next-button
        "
        @click="scrollStepRight"
      >
        <icon icon="angle-double-right" size="xs" />
      </span>
    </div>
  </div>
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
