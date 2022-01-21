<template>
  <router-link :to="`/verk/${id}`" class="group">
    <article class="block mb-6 items-baseline">
      <h3 class="w-1/2 my-2 text-xl group-hover:underline">
        {{ title }}
      </h3>
      <div class="my-2 flex">
        <div v-for="creator in creators" :key="creator" class="mr-4">
          {{ creator }}
        </div>
      </div>
      <div class="my-2">{{ date }}</div>
      <div class="my-2">
        <Term v-for="term in terms" :key="term" class="mr-1 mb-1">
          {{ term }}
        </Term>
      </div>
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
