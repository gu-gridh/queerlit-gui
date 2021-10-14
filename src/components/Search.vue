<template>
  <div class="bg-pink-600 text-white">
    <div class="container pb-8">
      <input
        type="search"
        v-model="terms"
        @keyup="search"
        class="border rounded w-full text-xl p-4"
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
