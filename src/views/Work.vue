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
        <div v-for="creator in work.creators" :key="creator" class="mr-4">
          <template v-if="creator.roles">
            {{ creator.roles.join(", ") }}:
          </template>
          {{ creator.name }}
          <template v-if="creator.lifeSpan">
            ({{ creator.lifeSpan }})
          </template>
        </div>
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
          :options="['search', 'goto']"
        />
      </div>
      <div class="text-base my-1">
        <Term
          v-for="term in terms.other"
          :key="term"
          :data="term"
          class="mr-1 mb-2"
          :options="term['@id'] && ['search']"
        />
      </div>
    </Labeled>
    <Labeled v-if="work.summary" label="Beskrivning" class="my-4">
      {{ work.summary }}
    </Labeled>

    <Labeled v-if="work.motivation" label="HBTQI-motiv" class="my-4">
      {{ work.motivation }}
    </Labeled>

    <div class="flex flex-wrap my-4 gap-y-2">
      <Labeled label="Omfång" class="w-full sm:w-1/2 pr-4">
        {{ work.extent || "–" }}
      </Labeled>

      <Labeled label="Språk" class="w-full sm:w-1/2 pr-4">
        <ValueList :values="work.languages" />
      </Labeled>

      <Labeled label="Genre/form" class="w-full sm:w-1/2 pr-4">
        <ValueList :values="work.genreform.map((gf) => gf._label)" />
      </Labeled>

      <Labeled label="Anmärkning" class="w-full sm:w-1/2 pr-4">
        {{ work.note || "–" }}
      </Labeled>

      <Labeled label="Klassifikation" class="w-full sm:w-1/2 pr-4">
        <ValueList
          :values="
            work.classification.map((c) =>
              c.type ? `${c.type}: ${c.code}` : c.code
            )
          "
        />
      </Labeled>

      <Labeled label="Identifierare" class="w-full sm:w-1/2 pr-4">
        <ValueList :values="work.identifiedBy" />
      </Labeled>

      <Labeled label="Publicering" class="w-full sm:w-1/2 pr-4">
        <ValueList :values="work.publication" />
      </Labeled>

      <Labeled label="Målgrupp" class="w-full sm:w-1/2 pr-4">
        <ValueList :values="work.intendedAudience" />
      </Labeled>
    </div>

    <div v-if="work.librisUrl" class="my-4">
      <a :href="work.librisUrl" class="text-blue-700 underline">
        Se posten i Libris
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";
import { get } from "@/services/libris.service";
import { useRoute } from "vue-router";
import { watch } from "@vue/runtime-core";
import useTerms from "@/terms/terms.composable";
import Labeled from "@/components/Labeled.vue";
import Term from "@/terms/Term.vue";
import useTitle from "./title.composable";
import use404 from "./404.composable";
import ValueList from "@/components/ValueList.vue";

const route = useRoute();
const { sortTerms } = useTerms();
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
</script>
