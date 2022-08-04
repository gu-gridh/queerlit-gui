<template>
  <router-link :to="`/verk/${work.id}`" class="block">
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
      <div class="flex-1 flex flex-wrap items-baseline gap-x-6">
        <h3 class="w-64 flex-grow mb-2 text-xl group-hover:underline">
          {{ work.title }}
        </h3>

        <div class="w-48 flex-grow">
          <div class="mb-2 flex flex-wrap">
            <div v-for="creator in work.creators" :key="creator" class="mr-4">
              {{ creator }}
            </div>
          </div>
          <div class="my-2">{{ work.date }}</div>
        </div>

        <div v-if="qlitTerms.length" class="w-full my-2">
          <Term
            v-for="term in qlitTerms"
            :key="term"
            :data="term"
            class="mr-1 mb-2"
          />
        </div>

        <div v-if="otherTerms.length" class="w-full mb-2 text-sm">
          <Term
            v-for="term in otherTerms"
            :key="term"
            :data="term"
            class="mr-1 mb-2"
          />
        </div>

        <div v-if="work.summary" class="w-full my-2 text-sm">
          {{ ellipsis(work.summary, 80) }}
        </div>
      </div>
    </article>
  </router-link>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import negate from "lodash/negate";
import Term from "@/terms/Term.vue";

const props = defineProps({
  work: { type: Object, required: true },
  i: { type: Number, required: true },
});

function ellipsis(text, limit) {
  if (text.length < limit) return text;
  // 1. Truncate; 2. Strip possibly incomplete trailing word; 3. Add ellipsis
  return text
    .substring(0, 200)
    .replace(/\p{L}+$/u, "")
    .replace(/\P{L}$/u, "…");
}

const qlitTerms = computed(() => props.work.terms.filter(termIsQlit));
const otherTerms = computed(() => props.work.terms.filter(negate(termIsQlit)));

function termIsQlit(term) {
  return term.inScheme?.["@id"] == "https://queerlit.dh.gu.se/qlit/v1";
}
</script>

<style></style>
