<template>
  <div class="mb-4">
    <div class="flex">
      <h3 class="flex-1 uppercase font-bold text-sm">Utgivningsår</h3>
    </div>
    <div class="flex justify-between">
      <input value="1901" size="4" class="p-1 px-2 border" />
      <input value="2020" size="4" class="p-1 px-2 border" />
    </div>

    <div class="flex h-16 items-end mx-2 mr-1 mt-1 border-b-2 border-black">
      <div
        v-for="(size, i) in bars"
        :key="i"
        class="flex-1 mr-1 bg-black"
        :style="{ height: `${size}%` }"
      />
    </div>

    <div class="relative h-0 -m-2 z-10 px-2">
      <div
        class="h-4 w-4 rounded-full bg-white border-2 border-black absolute"
      />
      <div
        class="
          h-4
          w-4
          rounded-full
          bg-white
          border-2 border-black
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
