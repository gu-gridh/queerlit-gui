<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import range from "lodash/range";
import floor from "lodash/floor";

const props = defineProps({
  min: Number,
  max: Number,
});

const store = useStore();

const focus = ref(null);

const histogram = computed(() => store.state.histogram);
const bars = computed(() =>
  range(props.min, props.max)
    .map((year) => ({
      year,
      n: histogram.value[year] || 0,
    }))
    .reduce((acc, bar) => {
      const year = floor(bar.year, -1);
      const bin = acc.find((bar2) => bar2.year == year);
      bin ? (bin.n += bar.n) : acc.push({ year, n: bar.n });
      return acc;
    }, [])
);

const maxHeight = computed(() =>
  Math.max(...bars.value.map((bar) => bar.n || 0))
);
</script>

<template>
  <div>
    <div class="text-center text-xs h-4 -mt-4 whitespace-nowrap">
      <span v-if="focus"> {{ focus.year }}-talet: {{ focus.n }} st </span>
    </div>
    <div class="flex items-end h-12">
      <div
        v-for="bar in bars"
        :key="bar.year"
        class="bg-current flex-1"
        :style="{ height: maxHeight ? (bar.n / maxHeight) * 100 + '%' : 0 }"
        :title="bar.year"
        @mouseover="focus = bar"
        @mouseout="focus = null"
      />
    </div>
  </div>
</template>

<style></style>
