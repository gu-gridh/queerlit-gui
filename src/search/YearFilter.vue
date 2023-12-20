<template>
  <div>
    <div
      class="flex justify-between mb-1 relative z-10 text-sm text-text dark:text-stone-400"
    >
      <input
        :id="inputId"
        v-model.number="range[0]"
        size="4"
        placeholder="Från"
        class="p-1 px-2 rounded shadow-inner leading-snug"
        :class="[
          range[0] != min
            ? 'bg-blue-100 dark:bg-slate-600'
            : 'bg-smoke-200 hover:bg-smoke-300 dark:bg-stone-700 dark:hover:bg-stone-700',
        ]"
        @change="startTextChange"
      />
      <input
        v-model.number="range[1]"
        size="4"
        placeholder="Till"
        class="p-1 px-2 rounded shadow-inner leading-snug"
        :class="{
          'bg-smoke-200 hover:bg-smoke-300 dark:bg-stone-700 dark:hover:bg-stone-700':
            range[1] == MAX,
          'bg-blue-100 dark:bg-slate-600': range[1] != MAX,
        }"
        @change="endTextChange"
      />
    </div>

    <div class="mx-1">
      <YearHistogram
        :min="min"
        :max="MAX"
        :zeroes="enableOld ? 2 : 1"
        @select-range="setRange"
      />

      <Slider
        v-model="range"
        :min="min"
        :max="MAX"
        show-tooltip="drag"
        :classes="{
          horizontal: 'slider-horizontal h-1 mb-2',
          connect: 'slider-connect bg-current',
          origin: 'slider-origin transition-transform',
          handle:
            'slider-handle dark:bg-stone-700 border dark:border-0 border-current focus:ring-text focus:ring-opacity-30',
          tooltip:
            'slider-tooltip bg-smoke-200  border-smoke-300 dark:bg-stone-700 dark:border-stone-700 text-inherit',
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

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from "vue";
import debounce from "lodash/debounce";
import "@vueform/slider/themes/tailwind.scss";
import YearHistogram from "./YearHistogram.vue";

// Async component: https://vuejs.org/guide/components/async.html
// Slider docs: https://github.com/vueform/slider/blob/main/README.md
const Slider = defineAsyncComponent(() => import("@vueform/slider"));

const MIN = 1800;
const MAX = new Date().getFullYear();

const props = defineProps<{
  start?: number;
  end?: number;
  inputId: string;
}>();

const emit = defineEmits<{
  change: [number | null, number | null];
}>();

const range = ref([props.start || MIN, props.end || MAX]);
const enableOld = ref(false);
// While the max value is constant, the min value depends on the enableOld checkbox.
const min = computed(() => (enableOld.value ? 0 : MIN));

watch(props, () => {
  range.value[0] = props.start || min.value;
  range.value[1] = props.end || MAX;
});

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
  if (enableOld.value && range.value[0] == MIN) range.value[0] = 0;
  else if (range.value[0] < min.value) range.value[0] = min.value;
  if (range.value[1] < min.value) range.value[1] = min.value;
  emitChange();
}

function setRange(start: number, end: number) {
  range.value = [Math.max(start, min.value), Math.min(end, MAX)];
  emitChange();
}

const emitChange = debounce(() => {
  // When range extends to min or max, report as empty, thus letting the API determine filtering.
  emit(
    "change",
    range.value[0] != min.value ? range.value[0] : null,
    range.value[1] != MAX ? range.value[1] : null,
  );
}, 400);
</script>

<style scoped>
::placeholder {
  font-size: 16px;
}
</style>
