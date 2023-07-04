<template>
  <div class="bg-white rounded-xl shadow-lg">
    <div class="p-4 md:p-8 q-body">
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
        är den största internationella tesaurusen för HBTQ.
      </p>
    </div>

    <div class="py-4 px-6 border-t border-dashed border-gray-500">
      <Labeled label="Sök ämnesord">
        <input
          v-model="termTextQuery"
          type="search"
          class="w-full p-4 pb-3 rounded text-black shadow-inner leading-snug transition-colors text-xl"
          :class="[
            termTextQuery ? 'bg-blue-100' : 'bg-smoke-200 hover:bg-smoke-300',
          ]"
          @change="gotoThesaurus"
        />
      </Labeled>
    </div>
  </div>
</template>

<script setup>
import Labeled from "@/components/Labeled.vue";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const { state, commit } = useStore();
const router = useRouter();

const termTextQuery = computed({
  get: () => state.termTextQuery,
  set: (value) => commit("setTermTextQuery", value),
});

function gotoThesaurus() {
  router.push("/subjects");
}
</script>
