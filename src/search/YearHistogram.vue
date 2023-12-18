<script setup lang="ts">
import { computed, ref } from "vue";
import range from "lodash/range";
import floor from "lodash/floor";
import useRootStore from "@/stores/root.store";

type Props = {
  min: number;
  max: number;
  /** Split by decades (1) or centuries (2). */
  zeroes: number;
};

const props = withDefaults(defineProps<Props>(), {
  zeroes: 1,
});

type Bar = { year: number; n: number };

const store = useRootStore();

const focus = ref<Bar | null>(null);

const bars = computed(() =>
  range(props.min, props.max)
    .map((year) => ({
      year,
      n: store.histogram[year] || 0,
    }))
    .reduce((acc, bar) => {
      const year = floor(bar.year, -props.zeroes);
      const bin = acc.find((bar2) => bar2.year == year);
      bin ? (bin.n += bar.n) : acc.push({ year, n: bar.n });
      return acc;
    }, [] as Bar[]),
);

const maxHeight = computed(() =>
  Math.max(...bars.value.map((bar) => bar.n || 0)),
);

function getBarHeight(n: number) {
  return Math.round((n / maxHeight.value) * 100);
}
</script>

<template>
  <div>
    <div class="text-center text-xs h-4 -mt-4 whitespace-nowrap">
      <span v-if="focus">{{ focus.year }}-talet: {{ focus.n }} st</span>
    </div>
    <div v-if="store.histogram" class="flex items-end h-12">
      <div
        v-for="bar in bars"
        :key="bar.year"
        class="flex-1 h-full relative"
        :title="String(bar.year)"
        @mouseover="focus = bar"
        @mouseout="focus = null"
      >
        <div
          v-if="bar.n"
          class="bg-current absolute bottom-0 w-full border-white pb-[.1rem]"
          :style="{
            height: getBarHeight(bar.n) + '%',
            width: '95%',
          }"
        />
      </div>
    </div>
  </div>
</template>

<style></style>
