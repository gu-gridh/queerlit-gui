<template>
  <WorkDetails v-if="work" :work="work" />
  <LoadingSpinner v-else />
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";
import { get } from "@/services/libris.service";
import { useRoute } from "vue-router";
import useTitle from "./title.composable";
import use404 from "./404.composable";
import WorkDetails from "@/search/WorkDetails.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const route = useRoute();
const { flag404 } = use404();

const work = ref();
useTitle(computed(() => work.value && work.value.title));

get(route.params.id)
  .then((work_) => (work.value = work_))
  .catch(flag404);
</script>
