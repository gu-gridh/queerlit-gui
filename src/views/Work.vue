<template>
  <div class="p-6">
    <router-link to="/" class="flex items-center">
      <icon icon="arrow-left" size="xs" class="mr-1" />
      Tillbaka till sökning
    </router-link>
  </div>
  <div v-if="work" class="container xl:max-w-screen-xl">
    <h2 class="text-3xl">{{ work.title }}</h2>
    <div class="flex flex-wrap my-4 gap-y-2">
      <Labeled label="Författare" class="w-full sm:w-1/2 pr-4">
        {{ work.creators?.join(", ") }}
      </Labeled>
      <Labeled label="Utgivningsår" class="w-full sm:w-1/2 pr-4">
        {{ work.date }}
      </Labeled>
    </div>
    <Labeled label="Ämnesord" class="my-4 text-lg">
      <div class="my-1">
        <Term
          v-for="term in terms.qlit"
          :key="term"
          :data="term"
          class="mr-1 mb-1"
          :options="[
            {
              label: `Sök på <em>${term._label}</em>`,
              action: () => filterTerm(term),
            },
            {
              label: `Om ämnesordet <em>${term._label}</em>`,
              action: () => gotoTerm(term),
            },
          ]"
        >
        </Term>
      </div>
      <div class="text-base my-1">
        <Term
          v-for="term in terms.other"
          :key="term"
          :data="term"
          class="mr-1 mb-2"
          :options="
            term['@id'] && [
              {
                label: `Sök på <em>${term._label}</em>`,
                action: () => filterTerm(term),
              },
            ]
          "
        />
      </div>
    </Labeled>
    <Labeled v-if="work.summary" label="Beskrivning" class="my-4">
      {{ work.summary }}
    </Labeled>

    <div class="flex flex-wrap my-4 gap-y-2">
      <Labeled label="Genre/form" class="w-full sm:w-1/2 pr-4">
        <div v-for="(term, i) in work.genreform" :key="i">
          {{ term._label }}
        </div>
        <div v-if="!work.genreform.length">—</div>
      </Labeled>

      <Labeled label="Klassifikation" class="w-full sm:w-1/2 pr-4">
        <div v-for="{ type, code } in work.classification" :key="type + code">
          <template v-if="type">{{ type }}: </template>
          {{ code }}
        </div>
        <div v-if="!work.classification">—</div>
      </Labeled>

      <Labeled label="Publicering" class="w-full sm:w-1/2 pr-4">
        <div v-for="publication in work.publication" :key="publication">
          {{ publication }}
        </div>
        <div v-if="!work.publication">—</div>
      </Labeled>

      <Labeled label="Målgrupp" class="w-full sm:w-1/2 pr-4">
        <div v-for="audience in work.intendedAudience" :key="audience">
          {{ audience }}
        </div>
        <div v-if="!work.intendedAudience">—</div>
      </Labeled>
    </div>

    <Labeled label="Övrigt" class="my-4">
      <div v-if="work.extent">{{ work.extent }}</div>
      <div v-if="work.note">{{ work.note }}</div>
      <div v-for="identifiedBy in work.identifiedBy" :key="identifiedBy">
        {{ identifiedBy }}
      </div>
    </Labeled>
    <div v-if="work.librisUrl" class="my-4">
      <a :href="work.librisUrl" class="text-blue-700 underline">
        Se posten i LIBRIS
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { get } from "@/services/libris.service";
import { useRoute, useRouter } from "vue-router";
import { watch } from "@vue/runtime-core";
import useTerms from "@/terms/terms.composable";
import Labeled from "@/components/Labeled.vue";
import Term from "@/terms/Term.vue";
import useTitle from "./title.composable";
import use404 from "./404.composable";

const store = useStore();
const router = useRouter();
const route = useRoute();
const { add, sortTerms } = useTerms();
const { flag404 } = use404();

const work = ref();
const terms = computed(() => sortTerms(work.value?.terms));
useTitle(computed(() => work.value && work.value.title));

get(route.params.id)
  .then((work_) => (work.value = work_))
  .catch(flag404);

// Expose full data to developer console.
if (import.meta.env.DEV) {
  watch(work, () => {
    window.work = work.value;
  });
}

function filterTerm(term) {
  add(term);
  store.dispatch("search");
  router.push("/");
}

function gotoTerm(term) {
  router.push(`/subjects/${term.name}`);
}
</script>
