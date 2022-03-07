<template>
  <article v-if="term" class="container py-10">
    <div class="bg-yellow-50 border border-yellow-200 p-4 mb-4">
      <h2 class="text-2xl">{{ term.prefLabel }}</h2>
      <table class="mt-4">
        <tr v-if="term.scopeNote">
          <th>Anvisning</th>
          <td>{{ term.scopeNote }}</td>
        </tr>
        <tr v-if="term.altLabel && term.altLabel.length">
          <th>Alternativa former</th>
          <td>{{ term.altLabel.join(", ") }}</td>
        </tr>
        <tr>
          <th>URI</th>
          <td>https://queerlit.dh.gu.se/qlit/0.2/{{ term.id }}</td>
        </tr>
      </table>
    </div>
    <div class="flex flex-wrap -m-4">
      <div class="w-1/2 p-4">
        <Labeled label="Övergripande termer">
          <router-link
            v-for="term in parents"
            :key="term.id"
            v-slot="{ navigate }"
            :to="`/ao/${term.id}`"
            custom
          >
            <Term class="mr-1 mb-1 cursor-pointer" @click="navigate">
              {{ term.prefLabel }}
            </Term>
          </router-link>
        </Labeled>
      </div>
      <div class="w-1/2 p-4">
        <Labeled label="Underordnade termer"
          ><router-link
            v-for="term in children"
            :key="term.id"
            v-slot="{ navigate }"
            :to="`/ao/${term.id}`"
            custom
          >
            <Term class="mr-1 mb-1 cursor-pointer" @click="navigate">
              {{ term.prefLabel }}
            </Term>
          </router-link>
        </Labeled>
      </div>
    </div>

    <div class="lg:w-1/2 flex-1">
      <Labeled label="Relaterade" class="my-4">
        <router-link
          v-for="term in related"
          :key="term.id"
          v-slot="{ navigate }"
          :to="`/ao/${term.id}`"
          custom
        >
          <Term class="mr-1 mb-1 cursor-pointer" @click="navigate">
            {{ term.prefLabel }}
          </Term>
        </router-link>
      </Labeled>
    </div>
  </article>
</template>

<script setup>
import { ref, watch, watchEffect } from "vue";
import Term from "@/components/Term.vue";
import Labeled from "@/components/Labeled.vue";
import useTerms from "@/composables/terms";
import { useRoute } from "vue-router";

const route = useRoute();
const { getParents, getChildren, getRelated, getTerm } = useTerms();

const term = ref(null);
const parents = ref([]);
const children = ref([]);
const related = ref([]);

watchEffect(async () => (term.value = await getTerm(route.params.id)));
watch(term, () => {
  getParents(term.value).then(
    (terms) => (parents.value = terms.map(({ term }) => term))
  );
  getChildren(term.value).then(
    (terms) => (children.value = terms.map(({ term }) => term))
  );
  getRelated(term.value).then(
    (terms) => (related.value = terms.map(({ term }) => term))
  );
});
</script>

<style lang="scss" scoped>
th {
  @apply font-bold pr-4;
}

th,
td {
  @apply text-left align-top py-2;
}
</style>
