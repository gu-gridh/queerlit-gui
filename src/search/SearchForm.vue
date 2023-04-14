<template>
  <div class="bg-white rounded-xl shadow-lg" @keyup.enter="doSearch">
    <div class="py-6 px-6">
      <div class="mb-4 q-body">
        <p>
          Queerlit är en databas för svensk skönlitteratur som skildrar samkönat
          begär och överskridanden av binära könsnormer. Det innefattar bland
          annat – men inte enbart – skildringar av HBTQI-personer.
        </p>
        <p>
          Databasen är under uppbyggnad, och vi arbetar fortfarande med att föra
          in all information. Om du saknar något verk, eller har tips på
          ämnesord till något av verken, så vill vi gärna
          <a href="https://queerlit.dh.gu.se/om/kontakt" title="Kontakt"
            >höra av dig</a
          >!
        </p>
      </div>

      <Freetext />
    </div>

    <div class="py-4 px-6 border-t border-dashed border-gray-500">
      <h3 class="text-lg mb-2">Avancerat</h3>
      <TermCombobox
        :placeholder="terms.length ? 'Sök fler ämnesord...' : 'Ämnesord...'"
        :terms="terms"
        class="mb-4"
        @add="addTerm"
        @remove="removeTerm"
      />
      <TermCombobox
        :placeholder="
          termsSecondary.length
            ? 'Sök fler ämnesord...'
            : 'Perifera ämnesord...'
        "
        :terms="termsSecondary"
        class="mb-4"
        @add="addTermSecondary"
        @remove="removeTermSecondary"
      />
      <div class="flex flex-wrap -mx-2">
        <div class="w-full sm:w-1/2 p-2">
          <input
            placeholder="Titel"
            :value="title"
            class="
              block
              w-full
              text-lg text-black
              rounded
              shadow-inner
              leading-snug
              py-1
              px-2
              transition-colors
            "
            :class="[title ? 'bg-blue-100' : 'bg-smoke-200 hover:bg-smoke-300']"
            @change="setTitle"
          />
        </div>
        <div class="w-full sm:w-1/2 p-2">
          <Autocomplete
            placeholder="Författare"
            :value="author"
            :suggest="searchPerson"
            :get-label="getPersonLabel"
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
            :get-label="getGenreformLabel"
            :get-id="(item) => item.id"
            @change="setGenreform"
          />
        </div>
      </div>
      <div class="text-center mt-4">
        <QButton class="text-xl" @click="doSearch">Sök</QButton>
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
import Freetext from "./Freetext.vue";
import YearFilter from "@/search/YearFilter.vue";
import TermCombobox from "@/terms/TermCombobox.vue";
import Autocomplete from "@/search/Autocomplete.vue";
import QButton from "@/components/QButton.vue";
import useSearch from "./search.composable";
import useTerms from "@/terms/terms.composable";

const { doSearch, setQuery } = useSearch();
const {
  title,
  author,
  genreform,
  yearStart,
  yearEnd,
  getPersonLabel,
  getGenreformLabel,
} = useQuery();
const { terms, add, remove, termsSecondary, addSecondary, removeSecondary } =
  useTerms();

function addTerm(term) {
  add(term);
}

function removeTerm(term) {
  remove(term);
}

function addTermSecondary(term) {
  addSecondary(term);
}

function removeTermSecondary(term) {
  removeSecondary(term);
}

function setTitle(event) {
  setQuery({ title: event.target.value });
}

function setAuthor(author) {
  setQuery({ author });
}

function yearChange(yearStart, yearEnd) {
  setQuery({ yearStart, yearEnd });
}

function setGenreform(genreform) {
  setQuery({ genreform });
}

// Make an initial search as soon as the search form is visible, but don't switch pages.
doSearch({ retain: true });
</script>

<style scoped>
::placeholder {
  font-size: 16px;
}
</style>
