<template>
  <div class="bg-white rounded-xl shadow-lg p-6" @keyup.enter="doSearch()">
    <section class="mb-4 q-body">
      <ReadMore :expanded="queryStore.isEmpty">
        <p>
          Queerlit är en databas för svensk skönlitteratur som skildrar samkönat
          begär och överskridanden av binära könsnormer. Det innefattar bland
          annat – men inte enbart – skildringar av hbtqi-personer.
        </p>
        <p>
          Om du saknar något verk, eller har tips på ämnesord till något av
          verken, så vill vi gärna
          <a href="https://queerlit.dh.gu.se/om/foresla" title="Kontakt"
            >höra av dig</a
          >!
        </p>
      </ReadMore>
    </section>

    <h2 class="sr-only">Sökformulär</h2>
    <Freetext class="mb-6" />

    <QDetails
      heading="Ämnen"
      class="my-6"
      :expanded="Boolean(expandedTerms || usingTerms)"
      @toggle="!usingTerms && toggleTerms()"
    >
      <TermFilters />
    </QDetails>

    <Labeled label="Utgivningsår" for-id="year">
      <YearFilter
        :start="yearStart != null ? yearStart : undefined"
        :end="yearEnd != null ? yearEnd : undefined"
        input-id="year"
        @change="yearChange"
      />
    </Labeled>

    <QDetails
      heading="Avancerade sökfilter"
      class="my-6"
      :expanded="Boolean(expandedAdvanced || usingAdvanced)"
      @toggle="!usingAdvanced && toggleAdvanced()"
    >
      <div class="flex flex-wrap -mx-2">
        <div class="w-full sm:w-1/2 p-2">
          <Labeled label="Titel" for-id="title">
            <QInput
              v-model="titleLocal"
              input-id="title"
              :has-value="!!title"
              help="Titeln måste innehålla dessa ord"
              :search="true"
              @change="setTitle"
            />
          </Labeled>
        </div>

        <div class="w-full sm:w-1/2 p-2">
          <Labeled label="Författare" for-id="author">
            <Autocomplete
              :value="author || undefined"
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
              :value="genreform || undefined"
              :suggest="searchGenreform"
              :get-label="getGenreformLabel"
              :get-id="(item: GenreForm) => item.id"
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

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useToggle } from "@vueuse/core";
import type { HasId, Person } from "@/services/libris.types";
import { searchGenreform, searchPerson } from "@/services/libris.service";
import useQuery from "./query.composable";
import useQueryStore from "@/stores/query.store";
import Freetext from "./Freetext.vue";
import YearFilter from "./YearFilter.vue";
import Autocomplete from "./Autocomplete.vue";
import useSearch from "./search.composable";
import TermFilters from "./TermFilters.vue";
import QButton from "@/components/QButton.vue";
import Labeled from "@/components/Labeled.vue";
import QInput from "@/components/QInput.vue";
import ReadMore from "@/components/ReadMore.vue";
import QDetails from "@/components/QDetails.vue";
import type { GenreForm } from "@/types/work";

const { doSearch, setQuery } = useSearch();
const {
  terms,
  termsSecondary,
  title,
  author,
  genreform,
  yearStart,
  yearEnd,
  getPersonLabel,
  getGenreformLabel,
} = useQuery();
const queryStore = useQueryStore();
const [expandedAdvanced, toggleAdvanced] = useToggle();
const [expandedTerms, toggleTerms] = useToggle(true);
const usingAdvanced = computed(
  () => title.value || author.value || genreform.value,
);
const usingTerms = computed(
  () => terms.value.length || termsSecondary.value.length,
);
const titleLocal = ref(title.value);

function setTitle(event: Event) {
  setQuery({ title: (event.target as HTMLInputElement).value });
}

function setAuthor(author: Person & HasId) {
  setQuery({ author });
}

function yearChange(yearStart: number | null, yearEnd: number | null) {
  setQuery({ yearStart, yearEnd });
}

function setGenreform(genreform: GenreForm) {
  setQuery({ genreform });
}

// Make an initial search as soon as the search form is visible, but don't switch pages.
doSearch({ retain: true });

watch(title, () => (titleLocal.value = title.value));
</script>

<style scoped>
::placeholder {
  font-size: 16px;
}
</style>
