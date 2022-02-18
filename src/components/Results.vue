<template>
  <div v-if="isSearching" class="p-6 py-10 text-center">
    <icon icon="spinner" size="6x" spin />
  </div>
  <div v-else-if="results">
    <div class="flex p-6">
      <div class="w-1/3">{{ total }} träffar</div>
      <div class="w-1/3 text-center">
        <span @click="prevPage()" class="mx-2">◀</span>
        <span @click="setPage(1)" class="mx-2">1</span>
        <span @click="setPage(2)" class="mx-2">2</span>
        <span @click="setPage(3)" class="mx-2">3</span>
        <span @click="nextPage()" class="mx-2">▶</span>
      </div>
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
      :i="offset + i + 1"
    />

    <div v-if="!results.length" class="my-8 text-center text-xl">
      Inga träffar!
    </div>
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import WorkHit from "@/components/WorkHit.vue";
import { useStore } from "vuex";

const store = useStore();
const results = computed(() => store.state.results);
const total = computed(() => store.state.total);
const offset = computed(() => store.state.offset);
const isSearching = computed(() => store.getters.isSearching);

function setPage(page) {
  store.commit("setOffset", (page - 1) * 20);
  store.dispatch("search");
}

function prevPage() {
  store.commit("setOffset", offset.value - 20);
  store.dispatch("search");
}

function nextPage() {
  store.commit("setOffset", offset.value + 20);
  store.dispatch("search");
}
</script>
