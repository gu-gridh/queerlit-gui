<script setup>
import Dragscroll from "./Dragscroll.vue";

defineProps(["heading", "items", "select"]);
defineEmits(["select"]);
</script>

<template>
  <div v-if="items.length" class="my-2">
    <div class="text-sm mx-2">{{ heading }}</div>
    <Dragscroll class="overflow-hidden whitespace-nowrap pt-2 pb-3 text-lg">
      <span
        v-for="(item, i) in items"
        :key="i"
        class="mx-2"
        @click="$emit('select', item)"
      >
        <slot :item="item">
          {{ item }}
        </slot>
      </span>
    </Dragscroll>
  </div>
</template>

<style></style>
