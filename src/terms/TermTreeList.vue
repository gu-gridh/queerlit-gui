<script setup lang="ts">
import { computed, ref } from "vue";
import { vElementVisibility } from "@vueuse/components";
import TermTree from "./TermTree.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import type { QlitTerm } from "@/services/qlit.types";

const props = defineProps<{
  heading?: string;
  terms?: QlitTerm[];
}>();

const PAGE_SIZE = 15;
const limit = ref(PAGE_SIZE);
const termsLimited = computed(() => props.terms?.slice(0, limit.value));

function onBottomVisibility(visible: boolean) {
  if (visible && props.terms && props.terms.length > limit.value) {
    limit.value += PAGE_SIZE;
  }
}
</script>

<template>
  <section>
    <h1 v-if="heading" class="text-4xl mb-6">
      {{ heading }}
    </h1>

    <template v-if="terms">
      <TermTree
        v-for="term in termsLimited"
        :key="term.name"
        :parent="term"
        :level="0"
      />
    </template>

    <LoadingSpinner v-if="!terms" />
    <div v-else-if="!terms.length" class="my-8 text-center text-xl">
      Inga träffar!
    </div>

    <div v-element-visibility="onBottomVisibility"></div>
  </section>
</template>
