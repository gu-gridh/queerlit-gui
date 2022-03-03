<script setup>
// Avoid emitting click event when scrolldragging
// See: https://github.com/donmbelembe/vue-dragscroll/issues/61
let dragging = false;
let timer = null;

function start() {
  // Wait a little before setting dragging. Consider a very short drag as a click.
  timer = setTimeout(() => (dragging = true), 100);
}

function end() {
  // If the drag is very short, the timer is still on, so cancel it.
  clearTimeout(timer);
  // Postpone the unsetting to let the click event go first.
  setTimeout(() => (dragging = false));
}

function click(event) {
  // Cancel the click event if it's the release of a dragscroll.
  if (dragging) {
    event.stopPropagation();
  }
}
</script>

<template>
  <div
    v-dragscroll
    @dragscrollstart="start"
    @dragscrollend="end"
    @click.capture="click"
  >
    <slot />
  </div>
</template>
