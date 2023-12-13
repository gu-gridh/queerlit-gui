<script setup lang="ts">
import { useRoute } from "vue-router";
import useLocalWorks from "@/search/localWorks.composable";
import use404 from "./404.composable";
import WorkDetails from "@/search/WorkDetails.vue";
import type { Work } from "@/types/work";
import { useRouteInfo } from "./routeInfo.composable";

const route = useRoute();
const { flag404 } = use404();
const { getLocal } = useLocalWorks();
const { setRouteInfo } = useRouteInfo();

const work = getLocal(route.params.id as string);
let work_: Work;
if (!work) flag404();
else {
  work_ = {
    ...work,
    date: work.date.label,
    termsSecondary: [],
  };

  setRouteInfo({
    title: work.title,
    description: work.motivation,
  });
}
</script>

<template>
  <WorkDetails v-if="work" :work="work_" />
</template>
