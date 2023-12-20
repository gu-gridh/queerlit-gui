<template>
  <nav class="container py-6">
    <router-link to="/" class="flex items-center">
      <icon icon="arrow-left" size="xs" class="mr-1" />
      Tillbaka till sökning
    </router-link>
  </nav>
  <main v-if="work" class="container">
    <h1 class="text-3xl">{{ work.title }}</h1>
    <div class="flex flex-wrap my-4 gap-y-2">
      <LabeledSection label="Författare" class="w-full sm:w-1/2 pr-4">
        <div v-for="(creator, i) in work.creators" :key="i" class="mr-4">
          <template v-if="creator.roles?.length">
            {{ creator.roles.join(", ") }}:
          </template>
          {{ creator.name }}
          <template v-if="creator.lifeSpan">
            ({{ creator.lifeSpan }})
          </template>
        </div>
      </LabeledSection>
      <LabeledSection label="Utgivningsår" class="w-full sm:w-1/2 pr-4">
        {{ work.date }}
      </LabeledSection>
    </div>
    <LabeledSection label="Ämnesord" class="my-4 text-lg">
      <div class="my-1">
        <TermButton
          v-for="term in terms.qlit"
          :key="term.id"
          :data="term"
          :options="[search, searchSecondary, goto]"
          class="mr-1 mb-1"
        />
      </div>
      <div class="text-base my-1">
        <TermButton
          v-for="term in work.termsSecondary"
          :key="term.id"
          :data="term"
          secondary
          :options="[search, searchSecondary, goto]"
          class="mr-1 mb-2"
        >
          {{ term.label }} – perifert
        </TermButton>
      </div>

      <div class="text-base my-1">
        <TermButton
          v-for="term in terms.other"
          :key="term.id"
          :data="term"
          :options="[search]"
          class="mr-1 mb-2"
        />
      </div>
    </LabeledSection>

    <LabeledSection
      v-if="work.motivation"
      label="Queerlits beskrivning"
      class="my-4"
    >
      {{ work.motivation }}
    </LabeledSection>

    <LabeledSection
      v-if="work.summary"
      label="Förlagets beskrivning"
      class="my-4"
    >
      {{ work.summary }}
    </LabeledSection>

    <div class="flex flex-wrap my-4 gap-y-2">
      <LabeledSection label="Omfång" class="w-full sm:w-1/2 pr-4">
        {{ work.extent || "—" }}
      </LabeledSection>

      <LabeledSection label="Språk" class="w-full sm:w-1/2 pr-4">
        <ValueList :values="work.languages" />
      </LabeledSection>

      <LabeledSection label="Genre/form" class="w-full sm:w-1/2 pr-4">
        <ValueList :values="work.genreform.map(getGenreformLabel)" />
      </LabeledSection>

      <LabeledSection label="Anmärkning" class="w-full sm:w-1/2 pr-4">
        {{ work.note || "—" }}
      </LabeledSection>

      <LabeledSection label="Klassifikation" class="w-full sm:w-1/2 pr-4">
        <ValueList
          :values="
            work.classification
              ?.map((c) => (c.type ? `${c.type}: ${c.code}` : c.code!))
              .filter(Boolean)
          "
        />
      </LabeledSection>

      <LabeledSection label="Identifierare" class="w-full sm:w-1/2 pr-4">
        <ValueList :values="work.identifiedBy" />
      </LabeledSection>

      <LabeledSection label="Publicering" class="w-full sm:w-1/2 pr-4">
        <ValueList :values="work.publication" />
      </LabeledSection>

      <LabeledSection label="Målgrupp" class="w-full sm:w-1/2 pr-4">
        <ValueList :values="work.intendedAudience" />
      </LabeledSection>
    </div>

    <div v-if="work.librisUrl" class="my-4">
      <a
        :href="work.librisUrl"
        class="text-blue-700 dark:text-sky-500 underline"
      >
        Se posten i Libris
      </a>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, watchEffect } from "vue";
import useTerms from "@/terms/terms.composable";
import TermButton from "@/terms/TermButton.vue";
import useTermOptions from "@/terms/termOptions.composable";
import LabeledSection from "@/components/LabeledSection.vue";
import ValueList from "@/components/ValueList.vue";
import type { Work } from "@/types/work";
import useQuery from "./query.composable";

const props = defineProps<{
  work: Work;
}>();

const { sortTerms } = useTerms();
const { goto, search, searchSecondary } = useTermOptions();
const { getGenreformLabel } = useQuery();

const terms = computed(() => sortTerms(props.work.terms));

// Expose full data to developer console.
if (import.meta.env.DEV) {
  watchEffect(() => {
    (window as any).work = props.work;
  });
}
</script>
