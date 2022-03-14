<script setup>
import { watchEffect } from "@vue/runtime-core";
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import useQuery from "@/composables/query";
import useTerms from "@/composables/terms";
import { searchPerson } from "@/services/libris";
import Term from "@/components/Term.vue";
import Dragscroll from "./Dragscroll.vue";

const emit = defineEmits(["search"]);
const store = useStore();
const { text, setQuery } = useQuery();
const terms = useTerms();
const termSuggestions = ref([]);
const authorSuggestions = ref([]);

const showSuggestions = computed(() =>
  [termSuggestions.value, authorSuggestions.value].some(
    (list) => list.length > 0
  )
);

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

watchEffect(async () => {
  const lastWord = text.value.split(" ").pop();

  if (lastWord) {
    terms
      .autocomplete(lastWord)
      .then((terms) => (termSuggestions.value = terms));
    searchPerson(lastWord).then(
      (persons) => (authorSuggestions.value = persons)
    );
  } else {
    termSuggestions.value = [];
    authorSuggestions.value = [];
  }
});
</script>

<template>
  <input
    type="search"
    :value="text"
    placeholder="Sök här..."
    class="w-full p-4 bg-transparent text-black"
    @keyup="textChange"
    @keyup.enter="emit('search')"
  />
  <div class="relative h-0">
    <div
      v-if="showSuggestions"
      class="absolute top-0 bg-white shadow rounded-b w-full overflow-hidden"
    >
      <div v-if="termSuggestions.length" class="my-2">
        <div class="text-sm mx-2">Sök på ämnesord:</div>
        <Dragscroll class="overflow-hidden whitespace-nowrap">
          <Term
            v-for="{ term } in termSuggestions"
            :key="term.id"
            class="mx-2"
            @click="addTerm(term)"
          >
            {{ term.prefLabel }}
            <icon icon="plus" size="xs" />
          </Term>
        </Dragscroll>
      </div>

      <div v-if="authorSuggestions.length" class="my-2">
        <div class="text-sm mx-2">Sök på författare:</div>
        <Dragscroll class="overflow-hidden whitespace-nowrap">
          <span
            v-for="item in authorSuggestions"
            :key="item.id"
            class="mx-2"
            @click="addAuthor(item)"
          >
            {{ item.firstname }} {{ item.lastname }}
          </span>
        </Dragscroll>
      </div>
    </div>
  </div>
</template>
