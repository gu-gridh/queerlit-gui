<template>
  <div class="search-widget">
    <div class="py-8">
      <div class="">
        <div class="my-4 text-xl">
          <div class="mb-2 search-border search-rounded flex-1">
            <Freetext @search="search" />
          </div>
        </div>

        <div class="my-4 text-xl">
          <TermCombobox @change="search" />
        </div>
      </div>

      <div class="subtitle">Avancerat</div>
      <div class="container-b max-w-screen-md my-4">
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

    <!-- <div class="container my-2 text-center">
      <QButton class="text-2xl" @click="search">Sök</QButton>
    </div> -->
  </div>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";
import useQuery from "@/composables/query";
import { searchGenreform, searchPerson, searchTitle } from "@/services/libris";
import { useStore } from "vuex";
import useTerms from "@/composables/terms";
import Freetext from "./Freetext.vue";
import YearFilter from "@/components/YearFilter.vue";
import TermCombobox from "@/components/TermCombobox.vue";
import QButton from "@/components/QButton.vue";
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
const terms = useTerms();

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

<style>
.search-widget {
  background-color: white;
  border-radius: 15px;
  padding: 0px 30px 0 30px;
  box-shadow: 0rem 0rem 1rem rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease-in-out;
}

.subtitle {
  width: calc(100% + 60px);
  border-color: grey;
  border-width: 0.5px 0 0 0;
  border-style: dashed;
  padding: 40px 0 10px 40px;
  margin-top: 50px;
  margin-left: -30px;
  margin-bottom: 0px;
  font-size: 120%;
}

.container-b {
  margin-top: 0px !important;
  padding: 0px 10px 0px 10px !important;
}

.rounded {
  border-radius: 5px !important;
}

.border {
  border-color: grey;
  border-width: 0.5px;
}

.search-rounded {
  border-radius: 5px !important;
}

.search-border {
  border-color: grey;
  border-width: 0px;
  background-color: #dfe5e2 !important;
}

.search-border:hover {
  background-color: #dfe5e2 !important;
}

.advanced-form {
  border-color: grey;
  border-width: 0.5px;
  height: 35px;
}

.top-sort{
  z-index:100;
}
</style>
