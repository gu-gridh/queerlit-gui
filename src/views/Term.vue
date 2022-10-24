<template>
  <div class="p-6">
    <router-link to="/">
      <icon icon="arrow-left" size="xs" class="mr-1" />
      Tillbaka till ämnen
    </router-link>
  </div>
  <article v-if="term" class="container">
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
          <th>Identifierare</th>
          <td>
            <div class="break-all">{{ term.uri }}</div>
            <div class="text-sm">
              <icon icon="info-circle" size="xs" />
              Identifieraren har formen av en URL, men används inte främst som
              en webbadress. Formen är mest ett sätt att precisera att
              definitionen är en del av Queerlits tesaurus.
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="flex flex-wrap -m-4">
      <div class="w-1/2 p-4">
        <Labeled label="Bredare">
          <ul class="py-1">
            <li v-for="term in parents" :key="term.name" class="my-1">
              <router-link v-slot="{ navigate }" :to="`/${term.name}`" custom>
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
            <li v-for="term in children" :key="term.name" class="my-1">
              <router-link v-slot="{ navigate }" :to="`/${term.name}`" custom>
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
          <div class="py-1">
            <router-link
              v-for="term in related"
              :key="term.name"
              v-slot="{ navigate }"
              :to="`/${term.name}`"
              custom
            >
              <Term class="mr-1 my-1 cursor-pointer" @click="navigate">
                {{ term.prefLabel }}
              </Term>
            </router-link>
          </div>
        </Labeled>
      </div>

      <div class="p-4 flex-1">
        <Labeled label="Motsvarar">
          <ExternalTermList :terms="term.exactMatch" />
        </Labeled>
      </div>

      <div class="p-4 flex-1">
        <Labeled label="Motsvarar ungefär">
          <ExternalTermList :terms="term.closeMatch" />
        </Labeled>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
import useTitle from "./title.composable";
import use404 from "./404.composable";
import Term from "@/terms/Term.vue";
import Labeled from "@/components/Labeled.vue";
import useTerms from "@/terms/terms.composable";
import { useRoute } from "vue-router";
import ExternalTermList from "@/terms/ExternalTermList.vue";

const route = useRoute();
const { getParents, getChildren, getRelated, getTerm } = useTerms();
const { flag404 } = use404();

const term = ref(null);
const parents = ref([]);
const children = ref([]);
const related = ref([]);
useTitle(computed(() => term.value && term.value.prefLabel));

// Get term data instantly and if the term name parameter changes.
watchEffect(async () => {
  if (route.name != "Term") return;
  term.value = await getTerm(route.params.id).catch(flag404);
  parents.value = [];
  children.value = [];
  related.value = [];
  if (term.value.broader.length)
    getParents(term.value.name).then((terms) => (parents.value = terms));
  if (term.value.narrower.length)
    getChildren(term.value.name).then((terms) => (children.value = terms));
  if (term.value.related.length)
    getRelated(term.value.name).then((terms) => (related.value = terms));
});
</script>

<style lang="scss" scoped>
th,
td {
  @apply py-2 text-left align-baseline;
}

th {
  @apply font-bold pr-4;
}
</style>
