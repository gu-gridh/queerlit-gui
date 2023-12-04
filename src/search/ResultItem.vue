<script setup lang="ts">
import { computed } from "vue";
import { ellipsis } from "@/util";
import useTerms from "@/terms/terms.composable";
import Term from "@/terms/Term.vue";
import useTermOptions from "@/terms/termOptions.composable";
import type { Term as TermType } from "@/types/work";

const props = defineProps<{
  i: number;
  title: string;
  to: string;
  creators?: any[];
  date?: string;
  genreform: string[];
  terms: TermType[];
  termsSecondary: TermType[];
  termsSecondaryMore?: boolean;
  summary?: string;
  motivation?: string;
}>();

const { sortTerms } = useTerms();
const { goto, search, searchSecondary } = useTermOptions();
const terms = computed(() => sortTerms(props.terms));
</script>

<template>
  <router-link :to="to" class="block">
    <article
      class="border-b border-dashed border-black transition-color flex items-baseline container py-4"
    >
      <div
        class="tabular-nums w-6 mr-2 font-thin text-2xl"
        :class="{ 'w-8': i > 80, 'w-10': i > 980 }"
      >
        {{ i }}.
      </div>
      <div class="flex-1">
        <div class="flex flex-wrap items-baseline gap-x-6 mb-2">
          <h3 class="w-48 grow mb-1 text-xl group-hover:underline">
            {{ title }}
          </h3>

          <div class="w-32 grow">
            <div class="flex flex-wrap">
              <div v-for="(creator, j) in creators" :key="j" class="mr-4">
                {{ creator.name }}
              </div>
            </div>
            <div>{{ date }}</div>
            <div class="flex flex-wrap">
              <div v-for="(item, j) in genreform" :key="j" class="mr-4">
                {{ item }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="terms.qlit.length" class="flex flex-wrap gap-1 my-2">
          <Term
            v-for="term in terms.qlit"
            :key="term.id"
            :data="term"
            :options="[search, searchSecondary, goto]"
            :draggable="true"
          />
        </div>

        <div
          v-if="termsSecondary.length || termsSecondaryMore"
          class="flex flex-wrap gap-1 my-2 text-sm"
        >
          <Term
            v-for="term in termsSecondary"
            :key="term.id"
            :data="term"
            secondary
            :options="[search, searchSecondary, goto]"
            :draggable="true"
          >
            {{ term.label }} – perifert
          </Term>
          <span v-if="termsSecondaryMore" class="opacity-70">...</span>
        </div>

        <div
          v-if="terms.other.length"
          class="flex flex-wrap gap-1 my-2 text-sm"
        >
          <Term
            v-for="term in terms.other"
            :key="term.id"
            :data="term"
            :options="[search]"
            :draggable="true"
          />
        </div>

        <div v-if="summary" class="my-2 text-sm">
          {{ ellipsis(summary, 80) }}
        </div>

        <div v-if="motivation" class="my-2 text-sm italic">
          {{ ellipsis(motivation, 80) }}
        </div>
      </div>
    </article>
  </router-link>
</template>

<style></style>
