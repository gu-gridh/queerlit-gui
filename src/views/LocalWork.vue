<template>
  <WorkDetails v-if="work" :work="work" />
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useRoute } from "vue-router";
import useLocalWorks from "@/search/localWorks.composable";
import useTitle from "./title.composable";
import use404 from "./404.composable";
import WorkDetails from "@/search/WorkDetails.vue";

const route = useRoute();
const { flag404 } = use404();
const { works } = useLocalWorks();

const work = works[route.params.id];
if (!work) flag404();
useTitle(computed(() => work?.title));
</script>
