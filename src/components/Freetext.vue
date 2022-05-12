<script setup>
import { computed, ref } from "@vue/reactivity";
import { directive as vClickOutside } from "click-outside-vue3";
import debounce from "lodash/debounce";
import useQuery from "@/composables/query";
import useTerms from "@/composables/terms";
import { searchConceptSao, searchPerson, searchTitle } from "@/services/libris";
import Term from "@/components/Term.vue";
import FreetextSuggestions from "./FreetextSuggestions.vue";

const emit = defineEmits(["search"]);
const { text, setQuery } = useQuery();
const terms = useTerms();
const termSuggestions = ref([]);
const saoSuggestions = ref([]);
const titleSuggestions = ref([]);
const authorSuggestions = ref([]);

const showSuggestions = computed(
  () =>
    termSuggestions.value.length ||
    saoSuggestions.value.length ||
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
  setQuery({
    // Remove last word from text.
    text: String(text.value).split(" ").slice(0, -1).join(" "),
  });
  setTimeout(() => autocomplete());
}

const autocomplete = debounce(async () => {
  const lastWord = text.value.split(" ").pop();

  if (lastWord) {
    terms
      .autocomplete(lastWord)
      .then((terms) => (termSuggestions.value = terms));
    searchConceptSao(lastWord).then((terms) => (saoSuggestions.value = terms));
    searchTitle(lastWord).then((titles) => (titleSuggestions.value = titles));
    searchPerson(lastWord).then(
      (persons) => (authorSuggestions.value = persons)
    );
  } else {
    termSuggestions.value = [];
    saoSuggestions.value = [];
    titleSuggestions.value = [];
    authorSuggestions.value = [];
  }
}, 400);

function blur() {
  termSuggestions.value = [];
  saoSuggestions.value = [];
  titleSuggestions.value = [];
  authorSuggestions.value = [];
}
</script>

<template>
  <div v-click-outside="blur">
    <input
      type="search"
      :value="text"
      placeholder="Sök här..."
      class="w-full p-4 pb-3 bg-smoke-300 rounded-t text-black text-xl"
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
          :items="termSuggestions"
          @select="(item) => addTerm(item.term)"
        >
          <Term class="cursor-pointer">
            {{ item.term.prefLabel }}
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
