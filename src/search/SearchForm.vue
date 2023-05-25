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

      <Labeled label="Ämnesord" for-id="terms">
        <TermCombobox
          :terms="terms"
          input-id="terms"
          class="mb-4"
          @add="addTerm"
          @remove="removeTerm"
        />
      </Labeled>

      <Labeled label="Perifera ämnesord" for-id="terms-secondary">
        <TermCombobox
          :terms="termsSecondary"
          input-id="terms-secondary"
          class="mb-4"
          @add="addTermSecondary"
          @remove="removeTermSecondary"
        />
      </Labeled>

      <div class="flex flex-wrap -mx-2">
        <div class="w-full sm:w-1/2 p-2">
          <Labeled label="Titel" for-id="title">
            <input
              id="title"
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
              :class="[
                title ? 'bg-blue-100' : 'bg-smoke-200 hover:bg-smoke-300',
              ]"
              @change="setTitle"
            />
          </Labeled>
        </div>

        <div class="w-full sm:w-1/2 p-2">
          <Labeled label="Författare" for-id="author">
            <Autocomplete
              :value="author"
              :suggest="searchPerson"
              :get-label="getPersonLabel"
              :get-id="(item) => item['@id']"
              input-id="author"
              @change="setAuthor"
            />
          </Labeled>
        </div>

        <div class="w-full sm:w-1/2 p-2">
          <Labeled label="Utgivningsår" for-id="year">
            <YearFilter
              :start="yearStart"
              :end="yearEnd"
              input-id="year"
              @change="yearChange"
            />
          </Labeled>
        </div>

        <div class="w-full sm:w-1/2 p-2">
          <Labeled label="Genre/form" for-id="genreform">
            <Autocomplete
              :value="genreform"
              :suggest="searchGenreform"
              :get-label="getGenreformLabel"
              :get-id="(item) => item.id"
              input-id="genreform"
              @change="setGenreform"
            />
          </Labeled>
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
import Labeled from "@/components/Labeled.vue";

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
