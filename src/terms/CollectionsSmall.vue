<script setup lang="ts">
import { ref, watchEffect } from "vue";
import type { QlitCollection, QlitTerm } from "@/services/qlit.types";
import { urlBasename } from "@/util";
import { getCollection, getCollections } from "@/services/terms.service";
import TermTreeSmall from "./TermTreeSmall.vue";
import CollectionsGrid from "./CollectionsGrid.vue";

const collections = ref<QlitCollection[]>();
const selected = ref<QlitCollection>();
const terms = ref<QlitTerm[]>();

watchEffect(async () => (collections.value = await getCollections()));

watchEffect(async () => {
  terms.value = undefined;
  if (selected.value) {
    const name = urlBasename(selected.value.id);
    terms.value = await getCollection(name);
  }
});
</script>

<template>
  <nav class="relative my-2">
    <CollectionsGrid @select="(collection) => (selected = collection)" />
    <div
      v-if="selected"
      class="absolute top-1 left-0 right-0 bottom-1 z-10 text-left"
    >
      <div
        class="bg-amber-200 dark:bg-yellow-900 shadow rounded-lg h-full overflow-auto"
      >
        <header
          class="p-1 px-2 flex gap-2 items-center cursor-pointer"
          @click="selected = undefined"
        >
          <icon icon="arrow-left" size="xs" />
          <h5>{{ selected.label }}</h5>
        </header>
        <TermTreeSmall v-for="term in terms" :key="term.id" :parent="term" />
      </div>
    </div>
  </nav>
</template>

<style></style>
