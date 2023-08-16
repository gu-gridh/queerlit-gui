<template>
  <div v-on-click-outside="blur">
    <QInput
      v-model="input"
      :input-id="inputId"
      search
      :is-incomplete="!!incomplete"
      :has-value="!!value"
      :help="help"
      @input="change"
      @focus="change"
      @keyup.escape="blur"
    />
    <div v-show="suggestions.length" class="relative h-0 z-20">
      <div
        class="suggestions bg-white py-1 shadow rounded-b text-sm whitespace-nowrap overflow-hidden"
      >
        <div
          v-for="item in suggestions"
          :key="typeof item == 'string' ? item : getId(item)"
          class="hover:bg-blue-50 cursor-pointer px-1"
          @click="selectSuggestion(item)"
        >
          {{ getLabel ? getLabel(item) : item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed, ref, watchEffect, type Ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import debounce from "lodash/debounce";
import QInput from "@/components/QInput.vue";
import type { Autocompleter } from "./multicomplete.composable";

// Data flow: parent -> `value` -> `input` -> `suggestions` -> `parent`
// Parent should pass current value to the `value` prop.
// If the `value` prop changes, reflect that in `input`.
// If user types into `input`, populate `suggestions`.
// If a suggestion is chosen, emit change event.
const props = defineProps<{
  value?: T;
  suggest: Autocompleter<T>;
  getLabel: (item: T) => string;
  getId: (item: T) => string;
  inputId: string;
  help: string;
}>();

const emit = defineEmits(["change"]);

const input = ref("");
// Without the `as Ref`, it will be typed as UnwrapRefSimple, see https://stackoverflow.com/a/69901745/1750365
const suggestions = ref([]) as Ref<T[]>;
const incomplete = computed(() => input.value && !props.value);

async function change() {
  // Typing should clear any currently selected item.
  if (props.value) {
    emit("change", null);
  }
  if (input.value) getSuggestions();
  else suggestions.value = [];
}

// No need to load suggestions until user slows down typing.
const getSuggestions = debounce(async () => {
  const q = input.value;
  const items = await props.suggest(q);
  if (q == input.value) suggestions.value = items.slice(0, 10);
}, 400);

function selectSuggestion(item: T) {
  suggestions.value = [];
  emit("change", item);
}

function setInput(item?: T) {
  input.value = item
    ? typeof item == "string"
      ? item
      : props.getLabel(item)
    : "";
}

watchEffect(() => setInput(props.value));

function blur() {
  suggestions.value = [];
}
</script>

<style scoped></style>
