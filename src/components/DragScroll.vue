<script setup lang="ts">
// Avoid emitting click event when scrolldragging

import { ref } from "vue";
import { dragscroll as vDragscroll } from "vue-dragscroll";

// See: https://github.com/donmbelembe/vue-dragscroll/issues/61
const dragging = ref(false);
let timer: number | undefined;

function start() {
  // Wait a little before setting dragging. Consider a very short drag as a click.
  timer = setTimeout(() => (dragging.value = true), 100);
}

function end() {
  // If the drag is very short, the timer is still on, so cancel it.
  clearTimeout(timer);
  // Postpone the unsetting to let the click event go first.
  setTimeout(() => (dragging.value = false));
}

function click(event: Event) {
  // Cancel the click event if it's the release of a dragscroll.
  if (dragging.value) {
    event.stopPropagation();
  }
}
</script>

<template>
  <div
    v-dragscroll
    class="dragscroll"
    :class="{ dragging }"
    @dragscrollstart="start"
    @dragscrollend="end"
    @click.capture="click"
  >
    <slot />
  </div>
</template>
