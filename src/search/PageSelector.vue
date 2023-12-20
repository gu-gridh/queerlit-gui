<script setup lang="ts">
import { ref, watch } from "vue";

// Parent component is responsible for updating :current on @change.
// If :last is not int, make sure to ceil it.
const props = defineProps<{
  current: number;
  last: number;
}>();

const emit = defineEmits(["change"]);

const value = ref(props.current);
const isInputValid = ref(true);

const isValidPage = (page: number) => page > 0 && page <= Math.ceil(props.last);

const goto = (page: number) =>
  isValidPage(page)
    ? emit("change", page)
    : console.warn(`Pagination cannot goto ${page}`);

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  isInputValid.value = isValidPage(parseInt(target.value));
  if (isInputValid.value) {
    goto(parseInt(target.value));
  }
  target.select();
}

function onInputClick(event: Event) {
  (event.target as HTMLInputElement).select();
  isInputValid.value = true;
}

function onInputDown(event: Event) {
  goto(props.current - 1);
  setTimeout(() => (event.target as HTMLInputElement).select());
}

function onInputUp(event: Event) {
  goto(props.current + 1);
  setTimeout(() => (event.target as HTMLInputElement).select());
}

watch(
  () => props.current,
  () => {
    value.value = props.current;
    isInputValid.value = isValidPage(props.current);
  },
);
</script>

<template>
  <div class="flex justify-center whitespace-nowrap">
    <span
      v-if="current > 1"
      class="mr-2 cursor-pointer"
      @click="goto(current - 1)"
    >
      ◀
    </span>
    <span v-else class="mr-2 opacity-20">◀</span>

    <span>
      Sida
      <input
        v-model="value"
        :size="2"
        class="bg-smoke-200 hover:bg-smoke-300 dark:bg-stone-700 dark:hover:bg-stone-700 border-transparent text-text dark:text-stone-400 rounded text-center"
        :class="{ 'bg-red-100 dark:bg-red-900': !isInputValid }"
        @keydown.down="onInputDown"
        @keydown.up="onInputUp"
        @change="onInputChange"
        @click="onInputClick"
      />
      av
      {{ Math.ceil(last) }}
    </span>

    <span
      v-if="current < Math.ceil(last)"
      class="ml-2 cursor-pointer"
      @click="goto(current + 1)"
    >
      ▶
    </span>
    <span v-else class="ml-2 opacity-20">▶</span>
  </div>
</template>
