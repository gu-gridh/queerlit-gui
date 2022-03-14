<template>
  <input
    v-model="input"
    type="search"
    autocomplete="off"
    class="block w-full border rounded text-lg text-black py-1 px-2"
    @input="change"
  />
  <div v-show="suggestions.length" class="relative h-0">
    <div class="bg-white p-1 shadow rounded-b">
      <div
        v-for="item in suggestions"
        :key="getId ? getId(item) : item"
        class="hover:bg-blue-50 cursor-pointer"
        @click="selectSuggestion(item)"
      >
        {{ getLabel ? getLabel(item) : item }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { watchEffect } from "@vue/runtime-core";

// Data flow: parent -> `value` -> `input` -> `suggestions` -> `parent`
// Parent should pass current value to the `value` prop.
// If the `value` prop changes, reflect that in `input`.
// If user types into `input`, populate `suggestions`.
// If a suggestion is chosen, emit change event.
const props = defineProps(["value", "suggest", "getLabel", "getId"]);
const emit = defineEmits(["change"]);
const input = ref("");
const suggestions = ref([]);

async function change() {
  if (props.value) {
    emit("change", null);
  }
  setTimeout(
    async () => (suggestions.value = await props.suggest(input.value))
  );
}

function selectSuggestion(item) {
  suggestions.value = [];
  emit("change", item);
}

function setInput(item) {
  input.value = item && props.getLabel ? props.getLabel(item) : item || "";
}

watchEffect(() => setInput(props.value));
</script>

<style></style>
