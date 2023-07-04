<template>
  <div class="mx-2 mb-1" :class="{ 'ml-4': level > 0 }">
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

<script setup>
import { ref, watchEffect } from "vue";
import { useToggle } from "@vueuse/core";
import Term from "@/terms/Term.vue";
import useTerms from "./terms.composable";
import useTermOptions from "./termOptions.composable";

const props = defineProps(["parent", "level"]);

const { getChildren } = useTerms();
const { goto, search, searchSecondary } = useTermOptions();
const [expanded, toggleExpanded] = useToggle();
const children = ref(null);

// Load children when expanding.
watchEffect(async () => {
  if (expanded.value && !children.value) {
    children.value = await getChildren(props.parent.name);
  }
});
</script>

<style></style>
