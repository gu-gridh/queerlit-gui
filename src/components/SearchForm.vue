<template>
  <div class="bg-white rounded-xl shadow-lg">
    <div class="py-8 px-6">
      <Freetext class="mt-4 flex-1" @search="search" />
      <TermCombobox class="mb-4 text-xl" @change="search" />
    </div>

    <div
      class="
        container-b
        max-w-screen-md
        py-8
        px-6
        border-t border-dashed border-gray-500
      "
    >
      <h3 class="text-lg mb-2">Avancerat</h3>
      <div class="flex flex-wrap -mx-2">
        <div class="w-full sm:w-1/2 p-2">
          <Autocomplete
            id="search-title"
            placeholder="Titel"
            :value="title"
            :suggest="searchTitle"
            :get-label="(title) => title"
            :get-id="(title) => title"
            @change="setTitle"
          />
        </div>
        <div class="w-full sm:w-1/2 p-2">
          <Autocomplete
            placeholder="Författare"
            :value="author"
            :suggest="searchPerson"
            :get-label="(item) => `${item.givenName} ${item.familyName}`"
            :get-id="(item) => item['@id']"
            @change="setAuthor"
          />
        </div>
        <div class="w-full sm:w-1/2 p-2">
          <YearFilter
            :start="yearStart"
            :end="yearEnd"
            @change="yearChange"
            @keyup.enter="search"
          />
        </div>
        <div class="w-full sm:w-1/2 p-2">
          <Autocomplete
            placeholder="Genre/form"
            :value="genreform"
            :suggest="searchGenreform"
            :get-label="(item) => `${item.label} (${item.scheme})`"
            :get-id="(item) => item.id"
            @change="setGenreform"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";
import useQuery from "@/composables/query";
import { searchGenreform, searchPerson, searchTitle } from "@/services/libris";
import { useStore } from "vuex";
import Freetext from "./Freetext.vue";
import YearFilter from "@/components/YearFilter.vue";
import TermCombobox from "@/components/TermCombobox.vue";
import Autocomplete from "@/components/Autocomplete.vue";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const {
  title,
  author,
  genreform,
  yearStart,
  yearEnd,
  setQuery,
  serializedQuery,
} = useQuery();

function setTitle(title) {
  setQuery({ title });
  search();
}

function setAuthor(author) {
  setQuery({ author });
  search();
}

function yearChange(yearStart, yearEnd) {
  setQuery({ yearStart, yearEnd });
}

function setGenreform(genreform) {
  setQuery({ genreform });
  search();
}

async function search() {
  router.push("/");
  if (!store.getters.isSearching) {
    store.commit("setSearching", serializedQuery.value);
    store.commit("setOffset", 0);
    store.dispatch("search");
  }
}

onMounted(search());
</script>

<style></style>
