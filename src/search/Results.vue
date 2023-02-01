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
            <option value="_sortKeyByLang.sv">Titel A–Ö</option>
            <option value="-meta.modified">Senast ändrad först</option>
          </select>
        </div>
      </div>
      <WorkResultItem
        v-for="(work, i) in results"
        :key="work['@id']"
        :work="work"
        :i="offset + i + 1"
      />

      <div v-if="!results.length" class="q-body">
        <h1 class="text-6xl my-10">Inga träffar</h1>
        <p>Sökningen gav inga träffar i databasen.</p>
        <p>
          Se gärna våra
          <a
            href="https://queerlit.dh.gu.se/om/inklusionskriterier/"
            title="Inklusionskriterier"
            >inklusionskriterier</a
          >
          som handlar om vilka sorters titlar vi tar med och vilka vi behöver
          utelämna.
        </p>
        <p>
          Notera även att databasen är under uppbyggnad, och vi arbetar
          fortfarande med att föra in all information. Om du saknar något verk,
          eller har tips på ämnesord till något av verken, så vill vi gärna höra
          av dig! Du når oss enklast på mejl: queerlit@lir.gu.se
        </p>
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

    <div v-if="Object.values(localResults).length" class="bg-blue-50">
      <header class="p-1 px-2">
        <h2 class="text-lg">Specialposter</h2>
      </header>
      <LocalWorkResultItem
        v-for="(work, i) in localResults"
        :key="work.id"
        :work="work"
        :i="`S${i + 1}`"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import useTitle from "@/views/title.composable";
import WorkResultItem from "./WorkResultItem.vue";
import LocalWorkResultItem from "./LocalWorkResultItem.vue";
import Pagination from "@/search/Pagination.vue";
import useSearch from "./search.composable";

const store = useStore();
const { doSearch } = useSearch();
useTitle();

const sort = computed(() => store.state.sort);
const results = computed(() => store.state.results);
const total = computed(() => store.state.total);
const offset = computed(() => store.state.offset);
const isSearching = computed(() => store.getters.isSearching);
const localResults = computed(() => store.state.localResults);

function setPage(page) {
  store.commit("setOffset", (page - 1) * 20);
  doSearch({ retain: true });
}

function setSort(event) {
  store.commit("setSort", event.target.value);
  doSearch();
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
