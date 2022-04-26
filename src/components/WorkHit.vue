<template>
  <router-link :to="`/verk/${id}`" class="block py-2 px-6 hover:bg-gray-50">
    <article class="article block flex  items-baseline">
      <div class="w-4 mr-2">{{ i }}.</div>
      <div class="flex-1 flex flex-wrap items-baseline">
        <h3 class="w-full xl:w-1/2 xl:pr-4 mb-2 text-xl group-hover:underline">
          {{ title }}
        </h3>

        <div class="w-full xl:w-1/2">
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
  i: Number,
});
</script>

<style>

.article{
  border-style:dashed;
  border-width:0px 0px 0.5px 0px;
  border-color:black;
}

.w-4{
  font-weight:100;
  font-size:30px;
  margin-right: 20px;
}
</style>
