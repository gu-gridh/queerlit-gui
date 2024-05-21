<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { get } from "@/services/libris.service";
import use404 from "./404.composable";
import WorkDetails from "@/search/WorkDetails.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import type { Work } from "@/types/work";
import { useCanonicalPath } from "@/canonicalPath.composable";
import { useRouteInfo } from "./routeInfo.composable";

const route = useRoute();
const { flag404 } = use404();
const { getWorkPath } = useCanonicalPath();
const { setRouteInfo } = useRouteInfo();

const work = ref<Work>();

get(route.params.id as string)
  .then((work_) => (work.value = work_))
  .catch(flag404);

watch(work, () => {
  if (!work.value) return;

  setRouteInfo({
    title: work.value.title,
    path: getWorkPath(work.value),
    description: [work.value.summary, work.value.motivation]
      .filter(Boolean)
      .join(" "),
  });
});
</script>

<template>
  <div style="height:calc(100% + 40px);">
  <WorkDetails v-if="work" :work="work" />
  <LoadingSpinner v-else />
</div>
</template>
