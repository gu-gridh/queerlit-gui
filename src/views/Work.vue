<script setup lang="ts">
import { computed, ref } from "vue";
import { get } from "@/services/libris.service";
import { useRoute } from "vue-router";
import useTitle from "./title.composable";
import use404 from "./404.composable";
import WorkDetails from "@/search/WorkDetails.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import type { Work } from "@/types/work";

const route = useRoute();
const { flag404 } = use404();

const work = ref<Work>();
useTitle(computed(() => work.value && work.value.title));

get(route.params.id as string)
  .then((work_) => (work.value = work_))
  .catch(flag404);
</script>

<template>
  <WorkDetails v-if="work" :work="work" />
  <LoadingSpinner v-else />
</template>
