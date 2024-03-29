<script setup lang="ts">
import { useToggle } from "@vueuse/core";
import TransitionExpand from "./TransitionExpand.vue";
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
      class="w-full flex items-center py-1 px-2 rounded text-text dark:text-stone-400 text-lg shadow-inner leading-snug transition-colors"
      :class="[
        isIncomplete ? 'incomplete' : null,
        hasValue
          ? 'bg-blue-100 dark:bg-slate-600'
          : 'bg-smoke-200 hover:bg-smoke-300 dark:bg-stone-700 dark:hover:bg-stone-700',
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

    <TransitionExpand>
      <InputHelp v-if="showHelp" @dismiss="toggleHelp(false)">
        {{ help }}
      </InputHelp>
    </TransitionExpand>
  </div>
</template>

<style scoped>
::placeholder {
  font-size: 16px;
}
.incomplete:not(:has(:focus)) {
  @apply bg-red-100 dark:bg-red-900;
}
</style>
