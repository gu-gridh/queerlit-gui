<template>
  <div class="bg-white rounded-xl shadow-lg">
    <div class="py-6 px-6">
      <div class="mb-4">
        <p class="mb-2">
          Queerlit är en databas för svensk skönlitteratur som skildrar samkönat
          begär och överskridanden av binära könsnormer. Det innefattar bland
          annat – men inte enbart – skildringar av HBTQI-personer.
        </p>
        <p class="mb-2">
          Databasen är under uppbyggnad, och vi arbetar fortfarande med att föra
          in all information. Om du saknar något verk, eller har tips på
          ämnesord till något av verken, så vill vi gärna höra av dig! Du når
          oss enklast på mejl: queerlit@lir.gu.se
        </p>
      </div>

      <Freetext @search="search" />
    </div>

    <div class="py-4 px-6 border-t border-dashed border-gray-500">
      <h3 class="text-lg mb-2">Avancerat</h3>
      <TermCombobox class="mb-4" @change="search" />
      <div class="flex flex-wrap -mx-2">
        <div class="w-full sm:w-1/2 p-2">
          <input
            placeholder="Titel"
            :value="title"
            class="
              block
              w-full
              text-lg text-black
              bg-smoke-200
              hover:bg-smoke-300
              rounded
              shadow-inner
              leading-snug
              py-1
              px-2
              transition-colors
            "
            @change="setTitle"
          />
        </div>
        <div class="w-full sm:w-1/2 p-2">
          <Autocomplete
            placeholder="Författare"
            :value="author"
            :suggest="searchPerson"
            :get-label="
              (item) =>
                `${item.givenName} ${item.familyName}` +
                (item.lifeSpan ? ` (${item.lifeSpan})` : '')
            "
            :get-id="(item) => item['@id']"
            @change="setAuthor"
          />
        </div>
        <div class="w-full sm:w-1/2 p-2">
          <YearFilter :start="yearStart" :end="yearEnd" @change="yearChange" />
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
      title="Libris är en nationell söktjänst med information om titlar på svenska bibliotek."
      class="underline text-blue-900"
    >
      Sök i Libris
    </a>
  </div>
</template>

<script setup>
import useQuery from "@/search/query.composable";
import { searchGenreform, searchPerson } from "@/services/libris.service";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Freetext from "./Freetext.vue";
import YearFilter from "@/search/YearFilter.vue";
import TermCombobox from "@/terms/TermCombobox.vue";
import Autocomplete from "@/search/Autocomplete.vue";
import QButton from "@/components/QButton.vue";
import useSearch from "./search.composable";

const store = useStore();
const router = useRouter();
const { doSearch } = useSearch();

const {
  title,
  author,
  genreform,
  yearStart,
  yearEnd,
  setQuery,
  serializedQuery,
} = useQuery();

function setTitle(event) {
  setQuery({ title: event.target.value });
  search();
}

function setAuthor(author) {
  setQuery({ author });
  search();
}

function yearChange(yearStart, yearEnd) {
  setQuery({ yearStart, yearEnd });
  search();
}

function setGenreform(genreform) {
  setQuery({ genreform });
  search();
}

async function search(focus = true) {
  if (focus) router.push("/");
  if (!store.getters.isSearching) {
    store.commit("setSearching", serializedQuery.value);
    doSearch();
  }
}

// Make an initial search as soon as the search form is visible, but don't switch pages.
search(false);
</script>

<style scoped>
::placeholder {
  font-size: 16px;
}
</style>
