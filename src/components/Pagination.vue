<script setup>
import { computed } from "@vue/reactivity";

// Parent component is responsible for updating :current on @change.
// If :last is not int, make sure to ceil it.
const props = defineProps(["current", "last"]);
const emit = defineEmits(["change"]);

const gotoable = computed(() =>
  [
    props.current - 2,
    props.current - 1,
    props.current,
    props.current + 1,
    props.current + 2,
  ].filter(isValidPage)
);

const isValidPage = (page) => page > 0 && page <= Math.ceil(props.last);

const goto = (page) =>
  isValidPage(page)
    ? emit("change", page)
    : console.warn(`Pagination cannot goto ${page}`);
</script>

<template>
  <div class="flex">
    <span
      v-if="current > 1"
      @click="goto(current - 1)"
      class="mx-2 cursor-pointer"
    >
      ◀
    </span>
    <span v-else class="mx-2 opacity-20">◀</span>

    <span class="flex-1 text-center">
      <template v-for="page in gotoable" :key="page">
        <span v-if="current == page" class="mx-2 underline">{{ page }}</span>
        <span v-else @click="goto(page)" class="mx-2 cursor-pointer">
          {{ page }}
        </span>
      </template>
    </span>

    <span
      v-if="current < Math.ceil(last)"
      @click="goto(current + 1)"
      class="mx-2 cursor-pointer"
    >
      ▶
    </span>
    <span v-else class="mx-2 opacity-20">▶</span>
  </div>
</template>
