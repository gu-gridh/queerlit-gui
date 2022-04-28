<template>
  <div v-click-outside="blur">
    <div class="tag-space p-2 pb-0 flex">
      <div class="flex-1 flex flex-wrap">
        <Term
          v-for="term in terms"
          :key="term.id"
          class="mr-2 mb-2"
          :data="term"
          @click="remove(term)"
        >
          {{ term.prefLabel }}
          <icon icon="times" size="xs" />
        </Term>
        <input
          v-model="input"
          type="search"
          :placeholder="terms.length ? 'Sök fler ämnesord...' : ' Ämnesord...'"
          class="
            tag-input
            bg-transparent
            pl-1
            mb-2
            border border-transparent
            flex-1
            transition-colors
          "
          :class="{ incomplete }"
          @input="suggest"
          @keydown.backspace="removeLast"
          @focus="suggest"
        />
      </div>
      <div class="-m-2 mb-0 ml-1 p-3 flex items-center">
        <icon icon="stream" />
      </div>
    </div>
    <div v-show="suggestions.length" class="h-0 relative z-20">
      <div class="top-sort bg-greengrey rounded-b pt-2">
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
import { computed, ref } from "@vue/reactivity";
import { directive as vClickOutside } from "click-outside-vue3";
import useQuery from "@/composables/query";
import useTerms from "@/composables/terms";
import Term from "@/components/Term.vue";

const { terms } = useQuery();
const { autocomplete, add: termsAdd, remove: termsRemove } = useTerms();
const emit = defineEmits(["change"]);
const input = ref("");
const suggestions = ref([]);

const incomplete = computed(() => input.value);

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

<style scoped>
.tag-space {
  margin-top: -24px;
  background-color: #e7ebe9 !important;
  border-radius: 0px 0px 5px 5px !important;
  border-color: grey;
  border-width: 0.5px 0 0 0;
  border-style: dashed;
}

.tag-space:hover {
  background-color: #dfe5e2 !important;
}

.incomplete:not(:focus) {
  @apply text-red-800;
}
</style>
