<template>
  <span
    class="
      term
      inline-block
      px-2
      py-1
      leading-snug
      bg-yellow-100
      border border-yellow-200
      text-black
      font-mono
    "
  >
    <slot />
  </span>
</template>

<style>
.term {
  font-size: smaller;
}
</style>
