<script setup>
import { useToggle } from "@vueuse/core";
import ToggleIcon from "./ToggleIcon.vue";

defineProps([
  "modelValue",
  "input-id",
  "search",
  "is-incomplete",
  "has-value",
  "help",
]);
defineEmits(["update:modelValue", "focus"]);

const [showHelp, toggleHelp] = useToggle();
</script>

<template>
  <div>
    <div
      class="
        w-full
        flex
        items-center
        py-1
        px-2
        rounded
        text-text text-lg
        shadow-inner
        leading-snug
        transition-colors
      "
      :class="[
        isIncomplete ? 'incomplete' : null,
        hasValue
          ? 'bg-blue-100'
          : 'bg-smoke-200 hover:bg-smoke-300 focus-within:bg-smoke-300',
      ]"
    >
      <input
        :value="modelValue"
        :type="search ? 'search' : undefined"
        autocomplete="off"
        size="10"
        class="flex-1 bg-transparent"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event.target.value)"
      />

      <ToggleIcon
        v-if="help"
        icon="question"
        :value="showHelp"
        :toggle="toggleHelp"
      />
    </div>

    <div
      v-if="showHelp"
      class="relative my-1 bg-yellow-50 border border-yellow-200 px-1 text-sm"
    >
      {{ help }}
    </div>
  </div>
</template>

<style scoped>
::placeholder {
  font-size: 16px;
}
.incomplete:not(:has(:focus)) {
  @apply bg-red-100;
}
</style>
