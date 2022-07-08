<template>
  <div class="p-6">
    <div v-if="isSearching" class="spinner p-6 py-10 text-center">
      <icon icon="spinner" size="6x" spin />
    </div>
    <div v-else-if="results">
      <div class="flex pb-6">
        <div class="flex-1 flex flex-wrap">
          <span class="mr-2">{{ total }} träffar</span>
          <Pagination
            v-if="total"
            :current="offset / 20 + 1"
            :last="total / 20"
            @change="setPage"
          />
        </div>
        <div class="flex-1 text-right">
          <label for="sort-input">Sortering: </label>
          <select
            id="sort-input"
            :value="sort"
            class="
              appearance-none
              border
              rounded
              cursor-pointer
              -my-1
              pl-1
              pr-5
            "
            @change="setSort"
          >
            <option value="-publication.year">Nyast först</option>
            <option value="publication.year">Äldst först</option>
            <option value="">Relevans</option>
            <option value="_sortKeyByLang.sv">Titel A-Ö</option>
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

      <div class="p-6">
        <Pagination
          v-if="total"
          :current="offset / 20 + 1"
          :last="total / 20"
          class="mx-auto"
          @change="setPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import WorkHit from "@/components/WorkHit.vue";
import Pagination from "./Pagination.vue";

const store = useStore();
const sort = computed(() => store.state.sort);
const results = computed(() => store.state.results);
const total = computed(() => store.state.total);
const offset = computed(() => store.state.offset);
const isSearching = computed(() => store.getters.isSearching);

function setPage(page) {
  store.commit("setOffset", (page - 1) * 20);
  store.dispatch("search");
}

function setSort(event) {
  store.commit("setSort", event.target.value);
  store.dispatch("search");
}
</script>

<style>
.spinner {
  margin-top: calc(50vh - 150px);
}

select {
  background: url(@/assets/dropdown.svg) no-repeat 95% 50%;
}
</style>
