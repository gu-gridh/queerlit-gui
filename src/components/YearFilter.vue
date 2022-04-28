<template>
  <div class="mb-4">
    <div class="flex justify-between">
      <input
        :value="startD"
        size="4"
        class="text-sm text-black p-1 px-2 advanced-form"
        placeholder="Från"
        @change="startTextChange"
      />
      <input
        :value="endD"
        size="4"
        class="text-sm text-black p-1 px-2 advanced-form"
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

// "D" for "data", to distinguish from the props
const startD = ref(props.start);
const endD = ref(props.end);

function startTextChange(event) {
  startD.value = event.target.value;
  emitChange();
}

function endTextChange(event) {
  endD.value = event.target.value;
  emitChange();
}

function emitChange() {
  emit("change", startD.value, endD.value);
}
</script>

<style scoped>
::placeholder {
  font-size: 16px;
}
</style>
