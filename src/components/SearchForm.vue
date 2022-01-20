<template>
  <div class="bg-pink-50 text-gray-600 pb-8">
    <div class="container max-w-screen-md">
      <div class="my-4">
        <label class="uppercase font-bold text-sm">Fritext</label>
        <div class="mb-2 border rounded text-xl flex-1 bg-white text-black">
          <input
            type="search"
            :value="text"
            placeholder="sök här..."
            @keyup="textChange"
            @keyup.enter="search"
            class="w-full p-4"
          />
          <div class="relative h-0">
            <div
              v-if="termSuggestions.length"
              class="absolute top-0 bg-white p-2 px-4 shadow rounded-b"
            >
              <div class="opacity-75 text-sm mb-2">Sök på ämnesord:</div>
              <Term
                v-for="term in termSuggestions"
                :key="term"
                class="mr-2"
                @click="addTerm(term)"
              >
                {{ term }}
              </Term>
            </div>
          </div>
        </div>

        <div class="my-2 mx-4">
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

      <div v-show="isSearchExpanded" class="my-4">
        <label class="uppercase font-bold text-sm">Ämnesord</label>
        <div class="mb-2 border rounded bg-yellow-50 p-2">
          <div class="-mb-2">
            <Term
              v-for="term in terms"
              :key="term"
              class="mr-2 mb-2"
              @click="removeTerm(term)"
            >
              {{ term }}
            </Term>
            <div class="py-1 mb-2 bg-yellow-400 inline-block"></div>
          </div>
        </div>

        <div class="my-2 mx-4">
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

      <details :open="isSearchExpanded >= 2" @toggle="toggleFilters">
        <summary class="uppercase text-sm text-center">Fler filter</summary>
        <div class="flex flex-wrap -mx-2">
          <div class="md:w-1/2 p-2">
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
          <div class="md:w-1/2 p-2">
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
          </div>
          <div class="md:w-1/2 p-2">
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
          <div class="md:w-1/2 p-2">
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

      <div class="my-2 text-center">
        <input
          type="submit"
          value="Sök"
          class="rounded text-xl p-4 bg-pink-600 text-white cursor-pointer"
          @click="search"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import useQuery from "@/composables/query";
import { getTerms } from "@/services/libris";
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import Term from "./Term.vue";
import YearFilter from "./YearFilter.vue";

const store = useStore();
const emit = defineEmits(["search"]);

const { text, terms, title, author, yearStart, yearEnd, genreform, setQuery } =
  useQuery();

const termSuggestions = ref([]);
const isSearchExpanded = computed(() => store.getters.isSearchExpanded);

function textChange(event) {
  setQuery({ text: event.target.value });
  suggestTerms();
}

function toggleFilters(event) {
  store.commit("setExpandSearch", event.target.open ? 2 : 1);
}

function titleChange(event) {
  setQuery({ title: event.target.value });
}

function authorChange(event) {
  setQuery({ author: event.target.value });
}

function yearChange(yearStart, yearEnd) {
  setQuery({ yearStart, yearEnd });
}

function genreformChange(event) {
  setQuery({ genreform: event.target.value });
}

function suggestTerms() {
  const lastWord = text.value.split(" ").pop();
  termSuggestions.value = matchTerms(lastWord);
}

function matchTerms(input) {
  return input
    ? getTerms().filter(
        (term) => term.toLowerCase().indexOf(input.toLowerCase()) === 0
      )
    : [];
}

function addTerm(term) {
  store.commit("setQuery", {
    terms: terms.value.includes(term) ? terms.value : [...terms.value, term],
    // Remove last word from text.
    text: String(text.value).split(" ").slice(0, -1).join(" "),
  });
  search();
  suggestTerms();
}

function removeTerm(term) {
  store.commit("setQuery", {
    terms: terms.value.filter((term2) => term2 != term),
  });
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
