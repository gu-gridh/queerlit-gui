<template>
  <div class="border rounded bg-yellow-50 p-2" @unfocus="unfocus">
    <div class="-mb-2 flex flex-wrap">
      <Term
        v-for="term in terms"
        :key="term.id"
        class="mr-2 mb-2"
        @click="remove(term)"
      >
        {{ term.prefLabel }}
        <icon icon="times" size="xs" />
      </Term>
      <input
        type="search"
        v-model="input"
        :placeholder="terms.length ? 'sök fler ämnesord...' : 'sök ämnesord...'"
        @focus="suggest"
        @keyup="suggest"
        @keydown.backspace="removeLast"
        class="bg-transparent pl-1 mb-2 border border-transparent flex-1"
      />
    </div>
  </div>
  <div v-show="suggestions.length" class="h-0 relative">
    <div class="shadow bg-white rounded-b pt-2">
      <h3
        v-if="suggestionsHeading"
        v-html="suggestionsHeading"
        class="mb-2 px-2 text-sm"
      />
      <div
        v-for="{ term, altMatch } in suggestions"
        :key="term.id"
        class="px-2 pb-2 flex items-baseline"
      >
        <span
          v-if="altMatch"
          @click="add(term)"
          class="mr-1 line-through opacity-75"
        >
          {{ altMatch }}
        </span>
        <Term @click="add(term)">
          {{ term.prefLabel }}
          <icon icon="plus" size="xs" />
        </Term>
        <div class="flex-1"></div>
        <div v-if="hasChildren(term)" @click="drilldown(term)" class="px-1">
          <icon icon="stream" size="xs" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import useQuery from "@/composables/query";
import useTerms from "@/composables/terms";
import Term from "@/components/Term.vue";

const { terms, setQuery } = useQuery();
const {
  autocomplete,
  getRoots,
  getChildren,
  hasChildren,
  add: termsAdd,
  remove: termsRemove,
} = useTerms();
const emit = defineEmits(["change"]);
const input = ref("");
const suggestions = ref([]);
const suggestionsHeading = ref("");

async function suggest() {
  if (input.value) {
    setSuggestions(await autocomplete(input.value), "Menar du:");
  } else {
    setSuggestions(await getRoots(), "Topptermer");
  }
}

function add(term) {
  termsAdd(term);
  input.value = "";
  setSuggestions([]);
  emitChange();
}

function remove(term) {
  termsRemove(term);
  emitChange();
}

function removeLast(event) {
  if (input.value) return;
  const lastTerm = terms.value[terms.value.length - 1];
  if (lastTerm) remove(lastTerm);
}

async function drilldown(term) {
  setSuggestions(await getChildren(term), `Termer under <em>${term.prefLabel}</em>`);
}

function unfocus() {
  setSuggestions([]);
}

function setSuggestions(matches, heading) {
  suggestions.value = matches || [];
  suggestionsHeading.value = heading || "";
}

function emitChange() {
  emit("change", terms.value);
}
</script>

<style></style>
