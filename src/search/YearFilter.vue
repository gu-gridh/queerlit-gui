<template>
  <div class="mb-2">
    <div class="flex justify-between mb-1">
      <input
        v-model.number="range[0]"
        size="4"
        class="
          text-sm text-black
          p-1
          px-2
          bg-smoke-200
          hover:bg-smoke-300
          rounded
          shadow-inner
          leading-snug
        "
        placeholder="Från"
        @change="startTextChange"
      />
      <input
        v-model.number="range[1]"
        size="4"
        class="
          text-sm text-black
          p-1
          px-2
          bg-smoke-200
          hover:bg-smoke-300
          rounded
          shadow-inner
          leading-snug
        "
        placeholder="Till"
        @change="endTextChange"
      />
    </div>

    <Histogram :min="MIN" :max="MAX" class="-mb-2" />

    <VueSlider
      v-model="range"
      :min="MIN"
      :max="MAX"
      tooltip="none"
      :process-style="{ backgroundColor: 'currentColor' }"
      class="text-text"
      @change="emitChange"
    />
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import debounce from "lodash/debounce";
// Docs: https://vue-3-slider-component.netlify.app/?path=/docs/
import VueSlider from "vue-3-slider-component";
import Histogram from "./Histogram.vue";

const MIN = 1800;
const MAX = new Date().getFullYear();

const emit = defineEmits(["change"]);
const props = defineProps(["start", "end"]);
const range = ref([props.start || MIN, props.end || MAX]);

function startTextChange() {
  if (!range.value[0]) range.value[0] = MIN;
  emitChange();
}

function endTextChange() {
  if (!range.value[1]) range.value[1] = MAX;
  emitChange();
}

const emitChange = debounce(() => {
  // When range extends to min or max, report as empty, thus letting the API determine filtering.
  emit(
    "change",
    range.value[0] != MIN && range.value[0],
    range.value[1] != MAX && range.value[1]
  );
}, 400);
</script>

<style scoped>
::placeholder {
  font-size: 16px;
}
</style>
