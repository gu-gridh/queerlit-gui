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

        <div v-if="work.terms.length" class="my-2">
          <Term v-for="term in work.terms" :key="term" class="mr-1 mb-1">
            {{ term }}
          </Term>
        </div>

        <div v-if="work.summary" class="my-2 text-sm">
          {{ ellipsis(work.summary, 80) }}
        </div>
      </div>
    </article>
  </router-link>
</template>

<script setup>
import Term from "@/terms/Term.vue";

defineProps({
  work: { type: Object, required: true },
  i: { type: Number, required: true },
});

function ellipsis(text, limit) {
  if (text.length < limit) return text;
  return text.substring(0, 200).replace(/\s\S+$/, "...");
}
</script>

<style></style>
