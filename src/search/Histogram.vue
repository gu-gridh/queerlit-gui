<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import range from "lodash/range";

const props = defineProps({
  min: Number,
  max: Number,
});

const store = useStore();

const histogram = computed(() => store.state.histogram);
const bars = computed(() =>
  range(props.min, props.max).map((year) => ({
    year,
    n: histogram.value[year] || 0,
  }))
);

const maxHeight = computed(() =>
  Math.max(...bars.value.map((bar) => bar.n || 0))
);
</script>

<template>
  <div class="flex items-end h-12">
    <div
      v-for="bar in bars"
      :key="bar.year"
      class="bg-current flex-1"
      :style="{ height: (bar.n / maxHeight) * 100 + '%' }"
    />
  </div>
</template>

<style></style>
