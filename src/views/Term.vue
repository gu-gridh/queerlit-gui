<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import use404 from "./404.composable";
import Term from "@/terms/Term.vue";
import Labeled from "@/components/Labeled.vue";
import useTerms from "@/terms/terms.composable";
import ExternalTermList from "@/terms/ExternalTermList.vue";
import QButton from "@/components/QButton.vue";
import type { QlitTerm } from "@/services/qlit.types";
import useHistory from "./history.composable";
import OptionsButton from "@/components/OptionsButton.vue";
import { useCanonicalPath } from "@/canonicalPath.composable";
import { useRouteInfo } from "./routeInfo.composable";

const route = useRoute();
const {
  getParents,
  getChildren,
  getRelated,
  getTerm,
  searchByTerm,
  searchByTermSecondary,
} = useTerms();
const { flag404 } = use404();
const { prev } = useHistory();
const { getTermPath } = useCanonicalPath();
const { setRouteInfo } = useRouteInfo();

const term = ref<QlitTerm>();
const parents = ref<QlitTerm[]>([]);
const children = ref<QlitTerm[]>([]);
const related = ref<QlitTerm[]>([]);

// Get term data instantly and if the term name parameter changes.
watchEffect(async () => {
  if (route.name != "Term") return;
  const termValue = await getTerm(route.params.id as string).catch(flag404);
  term.value = termValue || undefined;
});

// Once term data is loaded, do related stuff.
watch(term, () => {
  if (!term.value) return;

  setRouteInfo({
    title: term.value.label,
    path: getTermPath(term.value),
    description: term.value.scopeNote,
  });

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

<template>
  <nav class="container py-6">
    <router-link v-if="prev" :to="prev">
      <icon icon="arrow-left" size="xs" class="mr-1" />
      Gå tillbaka
    </router-link>
    <router-link v-else to="/subjects">
      <icon icon="arrow-left" size="xs" class="mr-1" />
      Tillbaka till ämnen
    </router-link>
  </nav>

  <main v-if="term" class="container">
    <div
      class="bg-amber-50 dark:bg-gray-800 border border-amber-200 dark:border-0 p-4 mb-2"
    >
      <h1 class="text-2xl">{{ term.label }}</h1>
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
            <div class="break-all">{{ term.id }}</div>
            <div class="text-sm">
              <icon icon="info-circle" size="xs" />
              Identifieraren har formen av en URL, men används inte främst som
              en webbadress. Formen är mest ett sätt att precisera att
              definitionen är en del av Queerlits tesaurus.
            </div>
          </td>
        </tr>
      </table>

      <div class="mt-2 text-center">
        <OptionsButton class="text-left">
          <QButton class="cursor-context-menu">
            Sök i Queerlit på <em>{{ term.label }}</em>
            <icon icon="ellipsis-v" size="xs" class="ml-2 mb-0.25" />
          </QButton>
          <template #menu>
            <div class="w-40"></div>
            <ul class="bg-gray-50/95 dark:bg-gray-600/95 rounded shadow mt-0.5">
              <li
                class="overflow-hidden text-ellipsis whitespace-nowrap px-1 hover:bg-gray-100 dark:hover:bg-gray-500 dark:text-stone-200 cursor-pointer"
                @click="searchByTerm(term)"
              >
                Sök som centralt ämnesord
              </li>
              <li
                class="overflow-hidden text-ellipsis whitespace-nowrap px-1 hover:bg-gray-100 dark:hover:bg-gray-500 dark:text-stone-200 cursor-pointer"
                @click="searchByTermSecondary(term)"
              >
                Sök som perifert ämnesord
              </li>
            </ul>
          </template>
        </OptionsButton>
      </div>
    </div>

    <div class="flex flex-wrap my-4 gap-4">
      <div class="flex-1">
        <Labeled label="Bredare">
          <ul class="my-1 flex flex-col gap-2">
            <li v-for="broaderTerm in parents" :key="broaderTerm.name">
              <router-link :to="getTermPath(broaderTerm)">
                <Term :data="broaderTerm" />
              </router-link>
            </li>
          </ul>
        </Labeled>
      </div>

      <div class="flex-1">
        <Labeled label="Smalare">
          <ul class="my-1 flex flex-col gap-2">
            <li v-for="narrowerTerm in children" :key="narrowerTerm.name">
              <router-link :to="getTermPath(narrowerTerm)">
                <Term :data="narrowerTerm" />
              </router-link>
            </li>
          </ul>
        </Labeled>
      </div>

      <div class="w-full">
        <Labeled label="Relaterade">
          <ul class="my-1 flex flex-wrap gap-2">
            <li v-for="relatedTerm in related" :key="relatedTerm.name">
              <router-link :to="getTermPath(relatedTerm)">
                <Term :data="relatedTerm" />
              </router-link>
            </li>
          </ul>
        </Labeled>
      </div>

      <div class="flex-1">
        <Labeled label="Motsvarar">
          <ExternalTermList :terms="term.exactMatch" />
        </Labeled>
      </div>

      <div class="flex-1">
        <Labeled label="Motsvarar ungefär">
          <ExternalTermList :terms="term.closeMatch" />
        </Labeled>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
th,
td {
  @apply py-2 text-left align-baseline;
}

th {
  @apply font-bold pr-4;
}
</style>
