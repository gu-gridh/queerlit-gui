<template>
  <div>
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

    <div class="mx-1">
      <Histogram
        :min="min"
        :max="MAX"
        class="-mb-2 relative"
        style="z-index: 3; /* The slider handle has z-index 5 */"
      />

      <VueSlider
        v-model="range"
        :min="min"
        :max="MAX"
        tooltip="none"
        :process-style="{ backgroundColor: 'currentColor' }"
        class="text-text"
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
      <label for="enableOld" class="pl-1">Äldre material</label>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import debounce from "lodash/debounce";
// Docs: https://vue-3-slider-component.netlify.app/?path=/docs/
import VueSlider from "vue-3-slider-component";
import Histogram from "./Histogram.vue";

const MIN = 1800;
const MAX = new Date().getFullYear();

const emit = defineEmits(["change"]);
const props = defineProps(["start", "end"]);
const range = ref([props.start || MIN, props.end || MAX]);
const enableOld = ref(false);
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
  if (range.value[0] < min.value) range.value[0] = min.value;
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
