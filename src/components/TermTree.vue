<template>
  <div class="my-4 pl-8">
    <Term>{{ parent.label }}</Term>
    <TermTree v-for="child in children" :key="child.id" :parent="child" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "@vue/runtime-core";
import useTerms from "@/composables/terms";
import Term from "@/components/Term.vue";

const props = defineProps(["parent"]);
const { getChildren } = useTerms();
const children = ref([]);

onMounted(() => {
  children.value = getChildren(props.parent).map(({ term }) => term);
});
</script>

<style></style>
