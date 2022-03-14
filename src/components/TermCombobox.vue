<template>
  <div v-click-outside="blur">
    <div class="border rounded bg-yellow-50 p-2 pb-0 flex">
      <div class="flex-1 flex flex-wrap">
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
          v-model="input"
          type="search"
          :placeholder="
            terms.length ? 'sök fler ämnesord...' : 'sök ämnesord...'
          "
          class="bg-transparent pl-1 mb-2 border border-transparent flex-1"
          @keyup="suggest"
          @keydown.backspace="removeLast"
        />
      </div>
      <div
        class="
          border-l-2 border-yellow-100
          -m-2
          mb-0
          ml-1
          p-3
          flex
          items-center
        "
      >
        <icon icon="stream" />
      </div>
    </div>
    <div v-show="suggestions.length" class="h-0 relative">
      <div class="shadow bg-white rounded-b pt-2">
        <div
          v-for="{ term, altMatch } in suggestions"
          :key="term.id"
          class="px-2 pb-2 flex items-baseline"
        >
          <span
            v-if="altMatch"
            class="mr-1 line-through opacity-75"
            @click="add(term)"
          >
            {{ altMatch }}
          </span>
          <Term @click="add(term)">
            {{ term.prefLabel }}
            <icon icon="plus" size="xs" />
          </Term>
          <div class="flex-1"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { directive as vClickOutside } from "click-outside-vue3";
import useQuery from "@/composables/query";
import useTerms from "@/composables/terms";
import Term from "@/components/Term.vue";

const { terms } = useQuery();
const { autocomplete, add: termsAdd, remove: termsRemove } = useTerms();
const emit = defineEmits(["change"]);
const input = ref("");
const suggestions = ref([]);

async function suggest() {
  if (input.value) {
    setSuggestions(await autocomplete(input.value));
  } else {
    setSuggestions([]);
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

function removeLast() {
  if (input.value) return;
  const lastTerm = terms.value[terms.value.length - 1];
  if (lastTerm) remove(lastTerm);
}

function setSuggestions(matches) {
  suggestions.value = matches || [];
}

function emitChange() {
  emit("change", terms.value);
}

function blur() {
  setSuggestions([]);
}
</script>

<style></style>
