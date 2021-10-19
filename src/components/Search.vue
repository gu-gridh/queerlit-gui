<template>
  <div class="bg-pink-600 text-white pb-8">
    <div class="container max-w-screen-md">
      <div class="flex">
        <div class="border rounded text-xl flex-1 bg-white text-black">
          <input
            type="search"
            v-model="text"
            @keyup="textEdit"
            class="w-full p-4"
          />
          <div class="relative h-0">
            <div
              v-if="termSuggestions.length"
              class="absolute top-0 bg-white p-2 px-4 shadow rounded-b"
            >
              <div class="opacity-75 text-sm mb-2">Sök på ämnesord:</div>
              <Term
                v-for="term in termSuggestions"
                :key="term"
                class="mr-2"
                @click="addTerm(term)"
              >
                {{ term }}
              </Term>
            </div>
          </div>
          <div class="bg-yellow-50 p-2 border-dashed border-t-2">
            <Term
              v-for="term in terms"
              :key="term"
              class="mr-2"
              @click="removeTerm(term)"
            >
              {{ term }}
            </Term>
          </div>
        </div>
        <input
          type="submit"
          value="Sök"
          class="ml-2 rounded text-xl p-4 bg-pink-900 cursor-pointer"
          @click="search"
        />
      </div>
      <div class="my-2">
        <span class="flex items-center">
          ☝️
          <span class="flex-1"
            >Byt ut fritext "androgyni" mot ämnesord
            <Term class="text-sm">androgyni</Term>?
            <span class="px-2 py-1 mr-1 bg-pink-900 rounded">Ja</span>
            <span class="px-2 py-1 mr-1 bg-pink-900 rounded">×</span>
          </span>
        </span>
      </div>
      <div class="my-2">
        <span class="flex items-center">
          ☝️
          <span class="flex-1"
            >Ämnesordet <Term class="text-sm">lesbisk</Term> används istället
            för "flator".
            <span class="px-2 py-1 mr-1 bg-pink-900 rounded">Varför?</span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import Term from "./Term.vue";

const emit = defineEmits(["search"]);

const text = ref("androgyni");
const terms = ref(["lesbiska"]);
const termSuggestions = ref([]);

function textEdit() {
  suggestTerms();
}

function suggestTerms() {
  const lastWord = text.value.split(" ").pop();
  termSuggestions.value = matchTerms(lastWord);
}

function matchTerms(input) {
  const terms = [
    "androgyni",
    "kvinnor",
    "lesbiska",
    "lesbiska föräldrar",
    "bögar",
  ];
  return input ? terms.filter((term) => term.indexOf(input) === 0) : [];
}

function addTerm(term) {
  terms.value.push(term);
  text.value = text.value.split(" ").slice(0, -1).join(" ");
  suggestTerms();
}

function removeTerm(term) {
  terms.value.splice(terms.value.indexOf(term), 1);
}

function search(event) {
  emit("search", text.value);
}
</script>
