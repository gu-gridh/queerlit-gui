<script setup lang="ts">
import { ref, watch } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import debounce from "lodash/debounce";
import { useToggle } from "@vueuse/shared";
import type { GenreForm, Term as TermType } from "@/types/work";
import useQuery from "@/search/query.composable";
import useTerms from "@/terms/terms.composable";
import {
  searchConceptSao,
  searchConceptBarn,
  searchGenreform,
} from "@/services/libris.service";
import useMulticomplete from "./multicomplete.composable";
import Term from "@/terms/Term.vue";
import FreetextSuggestions from "./FreetextSuggestions.vue";
import FreetextInstructions from "./FreetextInstructions.vue";
import ToggleIcon from "@/components/ToggleIcon.vue";
import CloseButton from "@/components/CloseButton.vue";
import { searchTerms } from "@/services/terms.service";
import useSearch from "./search.composable";

const { text } = useQuery();
const { setQuery } = useSearch();
const terms = useTerms();

const [showSuggestions, toggleSuggestions] = useToggle();
const [showHelp, toggleHelp] = useToggle();

const Multicomplete = useMulticomplete({
  qlit: searchTerms,
  sao: searchConceptSao,
  barn: searchConceptBarn,
  gf: searchGenreform,
});
// Ref unwrapping in the template only works for top-level properties.
// See https://vuejs.org/guide/essentials/reactivity-fundamentals.html#ref-unwrapping-in-templates
const suggestions = Multicomplete.suggestions;
const hasSuggestions = Multicomplete.hasSuggestions;

const textLocal = ref(text.value);

watch(text, () => (textLocal.value = text.value));
watch(textLocal, onInput);

function commitText() {
  setQuery({ text: textLocal.value });
}

function onInput() {
  // Trigger autocomplete in next tick to make it use new input value.
  setTimeout(() => autocomplete());
  toggleSuggestions(true);
}

function addTerm(term: TermType) {
  terms.add(term);
  removeLastWord();
}

function setGenreform(genreform: GenreForm) {
  setQuery({ genreform });
  removeLastWord();
}

function removeLastWord() {
  // Remove last word from text.
  textLocal.value = String(textLocal.value).split(" ").slice(0, -1).join(" ");
  commitText();
  onInput();
}

const autocomplete = debounce(async () => {
  const lastWord = textLocal.value.split(" ").pop();

  if (lastWord) {
    Multicomplete.autocomplete(lastWord);
  } else {
    Multicomplete.clear();
  }
}, 400);

function blur() {
  commitText();
  toggleSuggestions(false);
}

watch(showHelp, () => {
  if (showHelp) {
    toggleSuggestions(false);
  }
});
</script>

<template>
  <div v-on-click-outside="blur">
    <div
      class="w-full flex items-center px-2 rounded-t text-text dark:text-stone-400 text-xl shadow-inner transition-colors"
      :class="[
        !(hasSuggestions && showSuggestions) ? 'rounded-b' : null,
        text
          ? 'bg-blue-100 dark:bg-slate-600'
          : 'bg-smoke-200 hover:bg-smoke-300 dark:bg-stone-700 dark:hover:bg-stone-700',
      ]"
    >
      <input
        v-model="textLocal"
        type="search"
        placeholder="Sök här..."
        class="flex-1 bg-transparent p-1 py-3"
        @focus="onInput"
        @keyup.enter="commitText()"
      />

      <ToggleIcon icon="question" :value="showHelp" :toggle="toggleHelp" />
    </div>

    <div class="relative h-0">
      <div
        v-if="hasSuggestions && showSuggestions"
        class="absolute top-0 bg-smoke-200 w-full overflow-hidden rounded-b shadow z-20"
      >
        <CloseButton @click="toggleSuggestions(false)" />

        <FreetextSuggestions
          v-slot="{ item }"
          heading="Ämnesord (QLIT):"
          :items="suggestions.qlit"
          @select="addTerm"
        >
          <Term :data="item" class="cursor-pointer">
            {{ item.label }}
            <div class="inline-block">
              <icon icon="plus" size="xs" class="ml-1 flex" />
            </div>
          </Term>
        </FreetextSuggestions>

        <FreetextSuggestions
          v-slot="{ item }"
          heading="Allmäna ämnesord (SAO):"
          :items="suggestions.sao"
          @select="addTerm"
        >
          <Term :data="item" class="cursor-pointer">
            {{ item.label }}
            <div class="inline-block">
              <icon icon="plus" size="xs" class="ml-1 flex" />
            </div>
          </Term>
        </FreetextSuggestions>

        <FreetextSuggestions
          v-slot="{ item }"
          heading="Barnämnesord:"
          :items="suggestions.barn"
          @select="addTerm"
        >
          <Term :data="item" class="cursor-pointer">
            {{ item.label }}
            <div class="inline-block">
              <icon icon="plus" size="xs" class="ml-1 flex" />
            </div>
          </Term>
        </FreetextSuggestions>

        <FreetextSuggestions
          v-slot="{ item }"
          heading="Genre/form:"
          :items="suggestions.gf"
          @select="setGenreform"
        >
          <Term :data="item" class="cursor-pointer">
            {{ item.label }}
            <template v-if="!item.primary"> ({{ item.schemeCode }}) </template>
            <div class="inline-block">
              <icon icon="plus" size="xs" class="ml-1 flex" />
            </div>
          </Term>
        </FreetextSuggestions>
      </div>
    </div>

    <FreetextInstructions v-show="showHelp" @dismiss="toggleHelp(false)" />
  </div>
</template>

<style></style>
