<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { QlitCollection } from "@/services/qlit.types";
import useRootStore from "@/stores/root.store";
import LabeledSection from "@/components/LabeledSection.vue";
import CollectionsGrid from "./CollectionsGrid.vue";

const store = useRootStore();
const router = useRouter();

const termTextQuery = computed({
  get: () => store.termTextQuery,
  set: (value) => store.setTermTextQuery(value),
});

function selectCollection(collection: QlitCollection) {
  if (store.termCollection?.name == collection.name) {
    store.setTermCollection(null);
  } else {
    store.setTermCollection(collection);
  }
}

function gotoThesaurus() {
  router.push("/subjects");
}
</script>

<template>
  <div
    class="bg-white dark:bg-stone-900 dark:text-stone-400 rounded-xl shadow-lg"
  >
    <section class="p-4 md:p-8 q-body">
      <h1 class="text-5xl">Ämnen</h1>
      <p>
        Till Queerlit-databasen skapas en <em>tesaurus</em>, det vill säga en
        ordlista som sorterar ämnesord. Syftet med det är att göra
        skönlitteraturen i databasen mer lättillgänglig. Genom detaljerade
        ämnesord skapas fler sökvägar än de breda ämnesord som idag finns i
        <a
          href="https://metadatabyran.kb.se/amnesord-och-genre-form/svenska-amnesord"
          >Svenska ämnesord (SAO)</a
        >, som är den ämnesordlista de flesta svenska bibliotek använder.
      </p>

      <p>
        Eftersom tesaurusen byggs upp i länkad data-format förbättras
        sökbarheten även för breda termer. Både strukturen och mängden termer
        kommer alltså att göra det enklare att söka i databasen.
      </p>

      <p>
        Utvecklingen av tesaurusen görs i samarbete med
        <a href="http://www2.ub.gu.se/kvinn/">KvinnSam</a> och
        <a href="https://www.kb.se/samverkan-och-utveckling/libris.html"
          >Libris</a
        >
        och i så stor utsträckning som möjligt kommer den länkas till SAO och
        <a href="https://homosaurus.org/">Homosaurus</a> (utvecklad av IHLIA
        LGBT Heritage i Amsterdam och Digital Transgender Archive i Boston), som
        är den största internationella tesaurusen för hbtq.
      </p>
    </section>

    <div class="py-4 px-6 border-t border-dashed border-gray-500">
      <LabeledSection label="Samlingar" class="mb-4">
        <CollectionsGrid
          :selected="store.termCollection ? [store.termCollection.name] : []"
          @select="(collection) => selectCollection(collection)"
        />
      </LabeledSection>

      <LabeledSection label="Sök ämnesord" class="mt-4">
        <input
          v-model="termTextQuery"
          type="search"
          class="w-full p-4 pb-3 rounded text-black shadow-inner leading-snug transition-colors text-xl"
          :class="[
            termTextQuery
              ? 'bg-blue-100 dark:bg-slate-600'
              : 'bg-smoke-200 hover:bg-smoke-300 dark:bg-stone-700 dark:hover:bg-stone-700',
          ]"
          @change="gotoThesaurus"
        />
      </LabeledSection>
    </div>
  </div>
</template>
