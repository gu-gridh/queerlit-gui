<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useSchemaOrg, defineWebPage } from "@unhead/schema-org";
import { pathUrl } from "@/util";
import { get } from "@/services/libris.service";
import useTitle from "./title.composable";
import use404 from "./404.composable";
import WorkDetails from "@/search/WorkDetails.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import type { Work } from "@/types/work";
import { useCanonicalPath } from "@/canonicalPath.composable";

const route = useRoute();
const { flag404 } = use404();
const { getWorkPath, ensurePath } = useCanonicalPath();
const { setTitle } = useTitle();

const work = ref<Work>();

get(route.params.id as string)
  .then((work_) => (work.value = work_))
  .catch(flag404);

watch(work, () => {
  if (!work.value) return;
  ensurePath(getWorkPath(work.value));
  setTitle(work.value.title);

  useSchemaOrg([
    defineWebPage({
      description: [work.value.summary, work.value.motivation]
        .filter(Boolean)
        .join(" "),
      relatedLink: work.value.librisUrl,
      url: pathUrl(getWorkPath(work.value)),
    }),
  ]);
});
</script>

<template>
  <WorkDetails v-if="work" :work="work" />
  <LoadingSpinner v-else />
</template>
