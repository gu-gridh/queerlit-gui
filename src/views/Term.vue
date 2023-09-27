<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import useTitle from "./title.composable";
import use404 from "./404.composable";
import Term from "@/terms/Term.vue";
import Labeled from "@/components/Labeled.vue";
import useTerms from "@/terms/terms.composable";
import { useRoute } from "vue-router";
import ExternalTermList from "@/terms/ExternalTermList.vue";
import QButton from "@/components/QButton.vue";
import type { QlitTerm } from "@/services/qlit.types";
import useHistory from "./history.composable";

const route = useRoute();
const { getParents, getChildren, getRelated, getTerm, searchByTerm } =
  useTerms();
const { flag404 } = use404();
const { prev } = useHistory();

const term = ref<QlitTerm>();
const parents = ref<QlitTerm[]>([]);
const children = ref<QlitTerm[]>([]);
const related = ref<QlitTerm[]>([]);
useTitle(computed(() => term.value && term.value.label));

// Get term data instantly and if the term name parameter changes.
watchEffect(async () => {
  if (route.name != "Term") return;
  const termValue = await getTerm(route.params.id as string).catch(flag404);
  if (!termValue) return;
  term.value = termValue;
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
  <div class="p-6">
    <router-link v-if="prev" :to="prev">
      <icon icon="arrow-left" size="xs" class="mr-1" />
      Gå tillbaka
    </router-link>
    <router-link v-else to="/subjects">
      <icon icon="arrow-left" size="xs" class="mr-1" />
      Tillbaka till ämnen
    </router-link>
  </div>

  <article v-if="term" class="container">
    <div class="bg-amber-50 border border-amber-200 p-4 mb-2">
      <h2 class="text-2xl">{{ term.label }}</h2>
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
        <QButton @click="searchByTerm(term)">
          <icon icon="search" size="xs" class="mr-1" />
          Sök i Queerlit på <em>{{ term.label }}</em>
        </QButton>
      </div>
    </div>

    <div class="flex flex-wrap my-4 gap-4">
      <div class="flex-1">
        <Labeled label="Bredare">
          <ul class="my-1 flex flex-col gap-2">
            <li v-for="term in parents" :key="term.name">
              <router-link :to="`/subjects/${term.name}`">
                <Term :data="term" />
              </router-link>
            </li>
          </ul>
        </Labeled>
      </div>

      <div class="flex-1">
        <Labeled label="Underordnade">
          <ul class="my-1 flex flex-col gap-2">
            <li v-for="term in children" :key="term.name">
              <router-link :to="`/subjects/${term.name}`">
                <Term :data="term" />
              </router-link>
            </li>
          </ul>
        </Labeled>
      </div>

      <div class="w-full">
        <Labeled label="Relaterade">
          <ul class="my-1 flex flex-wrap gap-2">
            <li v-for="term in related" :key="term.name">
              <router-link :to="`/subjects/${term.name}`">
                <Term :data="term" />
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
  </article>
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
