<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import useRootStore from "@/stores/root.store";
import type { QlitTerm } from "@/services/qlit.types";
import useTerms from "@/terms/terms.composable";
import TermButton from "@/terms/TermButton.vue";
import { useCanonicalPath } from "@/canonicalPath.composable";
import { useDark } from "@vueuse/core";

const props = defineProps<{
  parent: QlitTerm;
  level?: number;
  expanded?: boolean;
}>();

const store = useRootStore();
const { getChildren } = useTerms();
const { getTermPath } = useCanonicalPath();
const isDark = useDark();

const children = ref<QlitTerm[]>();
const expanded = ref(
  props.expanded || store.termsExpanded.includes(props.parent.name),
);

const toggleExpanded = () => {
  expanded.value = !expanded.value;
  store.toggleTermExpanded(props.parent.name, expanded.value);
};

// 333° is the hue for Tailwind's pink-600
// 92° is approximately ϕ radians, which gives suitable steps around the hue circle.
const hue = computed(() => 333 + (props.level || 0) * 92);
const lightness = computed(() => (isDark.value ? "30%" : "80%"));

// Load children when expanding.
watchEffect(async () => {
  if (expanded.value && !children.value) {
    children.value = await getChildren(props.parent.name);
  }
});
</script>

<template>
  <article
    class="mt-4 pb-4 border-l-4"
    :class="{
      'ml-6 pl-2 ': level && expanded,
      'ml-8': level && !expanded,
      '-ml-2 pl-2': !level && expanded,
      'ml-0': !level && !expanded,
    }"
    :style="{
      borderColor: `hsl(${hue} 70% ${lightness} / ${expanded ? 1 : 0})`,
    }"
  >
    <header class="flex flex-wrap justify-between items-baseline gap-4">
      <router-link :to="getTermPath(parent)" class="text-lg font-bold">
        <h3><TermButton :data="parent" /></h3>
      </router-link>
      <span v-if="parent.altLabels && parent.altLabels.length">
        Varianter: {{ parent.altLabels.join(", ") }}
      </span>
    </header>

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

    <section v-if="expanded">
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
    </section>
  </article>
</template>

<style></style>
