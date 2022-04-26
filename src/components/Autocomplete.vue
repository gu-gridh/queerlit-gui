<template>
  <input
    v-model="input"
        placeholder="Författare"
    type="search"
    autocomplete="off"
    class="block w-full advanced-form text-lg text-black py-1 px-2"
    @keyup="change"
  />
  <div v-show="suggestions.length" class="relative h-0">
    <div class="suggestions bg-white p-1 shadow rounded-b">
      <div
        v-for="item in suggestions"
        :key="getId ? getId(item) : item"
        class="hover:bg-blue-50 cursor-pointer"
        @click="setValue(item)"
      >
        {{ getLabel ? getLabel(item) : item }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

const props = defineProps(["suggest", "getLabel", "getId"]);
const emit = defineEmits(["change"]);
const input = ref("");
const suggestions = ref([]);
const value = ref(null);

async function change() {
  value.value = null;
  suggestions.value = await props.suggest(input.value);
}

function setValue(item) {
  input.value = props.getLabel ? props.getLabel(item) : item;
  suggestions.value = [];
  value.value = item;
}

watch(value, (x) => emit("change", x));
</script>

<style>
.suggestions{
  max-height:200px;
  overflow:hidden;
  font-size:16px;
}
</style>
