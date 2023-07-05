<template>
  <div>
    <div class="flex justify-between mb-1 relative z-10">
      <input
        :id="inputId"
        v-model.number="range[0]"
        size="4"
        placeholder="Från"
        class="text-sm text-black p-1 px-2 rounded shadow-inner leading-snug"
        :class="[
          range[0] != min ? 'bg-blue-100' : 'bg-smoke-200 hover:bg-smoke-300',
        ]"
        @change="startTextChange"
      />
      <input
        v-model.number="range[1]"
        size="4"
        placeholder="Till"
        class="text-sm text-black p-1 px-2 rounded shadow-inner leading-snug"
        :class="{
          'bg-smoke-200 hover:bg-smoke-300': range[1] == MAX,
          'bg-blue-100': range[1] != MAX,
        }"
        @change="endTextChange"
      />
    </div>

    <div class="mx-1">
      <Histogram :min="min" :max="MAX" :zeroes="enableOld ? 2 : 1" />

      <Slider
        v-model="range"
        :min="min"
        :max="MAX"
        :tooltips="false"
        :classes="{
          horizontal: 'slider-horizontal h-1 mb-2',
          connect: 'slider-connect bg-current',
          origin: 'slider-origin transition-transform',
          handle: 'slider-handle border border-current',
        }"
        @change="emitChange"
      />
    </div>

    <div class="text-sm">
      <input
        id="enableOld"
        v-model="enableOld"
        type="checkbox"
        @change="enableOldChange"
      />
      <label for="enableOld" class="pl-1">Material innan 1800</label>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import debounce from "lodash/debounce";
// Docs: https://github.com/vueform/slider/blob/main/README.md
import Slider from "@vueform/slider";
import "@vueform/slider/themes/tailwind.scss";
import Histogram from "./Histogram.vue";

const MIN = 1800;
const MAX = new Date().getFullYear();

const emit = defineEmits(["change"]);
const props = defineProps(["start", "end", "input-id"]);
const range = ref([props.start || MIN, props.end || MAX]);
const enableOld = ref(false);
// While the max value is constant, the min value depends on the enableOld checkbox.
const min = computed(() => (enableOld.value ? 0 : MIN));

function startTextChange() {
  if (!range.value[0] && range.value[0] !== 0) range.value[0] = min.value;
  if (range.value[0] < MIN) {
    enableOld.value = true;
  }
  emitChange();
}

function endTextChange() {
  if (!range.value[1]) range.value[1] = MAX;
  emitChange();
}

function enableOldChange() {
  range.value[0] = 0;
  if (range.value[1] < min.value) range.value[1] = min.value;
  emitChange();
}

const emitChange = debounce(() => {
  // When range extends to min or max, report as empty, thus letting the API determine filtering.
  emit(
    "change",
    range.value[0] != min.value && range.value[0],
    range.value[1] != MAX && range.value[1]
  );
}, 400);
</script>

<style scoped>
::placeholder {
  font-size: 16px;
}
</style>
