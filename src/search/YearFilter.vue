<template>
  <div class="mb-4">
    <div class="flex justify-between">
      <input
        v-model="start"
        size="4"
        class="text-sm text-black p-1 px-2 border border-gray-500 leading-snug"
        placeholder="Från"
        @change="startTextChange"
      />
      <input
        v-model="end"
        size="4"
        class="text-sm text-black p-1 px-2 border border-gray-500 leading-snug"
        placeholder="Till"
        @change="endTextChange"
      />
    </div>

    <div class="flex items-end mx-2 mr-1 mt-3 border-b-2 border-gray-600"></div>

    <div class="relative h-0 -m-2 z-10 px-2">
      <div
        class="h-4 w-4 rounded-full bg-white border-2 border-gray-600 absolute"
      />
      <div
        class="
          h-4
          w-4
          rounded-full
          bg-white
          border-2 border-gray-600
          absolute
          right-2
        "
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";

const emit = defineEmits(["change"]);
const props = defineProps(["start", "end"]);

const MIN = 1800;
const MAX = new Date().getFullYear();

// "D" for "data", to distinguish from the props
const start = ref(props.start || MIN);
const end = ref(props.end || MAX);

function startTextChange() {
  if (!start.value) start.value = MIN;
  emitChange();
}

function endTextChange() {
  if (!end.value) end.value = MAX;
  emitChange();
}

function emitChange() {
  // Coalesce to empty at the min/max boundaries.
  emit(
    "change",
    start.value != MIN && start.value,
    end.value != MAX && end.value
  );
}
</script>

<style scoped>
::placeholder {
  font-size: 16px;
}
</style>
