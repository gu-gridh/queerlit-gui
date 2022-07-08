<template>
  <button
    class="
      q-button
      bg-gray-500
      text-white
      rounded
      shadow
      hover:bg-opacity-80
      transition-all
      cursor-pointer
    "
  >
    <slot />
  </button>
</template>

<style>
.q-button {
  padding: 0 0.5em;
}
</style>
