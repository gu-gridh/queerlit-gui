<template>
  <article v-if="term" class="container py-10">
    <div class="bg-yellow-50 border border-yellow-200 p-4 mb-4">
      <h2 class="text-2xl">{{ term.prefLabel }}</h2>
      <table class="mt-4">
        <tr v-if="term.scopeNote">
          <th>Anvisning</th>
          <td>{{ term.scopeNote }}</td>
        </tr>
        <tr v-if="term.altLabels && term.altLabels.length">
          <th>Varianter</th>
          <td>
            <div v-for="altLabel in term.altLabels" :key="altLabel">
              {{ altLabel }}
            </div>
          </td>
        </tr>
        <tr>
          <th class="pb-0">Identifierare</th>
          <td class="pb-0">{{ term.uri }}</td>
        </tr>
        <tr class="text-sm text-black-700">
          <td />
          <td class="pt-0">
            <icon icon="info-circle" size="xs" />
            Identifieraren har formen av en URL, men används inte främst som en
            webbadress. Formen är mest ett sätt att precisera att definitionen
            är en del av Queerlits tesaurus.
          </td>
        </tr>
      </table>
    </div>
    <div class="flex flex-wrap -m-4">
      <div class="w-1/2 p-4">
        <Labeled label="Övergripande">
          <ul>
            <li v-for="term in parents" :key="term.name">
              <router-link
                v-slot="{ navigate }"
                :to="`/ao/${term.name}`"
                custom
              >
                <Term class="mr-1 mb-1 cursor-pointer" @click="navigate">
                  {{ term.prefLabel }}
                </Term>
              </router-link>
            </li>
          </ul>
        </Labeled>
      </div>
      <div class="w-1/2 p-4">
        <Labeled label="Underordnade">
          <ul>
            <li v-for="term in children" :key="term.name">
              <router-link
                v-slot="{ navigate }"
                :to="`/ao/${term.name}`"
                custom
              >
                <Term class="mr-1 mb-1 cursor-pointer" @click="navigate">
                  {{ term.prefLabel }}
                </Term>
              </router-link>
            </li>
          </ul>
        </Labeled>
      </div>

      <div class="w-full p-4">
        <Labeled label="Relaterade">
          <router-link
            v-for="term in related"
            :key="term.name"
            v-slot="{ navigate }"
            :to="`/ao/${term.name}`"
            custom
          >
            <Term class="mr-1 mb-1 cursor-pointer" @click="navigate">
              {{ term.prefLabel }}
            </Term>
          </router-link>
        </Labeled>
      </div>

      <div class="p-4 flex-1">
        <Labeled label="Motsvarar">
          <UriList :uris="term.exactMatch" />
        </Labeled>
      </div>

      <div class="p-4 flex-1">
        <Labeled label="Motsvarar ungefär">
          <UriList :uris="term.closeMatch" />
        </Labeled>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, watch, watchEffect } from "vue";
import Term from "@/components/Term.vue";
import Labeled from "@/components/Labeled.vue";
import useTerms from "@/composables/terms";
import { useRoute } from "vue-router";
import UriList from "@/components/UriList.vue";

const route = useRoute();
const { getParents, getChildren, getRelated, getTerm } = useTerms();

const term = ref(null);
const parents = ref([]);
const children = ref([]);
const related = ref([]);

watchEffect(async () => (term.value = await getTerm(route.params.id)));
watch(term, () => {
  getParents(term.value.name).then((terms) => (parents.value = terms));
  getChildren(term.value.name).then((terms) => (children.value = terms));
  getRelated(term.value.name).then((terms) => (related.value = terms));
});
</script>

<style lang="scss" scoped>
th {
  @apply font-bold pr-4;
}

th:not(.pb-0):not(.pt-0),
td:not(.pb-0):not(.pt-0) {
  @apply text-left align-top py-2;
}
</style>
