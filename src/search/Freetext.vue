<script setup>
import { vOnClickOutside } from "@vueuse/components";
import debounce from "lodash/debounce";
import { useToggle } from "@vueuse/shared";
import useQuery from "@/search/query.composable";
import useTerms from "@/terms/terms.composable";
import {
  searchConceptQlit,
  searchConceptSao,
  searchConceptBarn,
  searchGenreform,
} from "@/services/libris.service";
import useMulticomplete from "./multicomplete.composable";
import Term from "@/terms/Term.vue";
import FreetextSuggestions from "./FreetextSuggestions.vue";
import FreetextInstructions from "./FreetextInstructions.vue";
import ToggleIcon from "@/components/ToggleIcon.vue";

const emit = defineEmits(["search"]);
const { text, setQuery } = useQuery();
const terms = useTerms();

const [showSuggestions, toggleSuggestions] = useToggle();
const [showHelp, toggleHelp] = useToggle();

const Multicomplete = useMulticomplete({
  qlit: searchConceptQlit,
  sao: searchConceptSao,
  barn: searchConceptBarn,
  gf: searchGenreform,
});
// The component needs a direct reference to these reactives.
const suggestions = Multicomplete.suggestions;
const hasSuggestions = Multicomplete.hasSuggestions;

function textChange(event) {
  setQuery({ text: event.target.value });
  // Trigger autocomplete in next tick to make it use new input value.
  setTimeout(() => autocomplete());
  toggleSuggestions(true);
}

function addTerm(term) {
  terms.add(term);
  removeLastWord();
  emit("search");
}

function setGenreform(genreform) {
  setQuery({ genreform });
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
  toggleSuggestions(false);
}
</script>

<template>
  <div v-on-click-outside="blur">
    <div
      class="
        w-full
        flex
        items-center
        p-1
        bg-smoke-200
        hover:bg-smoke-300
        rounded-t
        text-text text-xl
        shadow-inner
      "
      :class="{ 'rounded-b': !(hasSuggestions && showSuggestions) }"
    >
      <input
        type="search"
        :value="text"
        placeholder="Sök här..."
        class="flex-1 bg-transparent p-3 pb-2"
        @input="textChange"
        @keyup.enter="emit('search')"
        @focus="textChange"
      />

      <ToggleIcon icon="question" :value="showHelp" :toggle="toggleHelp" />
    </div>

    <div class="relative h-0">
      <div
        v-if="hasSuggestions && showSuggestions"
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
          <Term :data="item" class="cursor-pointer">
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

        <FreetextSuggestions
          v-slot="{ item }"
          heading="Genre/form:"
          :items="suggestions.gf"
          @select="setGenreform"
        >
          <Term :data="item" class="cursor-pointer">
            {{ item.label }} ({{ item.scheme }})
            <icon icon="plus" size="xs" />
          </Term>
        </FreetextSuggestions>
      </div>
    </div>

    <FreetextInstructions v-show="showHelp" />
  </div>
</template>

<style></style>
