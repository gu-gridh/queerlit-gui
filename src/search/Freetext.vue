<script setup>
import { computed, ref } from "@vue/reactivity";
import { vOnClickOutside } from "@vueuse/components";
import debounce from "lodash/debounce";
import useQuery from "@/search/query.composable";
import useTerms from "@/terms/terms.composable";
import {
  searchConceptQlit,
  searchConceptSao,
  searchConceptBarn,
  searchPerson,
  searchTitle,
} from "@/services/libris.service";
import Term from "@/terms/Term.vue";
import FreetextSuggestions from "./FreetextSuggestions.vue";

const emit = defineEmits(["search"]);
const { text, setQuery } = useQuery();
const terms = useTerms();
const qlitSuggestions = ref([]);
const saoSuggestions = ref([]);
const barnSuggestions = ref([]);
const titleSuggestions = ref([]);
const authorSuggestions = ref([]);

const lenses = [
  { suggestions: qlitSuggestions, autocomplete: searchConceptQlit },
  { suggestions: saoSuggestions, autocomplete: searchConceptSao },
  { suggestions: barnSuggestions, autocomplete: searchConceptBarn },
  { suggestions: titleSuggestions, autocomplete: searchTitle },
  { suggestions: authorSuggestions, autocomplete: searchPerson },
];

const showSuggestions = computed(() =>
  lenses.some(({ suggestions }) => suggestions.value.length)
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
  setQuery({
    // Remove last word from text.
    text: String(text.value).split(" ").slice(0, -1).join(" "),
  });
  setTimeout(() => autocomplete());
}

const autocomplete = debounce(async () => {
  const lastWord = text.value.split(" ").pop();

  if (lastWord) {
    lenses.forEach(({ autocomplete, suggestions }) =>
      autocomplete(lastWord).then((items) => (suggestions.value = items))
    );
  } else {
    clearSuggestions();
  }
}, 400);

function blur() {
  clearSuggestions();
}

function clearSuggestions() {
  lenses.forEach(({ suggestions }) => (suggestions.value = []));
}
</script>

<template>
  <div v-on-click-outside="blur">
    <input
      type="search"
      :value="text"
      placeholder="Sök här..."
      class="w-full p-4 pb-3 bg-smoke-300 rounded-t text-black text-xl"
      :class="{ 'rounded-b': !showSuggestions }"
      @input="textChange"
      @keyup.enter="emit('search')"
      @focus="textChange"
    />
    <div class="relative h-0">
      <div
        v-if="showSuggestions"
        class="
          absolute
          top-0
          bg-smoke-200
          w-full
          overflow-hidden
          rounded-b
          z-20
        "
      >
        <FreetextSuggestions
          v-slot="{ item }"
          heading="Sök på ämnesord:"
          :items="qlitSuggestions"
          @select="addTerm"
        >
          <Term class="cursor-pointer">
            {{ item.prefLabel }}
            <icon icon="plus" size="xs" />
          </Term>
        </FreetextSuggestions>

        <FreetextSuggestions
          v-slot="{ item }"
          heading="Sök på allmäna ämnesord (SAO):"
          :items="saoSuggestions"
          @select="addTerm"
        >
          <Term :data="item" class="cursor-pointer">
            {{ item.prefLabel }}
            <icon icon="plus" size="xs" />
          </Term>
        </FreetextSuggestions>

        <FreetextSuggestions
          v-slot="{ item }"
          heading="Sök på barnämnesord:"
          :items="barnSuggestions"
          @select="addTerm"
        >
          <Term :data="item" class="cursor-pointer">
            {{ item.prefLabel }}
            <icon icon="plus" size="xs" />
          </Term>
        </FreetextSuggestions>

        <FreetextSuggestions
          heading="Sök på titel:"
          :items="titleSuggestions"
          @select="setTitle"
        />

        <FreetextSuggestions
          v-slot="{ item }"
          heading="Sök på författare:"
          :items="authorSuggestions"
          @select="addAuthor"
        >
          {{ item.givenName }} {{ item.familyName }}
        </FreetextSuggestions>
      </div>
    </div>
  </div>
</template>

<style></style>
