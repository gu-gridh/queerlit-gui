<template>
  <div class="py-8">
    <div class="container">
      <div class="my-4 text-xl">
        <label class="uppercase font-bold text-sm hidden">Fritext</label>
        <div class="mb-2 border rounded flex-1 bg-white">
          <Freetext @search="search" />
        </div>
      </div>

      <div class="my-4">
        <label class="uppercase font-bold text-sm">Ämnesord</label>
        <TermCombobox @change="search" />
      </div>
    </div>
    <div class="container max-w-screen-md my-4">
      <div class="flex flex-wrap -mx-2">
        <div class="w-full sm:w-1/2 p-2">
          <label for="search-title" class="uppercase font-bold text-sm">
            Titel
          </label>
          <input
            :value="title"
            @keyup="titleChange"
            @keyup.enter="search"
            id="search-title"
            class="block w-full border rounded text-lg text-black py-1 px-2"
          />
        </div>
        <div class="w-full sm:w-1/2 p-2">
          <label for="search-title" class="uppercase font-bold text-sm">
            Författare
          </label>
          <Autocomplete
            :suggest="searchPerson"
            :getLabel="(item) => `${item.firstname} ${item.lastname}`"
            :getId="(item) => item.id"
            @change="setAuthor"
          />
        </div>
        <div class="w-full sm:w-1/2 p-2">
          <label for="search-title" class="uppercase font-bold text-sm">
            Utgivningsår
          </label>
          <YearFilter
            :start="yearStart"
            :end="yearEnd"
            @change="yearChange"
            @keyup.enter="search"
          />
        </div>
        <div class="w-full sm:w-1/2 p-2">
          <label for="search-title" class="uppercase font-bold text-sm">
            Genre/form
          </label>
          <Autocomplete
            :suggest="searchGenreform"
            :getLabel="(item) => `${item.label} (${item.scheme})`"
            :getId="(item) => item.id"
            @change="setGenreform"
          />
        </div>
      </div>
    </div>

    <div class="container my-2 text-center">
      <QButton class="text-2xl" @click="search">Sök</QButton>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";
import useQuery from "@/composables/query";
import { searchGenreform, searchPerson } from "@/services/libris";
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

const { title, yearStart, yearEnd, setQuery, serializedQuery } = useQuery();
const terms = useTerms();

function titleChange(event) {
  setQuery({ title: event.target.value });
}

function setAuthor(author) {
  setQuery({ author: author && author._item });
  search();
}

function yearChange(yearStart, yearEnd) {
  setQuery({ yearStart, yearEnd });
}

function setGenreform(genreform) {
  setQuery({ genreform: genreform ? genreform.id : null });
  search();
}

function removeTerm(term) {
  terms.remove(term);
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
