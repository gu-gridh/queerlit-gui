<script setup>
import { ref, watchEffect } from "vue";
import { getCollection, getCollections } from "@/services/terms.service";
import TermTreeSmall from "./TermTreeSmall.vue";

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
  <div class="relative my-2 flex flex-wrap justify-center -mx-1 text-center">
    <div
      v-for="collection in collections"
      :key="collection['@id']"
      class="w-1/2 sm:w-1/3 p-1"
      :class="{ invisible: selected }"
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
    <div
      v-if="selected"
      class="absolute top-0 left-0 right-0 bottom-0 z-10 m-1 text-left"
    >
      <div class="bg-yellow-200 shadow rounded-lg h-full overflow-auto">
        <div
          class="p-1 px-2 flex gap-2 items-center cursor-pointer"
          @click="selected = null"
        >
          <icon icon="arrow-left" size="xs" />
          <span>{{ selected._label }}</span>
        </div>
        <TermTreeSmall v-for="term in terms" :key="term.name" :parent="term" />
      </div>
    </div>
  </div>
</template>

<style></style>
