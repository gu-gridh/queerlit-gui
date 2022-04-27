<script setup>
import Dragscroll from "./Dragscroll.vue";

defineProps(["heading", "items", "select"]);
defineEmits(["select"]);
</script>

<template>
  <div v-if="items.length" class="my-2">
    <div class="text-sm mx-2">{{ heading }}</div>
    <Dragscroll class="term-suggestions overflow-hidden whitespace-nowrap">
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

<style>
.term-suggestions {
  padding: 10px 0px 25px 0px;
}
</style>
