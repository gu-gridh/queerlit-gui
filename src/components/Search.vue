<template>
  <div id="search" class="p-4">
    <input
      type="search"
      @keyup="search"
      class="border rounded w-full text-xl p-4"
    />
  </div>
</template>

<script setup>
const emit = defineEmits(["search"]);

function search(event) {
  emit("search", event.target.value);
}
</script>
