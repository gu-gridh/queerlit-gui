<template>
  <div class="mb-4">
    <div class="flex justify-between">
      <input
        value="1901"
        size="4"
        class="text-sm text-black p-1 px-2 border rounded"
      />
      <input
        value="2020"
        size="4"
        class="text-sm text-black p-1 px-2 border rounded"
      />
    </div>

    <div class="flex items-end mx-2 mr-1 mt-3 border-b-2 border-gray-600"></div>

    <div class="relative h-0 -m-2 z-10 px-2">
      <div
        class="h-4 w-4 rounded-full bg-white border-2 border-gray-600 absolute"
      />
      <div
        class="
          h-4
          w-4
          rounded-full
          bg-white
          border-2 border-gray-600
          absolute
          right-2
        "
      />
    </div>
  </div>
</template>

<script setup>
const bars = [...Array(8)].map((i) => parseInt(Math.random() * 100));
</script>

<style></style>
