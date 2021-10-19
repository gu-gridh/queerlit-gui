<template>
  <div class="mb-4">
    <div class="flex">
      <h3 class="flex-1 uppercase font-bold text-sm">{{ label || "Typ" }}</h3>
      <span class="underline text-sm">rensa</span>
    </div>
    <div v-for="(count, value) in valuesD" :key="value" class="flex">
      <div class="flex-1">
        <input type="checkbox" :checked="count > 10" /> {{ value }}
      </div>
      <span class="text-gray-500">{{ count }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";

const { label, values } = defineProps({
  label: String,
  values: Object,
});

const valuesD = ref(values);

if (!values) {
  valuesD.value = {
    Bok: 10,
    Tidning: 6,
    Poesi: 12,
  };
}
</script>

<style></style>
