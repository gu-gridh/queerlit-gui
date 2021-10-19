<template>
  <router-link to="/verk/1" class="group">
    <article class="block clearfix mb-2">
      <div
        class="
          float-right
          ml-2
          mb-1
          h-48
          w-32
          flex
          justify-center
          items-center
          p-1
        "
      >
        <img
          src="@/assets/drottningens-juvelsmycke.jpeg"
          class="max-h-full border"
        />
      </div>
      <h3 class="text-xl group-hover:underline">
        {{ title }}
      </h3>
      <div class="flex my-2 text-lg">
        <div class="w-1/2 pr-4">
          {{ creator }}
        </div>
        <div class="w-1/4 pr-4">Bok</div>
        <div class="w-1/4 pr-4">{{ date }}</div>
      </div>
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

const props = defineProps({
  identifier: String,
  title: String,
  creator: String,
  type: String,
  publisher: [String, Array],
  date: [String, Array],
  language: String,
  terms: Array,
});

const creator = props.creator
  .split(", ")
  .filter((s) => !/^[\d\s-]*$/.test(s))
  .join(", ");
const date = Array.isArray(props.date) ? props.date[0] : props.date;
</script>

<style></style>
