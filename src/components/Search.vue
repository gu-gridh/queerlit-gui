<template>
  <div class="bg-pink-600 text-white pb-8">
    <div class="container max-w-screen-md">
      <div class="flex">
        <div class="border rounded text-xl flex-1 bg-white text-black">
          <input
            type="search"
            v-model="terms"
            @keyup="search"
            class="w-full p-4"
          />
          <div class="p-2 border-dashed border-t-2">
            <Term>lesbisk</Term>
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

const terms = ref("androgyni");

function search(event) {
  emit("search", terms.value);
}
</script>
