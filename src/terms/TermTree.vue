<template>
  <div
    class="mt-4 pl-4 pb-4 border-l-4 border-transparent"
    :class="[isRoot ? '-ml-2' : 'ml-8']"
    :style="{
      borderColor: `hsl(${hue} 70% 80% / ${0 + expanded})`,
    }"
  >
    <div>
      <router-link :to="`/ao/${parent.name}`" class="text-lg font-bold">
        <Term>{{ parent.prefLabel }}</Term>
      </router-link>
      <div v-if="parent.altLabels && parent.altLabels.length" class="my-2">
        (även: {{ parent.altLabels.join(", ") }})
      </div>
    </div>

    <div v-if="parent.scopeNote" class="my-2">
      {{ parent.scopeNote }}
    </div>

    <div
      v-if="parent.narrower.length"
      class="my-2 text-sm cursor-pointer"
      @click="toggleExpanded"
    >
      <span v-if="expanded">
        <icon icon="minus" size="xs" /> Göm undertermer
      </span>
      <span v-else> <icon icon="plus" size="sm" /> Visa undertermer </span>
    </div>

    <div v-if="expanded">
      <div v-if="children">
        <TermTree
          v-for="child in children"
          :key="child.name"
          :parent="child"
          :level="level + 1"
          :expanded="false"
        />
      </div>
      <div v-else>Laddar...</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "@vue/runtime-core";
import useTerms from "@/terms/terms.composable";
import Term from "@/terms/Term.vue";

const props = defineProps(["parent", "level", "expanded"]);
const { getChildren } = useTerms();
const children = ref(null);
const expanded = ref(props.expanded);

const toggleExpanded = () => (expanded.value = !expanded.value);

const isRoot = computed(
  () => !props.parent.broader || !props.parent.broader.length
);

// 333° is the hue for Tailwind's pink-600
// 92° is approximately ϕ radians, which gives suitable steps around the hue circle.
const hue = computed(() => 333 + props.level * 92);

// Load children when expanding.
watch(expanded, async () => {
  if (expanded.value && !children.value) {
    children.value = await getChildren(props.parent.name);
  }
});
</script>

<style></style>