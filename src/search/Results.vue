<script setup lang="ts">
import { computed } from "vue";
import useTitle from "@/views/title.composable";
import useRootStore from "@/stores/root.store";
import WorkResultItem from "./WorkResultItem.vue";
import LocalWorkResultItem from "./LocalWorkResultItem.vue";
import Pagination from "@/search/Pagination.vue";
import useSearch from "./search.composable";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import FiltersBar from "./FiltersBar.vue";

const store = useRootStore();
const { doSearch } = useSearch();
useTitle();

const total = computed(() => store.total + store.localResults.length);

function setPage(page: number) {
  store.offset = (page - 1) * 20;
  doSearch({ retain: true });
}

function setSort(event: Event) {
  store.sort = (event.target as HTMLSelectElement).value;
  doSearch();
}
</script>

<template>
  <LoadingSpinner v-if="store.isSearching" />
  <div v-else-if="store.results">
    <section class="container flex pt-6 pb-2">
      <div class="flex-1 flex flex-wrap">
        <span class="mr-2">{{ total }} träffar</span>
        <Pagination
          v-if="total"
          :current="store.offset / 20 + 1"
          :last="total / 20"
          @change="setPage"
        />
      </div>
      <div v-if="total" class="flex-1 text-right">
        <label for="sort-input">Sortering: </label>
        <select
          id="sort-input"
          :value="store.sort"
          class="appearance-none border rounded cursor-pointer -my-1 pl-1 pr-5"
          @change="setSort"
        >
          <option value="-publication.year">Nyast först</option>
          <option value="publication.year">Äldst först</option>
          <option value="">Relevans</option>
          <option value="_sortKeyByLang.sv">Titel A–Ö</option>
          <option value="-meta.modified">Senast ändrad först</option>
        </select>
      </div>
    </section>

    <FiltersBar />

    <section>
      <h2 class="sr-only">Sökresultat</h2>
      <WorkResultItem
        v-for="(work, i) in store.results"
        :key="work['@id']"
        :work="work"
        :i="store.offset + i + 1"
      />
    </section>

    <section v-if="total > store.localResults.length" class="p-6">
      <Pagination
        :current="store.offset / 20 + 1"
        :last="total / 20"
        class="mx-auto"
        @change="setPage"
      />
    </section>
  </div>

  <section
    v-if="!store.isSearching && store.localResults.length"
    class="bg-pink-50"
  >
    <header class="container py-1">
      <h2 class="text-lg">Specialtitlar</h2>
      <p class="mt-1 text-sm">
        Titlarna nedan kan inte katalogiseras i Libris på samma sätt som övriga
        titlar. Av tekniska skäl visas de därför något annorlunda.
      </p>
    </header>
    <LocalWorkResultItem
      v-for="(work, i) in store.localResults"
      :key="work.id"
      :work="work"
      :i="i + 1"
    />
  </section>

  <section v-if="!store.isSearching && !total" class="container q-body">
    <h4 class="text-6xl my-10">Inga träffar</h4>
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
      Notera även att databasen är under uppbyggnad, och vi arbetar fortfarande
      med att föra in all information. Om du saknar något verk, eller har tips
      på ämnesord till något av verken, så vill vi gärna höra av dig! Du når oss
      enklast på mejl: queerlit@lir.gu.se
    </p>
  </section>
</template>

<style>
select {
  background: url(@/assets/dropdown.svg) no-repeat 95% 50%;
}
</style>
