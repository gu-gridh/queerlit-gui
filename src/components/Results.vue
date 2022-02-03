<template>
  <div v-if="isSearching" class="p-6 py-10 text-center">
    <icon icon="spinner" size="6x" spin />
  </div>
  <div v-else-if="results">
    <div class="flex p-6">
      <div class="w-1/3">{{ results.length }} träffar</div>
      <div class="w-1/3 text-center">◀ 1 2 3 ▶</div>
      <div class="w-1/3 text-right">
        Sortering:
        <select>
          <option>Relevans</option>
        </select>
      </div>
    </div>
    <WorkHit
      v-for="(book, i) in results"
      :key="book['@id']"
      v-bind="book"
      :i="i"
    />
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
const isSearching = computed(() => store.getters.isSearching);
</script>
