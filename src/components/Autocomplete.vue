<template>
  <input
    type="search"
    v-model="input"
    autocomplete="off"
    @keyup="change"
    class="block w-full border rounded text-lg text-black py-1 px-2"
  />
  <div v-show="suggestions.length" class="relative h-0">
    <div class="bg-white p-1 shadow rounded-b">
      <div
        v-for="item in suggestions"
        :key="getId ? getId(item) : item"
        @click="setValue(item)"
        class="hover:bg-blue-50 cursor-pointer"
      >
        {{ getLabel ? getLabel(item) : item }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";

const props = defineProps(["suggest", "getLabel", "getId"]);
const emit = defineEmits(["change"]);
const input = ref("");
const suggestions = ref([]);

async function change() {
  emit("change", null);
  suggestions.value = await props.suggest(input.value);
}

function setValue(item) {
  input.value = props.getLabel ? props.getLabel(item) : item;
  suggestions.value = [];
  emit("change", item);
}
</script>

<style></style>
