<template>
  <router-link :to="to" class="block">
    <article
      class="
        border-b border-dashed border-black
        p-4
        transition-color
        flex
        items-baseline
        hover:bg-smoke-100
      "
    >
      <div
        class="tabular-nums w-6 mr-2 font-thin text-2xl"
        :class="{ 'w-8': i > 80, 'w-10': i > 980 }"
      >
        {{ i }}.
      </div>
      <div class="flex-1">
        <div class="flex flex-wrap items-baseline gap-x-6 mb-2">
          <h3 class="w-64 flex-grow mb-1 text-xl group-hover:underline">
            {{ title }}
          </h3>

          <div class="w-48 flex-grow">
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

        <div v-if="terms.qlit.length" class="mt-2">
          <Term
            v-for="term in terms.qlit"
            :key="term"
            :data="term"
            class="mr-1 mb-2"
            :options="['search', 'goto']"
          />
        </div>

        <div v-if="terms.other.length" class="mb-2 text-sm">
          <Term
            v-for="term in terms.other"
            :key="term"
            :data="term"
            class="mr-1 mb-2"
            :options="term['@id'] && ['search']"
          />
        </div>

        <div v-if="summary" class="my-2 text-sm">
          {{ ellipsis(summary, 80) }}
        </div>
      </div>
    </article>
  </router-link>
</template>

<script setup>
import { computed } from "vue";
import { ellipsis } from "@/util";
import useTerms from "@/terms/terms.composable";
import Term from "@/terms/Term.vue";

const props = defineProps({
  i: { type: [Number, String], required: true },
  title: { type: String, required: true },
  to: { type: [String, Object], required: true },
  creators: { type: Array, default: () => [] },
  date: { type: String, default: () => null },
  genreform: { type: Array, default: () => [] },
  terms: { type: Array, default: () => [] },
  summary: { type: String, default: () => null },
});

const { sortTerms } = useTerms();
const terms = computed(() => sortTerms(props.terms));
</script>

<style></style>
