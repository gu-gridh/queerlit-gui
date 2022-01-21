<template>
  <div class="border rounded bg-yellow-50 p-2">
    <div class="-mb-2 flex flex-wrap">
      <Term
        v-for="term in terms"
        :key="term.id"
        class="mr-2 mb-2"
        @click="remove(term)"
      >
        {{ term.label }}
      </Term>
      <input
        type="search"
        v-model="input"
        :placeholder="terms.length ? 'sök fler ämnesord...' : 'sök ämnesord...'"
        @keyup="suggest"
        @keyup.backspace="removeLast"
        class="bg-transparent py-1 mb-2 border border-transparent flex-1"
      />
    </div>
  </div>
  <div v-show="suggestions.length" class="h-0 relative">
    <div class="shadow bg-white pt-2">
      <div
        v-for="term in suggestions"
        :key="term.id"
        @click="add(term)"
        class="px-2 pb-2"
      >
        <Term>{{ term.label }}</Term>
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
const { autocomplete } = useTerms();
const emit = defineEmits(["change"]);
const input = ref("");
const suggestions = ref([]);

function suggest(event) {
  suggestions.value = autocomplete(input.value);
}

function add(term) {
  terms.value.push(term);
  input.value = "";
  suggestions.value = "";
  emitChange();
}

function remove(term) {
  terms.value.splice(terms.value.indexOf(term), 1);
  emitChange();
}

function removeLast() {
  if (terms.value.length) remove(terms.value[-1]);
}

function emitChange() {
  emit("change", terms.value);
}
</script>

<style></style>
