<script setup>
import { ref, watchEffect } from "vue";
import { getCollection, getCollections } from "@/services/terms.service";
import Term from "./Term.vue";

const collections = ref();
const selected = ref(null);
const terms = ref();

watchEffect(async () => (collections.value = await getCollections()));

watchEffect(async () => {
  terms.value = null;
  if (selected.value) {
    terms.value = await getCollection(selected.value.name);
  }
});
</script>

<template>
  <div
    v-if="!selected"
    class="my-2 flex flex-wrap justify-center -mx-1 text-center"
  >
    <div
      v-for="collection in collections"
      :key="collection['@id']"
      class="w-1/2 sm:w-1/3 p-1"
    >
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
        {{ collection._label }}
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
        <span>{{ selected._label }}</span>
        <icon icon="times" />
      </div>
    </div>
    <div class="bg-smoke-100 shadow-inner rounded h-52 overflow-auto pt-6">
      <div v-for="term in terms" class="block p-1">
        <Term :data="term" :options="['search', 'goto']" />
      </div>
    </div>
  </div>
</template>

<style></style>
