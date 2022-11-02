<script setup>
import { ref } from "vue";
import { getCollections } from "@/services/terms.service";
import Term from "./Term.vue";

const collections = getCollections();
const selected = ref(null);
</script>

<template>
  <div
    v-if="!selected"
    class="my-2 flex flex-wrap justify-center -mx-1 text-center"
  >
    <div v-for="collection in collections" class="w-1/2 sm:w-1/3 p-1">
      <div
        class="
          p-2
          px-4
          bg-yellow-300
          shadow
          rounded-lg
          h-full
          flex
          justify-center
          items-center
          cursor-pointer
        "
        @click="selected = collection"
      >
        {{ collection.label }}
      </div>
    </div>
  </div>
  <div v-else class="my-2 mt-6 relative">
    <div
      class="absolute z-10 left-10 right-10 -top-4 cursor-pointer"
      @click="selected = null"
    >
      <div
        class="
          p-1
          px-2
          bg-yellow-300
          shadow
          rounded-md
          flex
          justify-between
          items-center
        "
      >
        <span>{{ selected.label }}</span>
        <icon icon="times" />
      </div>
    </div>
    <div class="bg-smoke-100 shadow-inner rounded h-52 overflow-auto pt-6">
      <div v-for="term in selected.terms" class="block p-1">
        <Term>{{ term }}</Term>
      </div>
    </div>
  </div>
</template>

<style></style>
