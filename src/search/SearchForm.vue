<template>
  <div class="bg-white rounded-xl shadow-lg">
    <div class="py-8 px-6">
      <Freetext @search="search" />
    </div>

    <div
      class="
        container-b
        max-w-screen-md
        py-4
        px-6
        border-t border-dashed border-gray-500
      "
    >
      <h3 class="text-lg mb-2">Avancerat</h3>
      <TermCombobox class="mb-4" @change="search" />
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
      <div class="text-center mt-4">
        <QButton class="text-xl" @click="search">Sök</QButton>
      </div>
    </div>
  </div>
  <div class="text-center mt-4">
    <a
      href="https://libris.kb.se/form_extended.jsp?q=bib%3aqlit&f=ext"
      title="LIBRIS är en nationell söktjänst med information om titlar på svenska bibliotek."
      class="underline text-blue-900"
    >
      Sök i LIBRIS
    </a>
  </div>
</template>

<script setup>
import useQuery from "@/search/query.composable";
import {
  searchGenreform,
  searchPerson,
  searchTitle,
} from "@/services/libris.service";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Freetext from "./Freetext.vue";
import YearFilter from "@/search/YearFilter.vue";
import TermCombobox from "@/terms/TermCombobox.vue";
import Autocomplete from "@/search/Autocomplete.vue";
import QButton from "@/components/QButton.vue";

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

async function search(focus = true) {
  if (focus) router.push("/");
  if (!store.getters.isSearching) {
    store.commit("setSearching", serializedQuery.value);
    store.commit("setOffset", 0);
    store.dispatch("search");
  }
}

// Make an initial search as soon as the search form is visible, but don't switch pages.
search(false);
</script>

<style></style>
