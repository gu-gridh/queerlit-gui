<template>
  <div class="bg-pink-50 text-gray-600 pb-8">
    <div class="container max-w-screen-md xl:max-w-full xl:flex">
      <div class="my-4 xl:w-1/2 xl:pr-4 text-xl">
        <label class="uppercase font-bold text-sm">Fritext</label>
        <div class="mb-2 border rounded flex-1 bg-white">
          <input
            type="search"
            :value="text"
            placeholder="sök här..."
            @keyup="textChange"
            @keyup.enter="search"
            class="w-full p-4 bg-transparent text-black"
          />
          <div class="relative h-0">
            <div
              v-if="termSuggestions.length"
              class="absolute top-0 bg-white p-2 px-4 shadow rounded-b"
            >
              <div class="text-sm mb-2">Sök på ämnesord:</div>
              <Term
                v-for="term in termSuggestions"
                :key="term.id"
                class="mr-2"
                @click="addTerm(term)"
              >
                {{ term.label }}
              </Term>
            </div>
          </div>
        </div>
        <div class="my-2 mx-4 text-base">
          <span class="flex items-center">
            ☝️
            <span class="flex-1"
              >Byt ut fritext "androgyni" mot ämnesord
              <Term class="text-sm">androgyni</Term>?
              <span class="px-2 py-1 mr-1 bg-pink-600 text-white rounded"
                >Ja</span
              >
              <span class="px-2 py-1 mr-1 bg-pink-600 text-white rounded"
                >×</span
              >
            </span>
          </span>
        </div>
      </div>

      <div v-show="isSearchExpanded" class="my-4 xl:w-1/2 xl:pl-4 xl:text-xl">
        <label class="uppercase font-bold text-sm">Ämnesord</label>
        <TermCombobox @change="search" />

        <div class="my-2 mx-4 text-base">
          <span class="flex items-center">
            ☝️
            <span class="flex-1"
              >Ämnesordet <Term class="text-sm">Lesbiska</Term> används istället
              för "Flator".
              <span class="px-2 py-1 mr-1 bg-pink-600 text-white rounded"
                >Varför?</span
              >
            </span>
          </span>
        </div>
      </div>
    </div>
    <div class="container max-w-screen-md xl:max-w-full my-4">
      <details :open="isSearchExpanded >= 2" @toggle="toggleFilters">
        <summary class="my-2 uppercase text-sm text-center">
          Fler filter
        </summary>

        <div class="flex flex-wrap -mx-2">
          <div class="md:w-1/2 xl:w-1/4 p-2">
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
          <div class="md:w-1/2 xl:w-1/4 p-2">
            <label for="search-title" class="uppercase font-bold text-sm">
              Författare
            </label>
            <input
              :value="author"
              @keyup="authorChange"
              @keyup.enter="search"
              id="search-author"
              class="block w-full border rounded text-lg text-black py-1 px-2"
            />
            <div v-for="person in authorSuggestions">
              {{ person.firstname }} {{ person.lastname }}
            </div>
          </div>
          <div class="md:w-1/2 xl:w-1/4 p-2">
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
          <div class="md:w-1/2 xl:w-1/4 p-2">
            <label for="search-title" class="uppercase font-bold text-sm">
              Genre/form
            </label>
            <input
              :value="genreform"
              @keyup="genreformChange"
              @keyup.enter="search"
              id="search-genreform"
              class="block w-full border rounded text-lg text-black py-1 px-2"
            />
          </div>
        </div>
      </details>
    </div>

    <div class="container my-2 text-center">
      <input
        type="submit"
        value="Sök"
        class="rounded text-xl p-4 bg-pink-600 text-white cursor-pointer"
        @click="search"
      />
    </div>
  </div>
</template>

<script setup>
import useQuery from "@/composables/query";
import { getTerms, searchPerson } from "@/services/libris";
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import useTerms from "@/composables/terms";
import Term from "./Term.vue";
import YearFilter from "./YearFilter.vue";
import TermCombobox from "./TermCombobox.vue";

const store = useStore();
const emit = defineEmits(["search"]);

const { text, title, author, yearStart, yearEnd, genreform, setQuery } =
  useQuery();
const terms = useTerms();
const termSuggestions = ref([]);
const authorSuggestions = ref([]);
const isSearchExpanded = computed(() => store.getters.isSearchExpanded);

function textChange(event) {
  setQuery({ text: event.target.value });
  const lastWord = text.value.split(" ").pop();
  termSuggestions.value = terms.autocomplete(lastWord);
}

function toggleFilters(event) {
  store.commit("setExpandSearch", event.target.open ? 2 : 1);
}

function titleChange(event) {
  setQuery({ title: event.target.value });
}

function authorChange(event) {
  searchPerson(event.target.value).then(
    (persons) => (authorSuggestions.value = persons)
  );
  setQuery({ author: event.target.value });
}

function yearChange(yearStart, yearEnd) {
  setQuery({ yearStart, yearEnd });
}

function genreformChange(event) {
  setQuery({ genreform: event.target.value });
}

function addTerm(term) {
  terms.add(term);
  store.commit("setQuery", {
    // Remove last word from text.
    text: String(text.value).split(" ").slice(0, -1).join(" "),
  });
  search();
  termSuggestions.value = [];
}

function removeTerm(term) {
  terms.remove(term);
  search();
}

function search(event) {
  emit("search");
}
</script>

<style scoped>
details[open] summary {
  opacity: 0.5;
}
</style>
