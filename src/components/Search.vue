<template>
  <div class="bg-pink-600 text-white">
    <div class="container pb-8 flex">
      <input
        type="search"
        v-model="terms"
        @keyup="search"
        class="border rounded w-full text-xl p-4 flex-1 text-black"
      />
      <input
        type="submit"
        value="Sök"
        class="ml-2 rounded text-xl p-4 bg-pink-900 cursor-pointer"
        @click="search"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";

const emit = defineEmits(["search"]);

const terms = ref("androgyni");

function search(event) {
  emit("search", terms.value);
}
</script>
