<template>
  <router-link :to="`/verk/${id}`" class="block">
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
      <div class="flex-1 flex flex-wrap items-baseline">
        <h3 class="w-full xl:w-3/5 xl:pr-6 mb-2 text-xl group-hover:underline">
          {{ title }}
        </h3>

        <div class="w-full xl:w-2/5">
          <div class="mb-2 flex flex-wrap">
            <div v-for="creator in creators" :key="creator" class="mr-4">
              {{ creator }}
            </div>
          </div>
          <div class="my-2">{{ date }}</div>
        </div>

        <div class="my-2">
          <Term v-for="term in terms" :key="term" class="mr-1 mb-1">
            {{ term }}
          </Term>
        </div>
      </div>
    </article>
  </router-link>
</template>

<script setup>
import Term from "@/components/Term.vue";

defineProps({
  id: String,
  identifier: String,
  title: String,
  creators: Array,
  type: String,
  publisher: String,
  date: String,
  language: String,
  terms: Array,
  i: Number,
});
</script>

<style></style>
