<script setup>
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

// Parent component is responsible for updating :current on @change.
// If :last is not int, make sure to ceil it.
const props = defineProps({
  current: {
    type: Number,
    required: true,
  },
  last: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["change"]);

const value = ref(props.current);
const isInputValid = ref(true);

const isValidPage = (page) => page > 0 && page <= Math.ceil(props.last);

const goto = (page) =>
  isValidPage(page)
    ? emit("change", page)
    : console.warn(`Pagination cannot goto ${page}`);

function onInputChange(event) {
  console.log("input change!");
  isInputValid.value = isValidPage(event.target.value);
  if (isInputValid.value) {
    goto(event.target.value);
  }
  event.target.select();
}

function onInputClick(event) {
  event.target.select();
  isInputValid.value = true;
}

function onInputDown(event) {
  goto(props.current - 1);
  setTimeout(() => event.target.select());
}

function onInputUp(event) {
  goto(props.current + 1);
  setTimeout(() => event.target.select());
}

watch(
  () => props.current,
  () => {
    value.value = props.current;
    isInputValid.value = isValidPage(props.current);
  }
);
</script>

<template>
  <div class="flex justify-center">
    <span
      v-if="current > 1"
      class="mx-2 cursor-pointer"
      @click="goto(current - 1)"
    >
      ◀
    </span>
    <span v-else class="mx-2 opacity-20">◀</span>

    <span>
      Sida
      <input
        v-model="value"
        :size="2"
        class="border text-center px-0"
        :class="{ 'bg-yellow-100': !isInputValid }"
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
      class="mx-2 cursor-pointer"
      @click="goto(current + 1)"
    >
      ▶
    </span>
    <span v-else class="mx-2 opacity-20">▶</span>
  </div>
</template>
