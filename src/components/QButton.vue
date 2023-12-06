<template>
  <button
    class="q-button bg-gray-500 dark:bg-gray-700 text-white rounded shadow hover:bg-gray-400 dark:hover:bg-gray-500 transition-all cursor-pointer"
  >
    <slot />
  </button>
</template>

<style>
.q-button {
  padding: 0 0.5em;
}
</style>
