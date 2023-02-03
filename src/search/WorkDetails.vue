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
          :options="['search', 'goto']"
          class="mr-1 mb-1"
        />
      </div>
      <div class="text-base my-1">
        <Term
          v-for="term in work.termsSecondary"
          :key="term"
          :data="term"
          secondary
          :options="['search', 'goto']"
          class="mr-1 mb-1"
        >
          {{ term._label }} – perifert
        </Term>
      </div>

      <div class="text-base my-1">
        <Term
          v-for="term in terms.other"
          :key="term"
          :data="term"
          :options="term['@id'] && ['search']"
          class="mr-1 mb-2"
        />
      </div>
    </Labeled>

    <Labeled v-if="work.motivation" label="Queerlits beskrivning" class="my-4">
      {{ work.motivation }}
    </Labeled>

    <Labeled v-if="work.summary" label="Förlagets beskrivning" class="my-4">
      {{ work.summary }}
    </Labeled>

    <div class="flex flex-wrap my-4 gap-y-2">
      <Labeled label="Omfång" class="w-full sm:w-1/2 pr-4">
        {{ work.extent || "—" }}
      </Labeled>

      <Labeled label="Språk" class="w-full sm:w-1/2 pr-4">
        <ValueList :values="work.languages" />
      </Labeled>

      <Labeled label="Genre/form" class="w-full sm:w-1/2 pr-4">
        <ValueList :values="work.genreform.map((gf) => gf._label)" />
      </Labeled>

      <Labeled label="Anmärkning" class="w-full sm:w-1/2 pr-4">
        {{ work.note || "—" }}
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
import { computed, watchEffect } from "vue";
import useTerms from "@/terms/terms.composable";
import Labeled from "@/components/Labeled.vue";
import Term from "@/terms/Term.vue";
import ValueList from "@/components/ValueList.vue";

const props = defineProps({
  work: {
    type: Object,
    required: true,
  },
});

const { sortTerms } = useTerms();

const terms = computed(() => sortTerms(props.work.terms));

// Expose full data to developer console.
if (import.meta.env.DEV) {
  watchEffect(() => {
    window.work = props.work;
  });
}
</script>
