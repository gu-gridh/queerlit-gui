<template>
  <div class="bg-white rounded-xl shadow-lg p-6" @keyup.enter="doSearch">
    <div class="mb-4 q-body">
      <ReadMore :expanded="isQueryEmpty">
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
      </ReadMore>
    </div>

    <Freetext class="mb-6" />

    <TermFilters />

    <Labeled label="Utgivningsår" for-id="year">
      <YearFilter
        :start="yearStart"
        :end="yearEnd"
        input-id="year"
        @change="yearChange"
      />
    </Labeled>

    <QDetails
      heading="Avancerade sökfilter"
      class="my-6"
      :expanded="expandedAdvanced || usingAdvanced"
      @toggle="toggleAdvanced()"
    >
      <div class="flex flex-wrap -mx-2">
        <div class="w-full sm:w-1/2 p-2">
          <Labeled label="Titel" for-id="title">
            <QInput
              input-id="title"
              :value="title"
              :has-value="title"
              help="Titeln måste innehålla dessa ord"
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
              help="Alla författare som listas finns inte representerade i Queerlit"
              @change="setAuthor"
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
              help="Beskriver vad ett verk är, t.ex. bilderbok, deckare, poesi"
              @change="setGenreform"
            />
          </Labeled>
        </div>
      </div>
    </QDetails>

    <div class="text-center mt-4">
      <QButton class="text-xl" @click="doSearch">Sök</QButton>
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
import { useToggle } from "@vueuse/core";
import useQuery from "@/search/query.composable";
import { searchGenreform, searchPerson } from "@/services/libris.service";
import Freetext from "./Freetext.vue";
import YearFilter from "@/search/YearFilter.vue";
import Autocomplete from "@/search/Autocomplete.vue";
import QButton from "@/components/QButton.vue";
import useSearch from "./search.composable";
import Labeled from "@/components/Labeled.vue";
import QInput from "@/components/QInput.vue";
import ReadMore from "@/components/ReadMore.vue";
import TermFilters from "./TermFilters.vue";
import QDetails from "@/components/QDetails.vue";
import { computed } from "vue";

const { doSearch, setQuery } = useSearch();
const {
  title,
  author,
  genreform,
  yearStart,
  yearEnd,
  getPersonLabel,
  getGenreformLabel,
  isQueryEmpty,
} = useQuery();
const [expandedAdvanced, toggleAdvanced] = useToggle();
const usingAdvanced = computed(
  () => title.value || author.value || genreform.value
);

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
