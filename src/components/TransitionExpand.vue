<script setup lang="ts">
/**
 * Vue 3/TypeScript version of https://markus.oberlehner.net/blog/transition-to-height-auto-with-vue/
 */

function enter(el: HTMLElement) {
  // Render it momentarily in full
  const width = getComputedStyle(el).width;
  el.style.width = width;
  el.style.position = "absolute";
  el.style.visibility = "hidden";
  el.style.height = "auto";

  // Get the target height
  const height = getComputedStyle(el).height;

  // Reset but set height to 0
  el.style.width = "";
  el.style.position = "";
  el.style.visibility = "";
  el.style.height = "0";

  // Force repaint to make sure the
  // animation is triggered correctly.
  getComputedStyle(el).height;

  // Trigger the animation.
  // We use `requestAnimationFrame` because we need
  // to make sure the browser has finished
  // painting after setting the `height`
  // to `0` in the line above.
  requestAnimationFrame(() => {
    el.style.height = height;
  });
}

function afterEnter(el: HTMLElement) {
  // Unfreeze from the target height to allow for content to affect the height
  el.style.height = "auto";
}

function leave(el: HTMLElement) {
  // Freeze current height
  const height = getComputedStyle(el).height;
  el.style.height = height;

  // Force repaint to make sure the
  // animation is triggered correctly.
  getComputedStyle(el).height;

  // Trigger the animation.
  requestAnimationFrame(() => {
    el.style.height = "0";
  });
}
</script>

<template>
  <transition
    name="expand"
    @enter="(el) => enter(el as HTMLElement)"
    @after-enter="(el) => afterEnter(el as HTMLElement)"
    @leave="(el) => leave(el as HTMLElement)"
  >
    <slot />
  </transition>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: height 300ms ease-in-out;
  overflow: hidden;
}

.expand-enter,
.expand-leave-to {
  height: 0;
}
</style>
