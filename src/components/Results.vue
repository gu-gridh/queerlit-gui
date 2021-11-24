<template>
  <div v-if="results" class="pl-8 py-4">
    <div class="flex mb-8">
      <div class="w-1/3">{{ results.length }} träffar</div>
      <div class="w-1/3 text-center">◀ 1 2 3 ▶</div>
      <div class="w-1/3 text-right">
        Sortering:
        <select>
          <option>Relevans</option>
        </select>
      </div>
    </div>
    <WorkHit v-for="book in results" :key="book['@id']" v-bind="book" />
    <div class="flex justify-around mb-8">
      <div>◀ 1 2 3 ▶</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { search } from "@/services/libris";
import WorkHit from "@/components/WorkHit.vue";
import { useStore } from "vuex";

const store = useStore();

const results = computed(() => store.state.results);
</script>
