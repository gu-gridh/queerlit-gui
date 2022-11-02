<script setup>
import { vOnClickOutside } from "@vueuse/components";
import debounce from "lodash/debounce";
import useQuery from "@/search/query.composable";
import useTerms from "@/terms/terms.composable";
import {
  searchConceptQlit,
  searchConceptSao,
  searchConceptBarn,
} from "@/services/libris.service";
import useMulticomplete from "./multicomplete.composable";
import Term from "@/terms/Term.vue";
import FreetextSuggestions from "./FreetextSuggestions.vue";

const emit = defineEmits(["search"]);
const { text, setQuery } = useQuery();
const terms = useTerms();

const Multicomplete = useMulticomplete({
  qlit: searchConceptQlit,
  sao: searchConceptSao,
  barn: searchConceptBarn,
});
// The component needs a direct reference to these reactives.
const suggestions = Multicomplete.suggestions;
const hasSuggestions = Multicomplete.hasSuggestions;

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
    Multicomplete.autocomplete(lastWord);
  } else {
    Multicomplete.clear();
  }
}, 400);

function blur() {
  Multicomplete.clear();
}
</script>

<template>
  <div v-on-click-outside="blur">
    <input
      type="search"
      :value="text"
      placeholder="Sök här..."
      class="w-full p-4 pb-3 bg-smoke-300 rounded-t text-black text-xl"
      :class="{ 'rounded-b': !hasSuggestions }"
      @input="textChange"
      @keyup.enter="emit('search')"
      @focus="textChange"
    />
    <div class="relative h-0">
      <div
        v-if="hasSuggestions"
        class="
          absolute
          top-0
          bg-smoke-200
          w-full
          overflow-hidden
          rounded-b
          shadow
          z-20
        "
      >
        <FreetextSuggestions
          v-slot="{ item }"
          heading="Ämnesord (QLIT):"
          :items="suggestions.qlit"
          @select="addTerm"
        >
          <Term class="cursor-pointer">
            {{ item._label }}
            <icon icon="plus" size="xs" />
          </Term>
        </FreetextSuggestions>

        <FreetextSuggestions
          v-slot="{ item }"
          heading="Allmäna ämnesord (SAO):"
          :items="suggestions.sao"
          @select="addTerm"
        >
          <Term :data="item" class="cursor-pointer">
            {{ item._label }}
            <icon icon="plus" size="xs" />
          </Term>
        </FreetextSuggestions>

        <FreetextSuggestions
          v-slot="{ item }"
          heading="Barnämnesord:"
          :items="suggestions.barn"
          @select="addTerm"
        >
          <Term :data="item" class="cursor-pointer">
            {{ item._label }}
            <icon icon="plus" size="xs" />
          </Term>
        </FreetextSuggestions>
      </div>
    </div>
  </div>
</template>

<style></style>
