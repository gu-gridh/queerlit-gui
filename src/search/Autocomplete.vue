<template>
  <div v-on-click-outside="blur">
    <input
      v-model="input"
      :placeholder="placeholder"
      type="search"
      autocomplete="off"
      class="
        block
        w-full
        text-lg text-black
        border border-gray-500
        leading-snug
        py-1
        px-2
        transition-colors
      "
      :class="{ incomplete }"
      @input="change"
      @keyup.escape="blur"
      @focus="change"
    />
    <div v-show="suggestions.length" class="relative h-0 z-20">
      <div
        class="
          suggestions
          bg-white
          py-1
          shadow
          rounded-b
          text-sm
          whitespace-nowrap
          overflow-hidden
        "
      >
        <div
          v-for="item in suggestions"
          :key="getId ? getId(item) : item"
          class="hover:bg-blue-50 cursor-pointer px-1"
          @click="selectSuggestion(item)"
        >
          {{ getLabel ? getLabel(item) : item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";
import { watchEffect } from "@vue/runtime-core";
import { vOnClickOutside } from "@vueuse/components";
import debounce from "lodash/debounce";

// Data flow: parent -> `value` -> `input` -> `suggestions` -> `parent`
// Parent should pass current value to the `value` prop.
// If the `value` prop changes, reflect that in `input`.
// If user types into `input`, populate `suggestions`.
// If a suggestion is chosen, emit change event.
const props = defineProps([
  "placeholder",
  "value",
  "suggest",
  "getLabel",
  "getId",
]);
const emit = defineEmits(["change"]);
const input = ref("");
const suggestions = ref([]);

const incomplete = computed(() => input.value && !props.value);

async function change() {
  // Typing should clear any currently selected item.
  if (props.value) {
    emit("change", null);
  }
  getSuggestions();
}

// No need to load suggestions until user slows down typing.
const getSuggestions = debounce(async () => {
  const q = input.value;
  const items = await props.suggest(q);
  q == input.value
    ? (suggestions.value = items.slice(0, 10))
    : console.log("too slow", q, input.value);
}, 400);

function selectSuggestion(item) {
  suggestions.value = [];
  emit("change", item);
}

function setInput(item) {
  input.value = item && props.getLabel ? props.getLabel(item) : item || "";
}

watchEffect(() => setInput(props.value));

function blur() {
  suggestions.value = [];
}
</script>

<style scoped>
::placeholder {
  font-size: 16px;
}
.incomplete:not(:focus) {
  @apply text-red-800;
}
</style>
