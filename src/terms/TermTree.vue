<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import { key } from "@/store";
import type { QlitTerm } from "@/services/qlit.types";
import useTerms from "@/terms/terms.composable";
import Term from "@/terms/Term.vue";

const props = defineProps<{
  parent: QlitTerm;
  level?: number;
  expanded?: boolean;
}>();

const { state, commit } = useStore(key);
const { getChildren } = useTerms();

const children = ref<QlitTerm[]>();
const expanded = ref(
  props.expanded || state.termsExpanded.includes(props.parent.name)
);

const toggleExpanded = () => {
  expanded.value = !expanded.value;
  commit("toggleTermExpanded", {
    name: props.parent.name,
    expanded: expanded.value,
  });
};

// 333° is the hue for Tailwind's pink-600
// 92° is approximately ϕ radians, which gives suitable steps around the hue circle.
const hue = computed(() => 333 + (props.level || 0) * 92);

// Load children when expanding.
watchEffect(async () => {
  if (expanded.value && !children.value) {
    children.value = await getChildren(props.parent.name);
  }
});
</script>

<template>
  <div
    class="mt-4 pb-4 border-l-4"
    :class="{
      'ml-6 pl-2 ': level && expanded,
      'ml-8': level && !expanded,
      '-ml-2 pl-2': !level && expanded,
      'ml-0': !level && !expanded,
    }"
    :style="{
      borderColor: `hsl(${hue} 70% 80% / ${expanded ? 1 : 0})`,
    }"
  >
    <div class="flex flex-wrap justify-between items-baseline gap-4">
      <router-link :to="`/subjects/${parent.name}`" class="text-lg font-bold">
        <Term :data="parent" />
      </router-link>
      <span v-if="parent.altLabels && parent.altLabels.length">
        Varianter: {{ parent.altLabels.join(", ") }}
      </span>
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
          :level="(level || 0) + 1"
          :expanded="false"
        />
      </div>
      <div v-else>Laddar...</div>
    </div>
  </div>
</template>

<style></style>
