<template>
  <div v-click-outside="blur">
    <div
      class="
        bg-smoke-200
        hover:bg-smoke-300
        p-2
        pl-4
        pb-0
        flex
        border-t border-dashed border-gray-500
      "
      :class="{ 'rounded-b': !suggestions.length }"
    >
      <div class="flex-1 flex flex-wrap">
        <Term
          v-for="term in terms"
          :key="term.id"
          class="mr-2 mb-2 text-md cursor-pointer"
          :data="term"
          @click="remove(term)"
        >
          {{ term.prefLabel }}
          <icon icon="times" size="xs" />
        </Term>
        <input
          v-model="input"
          type="search"
          :placeholder="terms.length ? 'Sök fler ämnesord...' : 'Ämnesord...'"
          class="
            bg-transparent
            mb-2
            border border-transparent
            w-36
            flex-1
            transition-colors
            text-xl
          "
          :class="{ incomplete: input }"
          @input="suggest"
          @keydown.backspace="removeLast"
          @focus="suggest"
        />
      </div>
      <div class="-m-2 mb-0 ml-1 p-3 flex items-center">
        <icon icon="stream" size="xs" />
      </div>
    </div>
    <div v-show="suggestions.length" class="h-0 relative z-20">
      <div class="bg-smoke-200 rounded-b pt-2">
        <div
          v-for="term in suggestions"
          :key="term.id"
          class="px-2 pb-2 flex items-baseline"
        >
          <Term :data="term" class="cursor-pointer" @click="add(term)">
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
import { searchConceptQlit } from "@/services/libris.service";

const { terms } = useQuery();
const { add: termsAdd, remove: termsRemove } = useTerms();
const emit = defineEmits(["change"]);
const input = ref("");
const suggestions = ref([]);

async function suggest() {
  if (input.value) {
    setSuggestions(await searchConceptQlit(input.value));
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

<style scoped>
::placeholder {
  font-size: 20px;
}

.incomplete:not(:focus) {
  @apply text-red-800;
}
</style>
