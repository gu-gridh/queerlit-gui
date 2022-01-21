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
        @focus="suggest"
        @keyup="suggest"
        @keyup.backspace="removeLast"
        class="bg-transparent py-1 mb-2 border border-transparent flex-1"
      />
    </div>
  </div>
  <div v-show="suggestions.length" class="h-0 relative">
    <div class="shadow bg-white rounded-b pt-2">
      <div v-for="term in suggestions" :key="term.id" class="px-2 pb-2 flex">
        <Term @click="add(term)">{{ term.label }}</Term>
        <div class="flex-1"></div>
        <div v-if="hasChildren(term)" @click="drilldown(term)" class="p-1">
          ᛦ
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

function suggest() {
  if (input.value) suggestions.value = autocomplete(input.value);
  else suggestions.value = getRoots();
}

function add(term) {
  termsAdd(term);
  input.value = "";
  suggestions.value = "";
  emitChange();
}

function remove(term) {
  termsRemove(term);
  emitChange();
}

function removeLast() {
  if (terms.value.length) remove(terms.value[-1]);
}

function drilldown(term) {
  const children = getChildren(term);
  suggestions.value = [];
  setTimeout(() => (suggestions.value = children), 100);
}

function emitChange() {
  emit("change", terms.value);
}
</script>

<style></style>
