<template>
  <div
    class="mt-4 pl-4 pb-4 border-l-4 border-transparent"
    :class="[isRoot ? '-ml-2' : 'ml-8']"
    :style="{
      borderColor: `hsl(${hue} 70% 80% / ${0 + expanded})`,
    }"
  >
    <div>
      <router-link :to="`/ao/${parent.id}`" class="text-lg font-bold">
        <Term>{{ parent.prefLabel }}</Term>
      </router-link>
      <div v-if="parent.altLabel" class="my-2">
        (även: {{ parent.altLabel.join(", ") }})
      </div>
    </div>

    <div v-if="parent.scopeNote" class="my-2">
      {{ parent.scopeNote }}
    </div>

    <div
      v-if="children.length"
      class="my-2 text-sm cursor-pointer"
      @click="toggleExpanded"
    >
      <span v-if="expanded">
        <icon icon="minus" size="xs" /> Göm undertermer
      </span>
      <span v-else> <icon icon="plus" size="sm" /> Visa undertermer </span>
    </div>

    <div v-if="expanded">
      <TermTree
        v-for="child in children"
        :key="child.id"
        :parent="child"
        :level="level + 1"
        :expanded="false"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "@vue/runtime-core";
import useTerms from "@/composables/terms";
import Term from "@/components/Term.vue";
import QButton from "./QButton.vue";

const props = defineProps(["parent", "level", "expanded"]);
const { getChildren } = useTerms();
const children = ref([]);
const expanded = ref(props.expanded);

onMounted(async () => {
  children.value = (await getChildren(props.parent)).map(({ term }) => term);
});

const toggleExpanded = () => (expanded.value = !expanded.value);

const isRoot = computed(() => !props.parent.broader);

// 333° is the hue for Tailwind's pink-600
// 92° is approximately ϕ radians, which gives suitable steps around the hue circle.
const hue = computed(() => 333 + props.level * 92);
</script>

<style></style>
