<template>
  <div v-on-click-outside="blur">
    <div
      class="p-2 flex rounded-t shadow-inner"
      :class="{
        'rounded-b': !suggestions.length,
        incomplete: input,
        'bg-smoke-200 hover:bg-smoke-300': !terms.length,
        'bg-yellow-100': terms.length,
      }"
    >
      <div class="flex-1 flex flex-wrap items-baseline gap-1">
        <Term
          v-for="term in terms"
          :key="term.id"
          class="term-added text-md cursor-pointer"
          :data="term"
          :options="['goto']"
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
            border border-transparent
            w-36
            flex-1
            transition-colors
            text-xl
            leading-none
          "
          @input="suggest"
          @keydown.backspace="removeLast"
          @focus="suggest"
        />
      </div>
    </div>
    <div v-show="suggestions.length" class="h-0 relative z-20">
      <CloseButton @click="setSuggestions([])" />
      <div class="bg-smoke-200 rounded-b pt-2">
        <div
          v-for="term in suggestions"
          :key="term.id"
          class="px-2 pb-2 flex items-baseline"
        >
          <Term
            :data="term"
            :options="['goto']"
            class="cursor-pointer"
            @click="add(term)"
          >
            {{ term._label }}
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
import { vOnClickOutside } from "@vueuse/components";
import useQuery from "@/search/query.composable";
import useTerms from "@/terms/terms.composable";
import Term from "@/terms/Term.vue";
import { searchConceptQlit } from "@/services/libris.service";
import CloseButton from "@/components/CloseButton.vue";

const { terms } = useQuery();
const { add: termsAdd, remove: termsRemove } = useTerms();
const emit = defineEmits(["change"]);
const input = ref("");
const suggestions = ref([]);

async function suggest() {
  if (input.value) {
    const inputFixed = input.value;
    const suggestions = await searchConceptQlit(inputFixed);
    // Update suggestion list only if the input hasn't already been changed again.
    if (inputFixed == input.value) setSuggestions(suggestions);
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

.incomplete:not(:focus-within) {
  @apply bg-red-100;
}

.term-added:last-of-type {
  @apply mr-0;
}
</style>
