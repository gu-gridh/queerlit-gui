<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useToggle } from "@vueuse/core";
import type { QlitTerm } from "@/services/qlit.types";
import { urlBasename } from "@/util";
import Term from "./Term.vue";
import useTerms from "./terms.composable";
import useTermOptions from "./termOptions.composable";

const props = defineProps<{
  parent: QlitTerm;
  level?: number;
}>();

const { getChildren } = useTerms();
const { goto, search, searchSecondary } = useTermOptions();
const [expanded, toggleExpanded] = useToggle();
const children = ref<QlitTerm[]>();

// Load children when expanding.
watchEffect(async () => {
  if (expanded.value && !children.value) {
    const name = urlBasename(props.parent.id);
    children.value = await getChildren(name);
  }
});
</script>

<template>
  <div class="mx-2 mb-1" :class="{ 'ml-4': (level as number) > 0 }">
    <div class="mb-1 flex flex-wrap items-baseline gap-4">
      <Term
        :data="parent"
        :options="[search, searchSecondary, goto]"
        :draggable="true"
      />
      <div
        v-if="parent.narrower.length"
        class="cursor-pointer"
        @click="toggleExpanded()"
      >
        <icon v-if="!expanded" icon="plus" class="opacity-70" />
        <icon v-else icon="minus" class="opacity-70" />
      </div>
    </div>

    <div v-if="expanded && children">
      <TermTreeSmall
        v-for="child in children"
        :key="child.name"
        :parent="child"
        :level="(level || 0) + 1"
        :expanded="false"
      />
    </div>
  </div>
</template>

<style></style>
