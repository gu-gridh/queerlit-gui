<template>
  <router-link :to="`/verk/${id}`" class="block p-2 mb-4">
    <article class="block items-baseline">
      <h3
        class="
          my-2
          text-xl
          group-hover:underline
          md:float-left md:w-1/2 md:pr-4
        "
      >
        {{ title }}
      </h3>

      <div class="md:w-1/2 md:float-right">
        <div class="my-2 flex">
          <div v-for="creator in creators" :key="creator" class="mr-4">
            {{ creator }}
          </div>
        </div>
        <div class="my-2">{{ date }}</div>
      </div>

      <div class="my-2 md:w-1/2 md:pr-4">
        <Term v-for="term in terms" :key="term" class="mr-1 mb-1">
          {{ term }}
        </Term>
      </div>

      <div class="clear-both"></div>
    </article>
  </router-link>
</template>

<script setup>
import Term from "@/components/Term.vue";
import { computed } from "@vue/reactivity";

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
});
</script>

<style></style>
