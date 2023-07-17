<script setup lang="ts">
import { useToggle } from "@vueuse/core";
import ToggleIcon from "./ToggleIcon.vue";
import InputHelp from "./InputHelp.vue";

type Props = {
  modelValue: string;
  inputId?: string;
  search?: boolean;
  isIncomplete?: boolean;
  hasValue?: boolean;
  help?: string;
};
defineProps<Props>();
defineEmits<{
  "update:modelValue": [Props["modelValue"]];
  focus: [];
}>();

const [showHelp, toggleHelp] = useToggle();
</script>

<template>
  <div>
    <div
      class="w-full flex items-center py-1 px-2 rounded text-text text-lg shadow-inner leading-snug transition-colors"
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
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        @focus="$emit('focus')"
      />

      <ToggleIcon
        v-if="help"
        icon="question"
        :value="showHelp"
        :toggle="toggleHelp"
      />
    </div>

    <InputHelp v-if="showHelp" @dismiss="toggleHelp(false)">
      {{ help }}
    </InputHelp>
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
