<script setup>
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { directive as vClickOutside } from "click-outside-vue3";
import useQuery from "@/composables/query";
import useTerms from "@/composables/terms";
import { searchPerson, searchTitle } from "@/services/libris";
import Term from "@/components/Term.vue";
import Dragscroll from "./Dragscroll.vue";

const emit = defineEmits(["search"]);
const store = useStore();
const { text, setQuery } = useQuery();
const terms = useTerms();
const termSuggestions = ref([]);
const titleSuggestions = ref([]);
const authorSuggestions = ref([]);

const showSuggestions = computed(
  () =>
    termSuggestions.value.length ||
    titleSuggestions.value.length ||
    authorSuggestions.value.length
);

function textChange(event) {
  setQuery({ text: event.target.value });
  // Trigger autocomplete in next tick to make it use new input value.
  setTimeout(() => autocomplete());
}

function addTerm(term) {
  terms.add(term);
  removeLastWord();
  emit("search");
}

function setTitle(title) {
  setQuery({ title });
  removeLastWord();
  emit("search");
}

function addAuthor(author) {
  setQuery({ author });
  removeLastWord();
  emit("search");
}

function removeLastWord() {
  store.commit("setQuery", {
    // Remove last word from text.
    text: String(text.value).split(" ").slice(0, -1).join(" "),
  });
  setTimeout(() => autocomplete());
}

async function autocomplete() {
  const lastWord = text.value.split(" ").pop();

  if (lastWord) {
    terms
      .autocomplete(lastWord)
      .then((terms) => (termSuggestions.value = terms));
    searchTitle(lastWord).then((titles) => (titleSuggestions.value = titles));
    searchPerson(lastWord).then(
      (persons) => (authorSuggestions.value = persons)
    );
  } else {
    termSuggestions.value = [];
    titleSuggestions.value = [];
    authorSuggestions.value = [];
  }
}

function blur() {
  termSuggestions.value = [];
  authorSuggestions.value = [];
}
</script>

<template>
  <div v-click-outside="blur">
    <input
      type="search"
      :value="text"
      placeholder="Sök här..."
      class="w-full p-4 bg-transparent text-black"
      @keyup="textChange"
      @keyup.enter="emit('search')"
    />
    <div class="relative h-0">
      <div
        v-if="showSuggestions"
        class="absolute top-0 bg-white shadow rounded-b w-full overflow-hidden"
      >
        <div v-if="termSuggestions.length" class="my-2">
          <div class="text-sm mx-2">Sök på ämnesord:</div>
          <Dragscroll class="overflow-hidden whitespace-nowrap">
            <Term
              v-for="{ term } in termSuggestions"
              :key="term.id"
              class="mx-2"
              @click="addTerm(term)"
            >
              {{ term.prefLabel }}
              <icon icon="plus" size="xs" />
            </Term>
          </Dragscroll>
        </div>

        <div v-if="titleSuggestions.length" class="my-2">
          <div class="text-sm mx-2">Sök på titel:</div>
          <Dragscroll class="overflow-hidden whitespace-nowrap">
            <span
              v-for="title in titleSuggestions"
              :key="title"
              class="mx-2"
              @click="setTitle(title)"
            >
              {{ title }}
            </span>
          </Dragscroll>
        </div>

        <div v-if="authorSuggestions.length" class="my-2">
          <div class="text-sm mx-2">Sök på författare:</div>
          <Dragscroll class="overflow-hidden whitespace-nowrap">
            <span
              v-for="item in authorSuggestions"
              :key="item.id"
              class="mx-2"
              @click="addAuthor(item)"
            >
              {{ item.givenName }} {{ item.familyName }}
            </span>
          </Dragscroll>
        </div>
      </div>
    </div>
  </div>
</template>
