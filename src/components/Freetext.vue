<script setup>
import { watchEffect } from "@vue/runtime-core";
import { ref } from "@vue/reactivity";
import useQuery from "@/composables/query";
import useTerms from "@/composables/terms";
import Term from "@/components/Term.vue";
import { useStore } from "vuex";

const props = defineProps([]);
const emit = defineEmits(["search"]);
const store = useStore();
const { text, setQuery } = useQuery();
const terms = useTerms();
const termSuggestions = ref([]);

function textChange(event) {
  setQuery({ text: event.target.value });
}

function addTerm(term) {
  terms.add(term);
  store.commit("setQuery", {
    // Remove last word from text.
    text: String(text.value).split(" ").slice(0, -1).join(" "),
  });
  emit("search");
}

watchEffect(() => {
  const lastWord = text.value.split(" ").pop();
  termSuggestions.value = lastWord ? terms.autocomplete(lastWord) : [];
});
</script>

<template>
  <input
    type="search"
    :value="text"
    placeholder="Sök här..."
    @keyup="textChange"
    @keyup.enter="emit('search')"
    class="w-full p-4 bg-transparent text-black"
  />
  <div class="relative h-0">
    <div
      v-if="termSuggestions.length"
      class="absolute top-0 bg-white shadow rounded-b w-full overflow-hidden"
    >
      <div class="text-sm m-2">Sök på ämnesord:</div>
      <div class="my-2 overflow-x-auto whitespace-nowrap">
        <Term
          v-for="{ term } in termSuggestions"
          :key="term.id"
          class="mx-2"
          @click="addTerm(term)"
        >
          {{ term.prefLabel }}
          <icon icon="plus" size="xs" />
        </Term>
      </div>
      <div class="text-sm m-2">Sök på ämnesord:</div>
    </div>
  </div>
</template>
