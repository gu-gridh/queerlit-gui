<script setup lang="ts">
import { computed, ref } from "vue";
import useRootStore from "@/stores/root.store";
import type { Term } from "@/types/work";
import type { TermOption } from "./termOptions.composable";
import useTerms from "./terms.composable";
import OptionsButton from "@/components/OptionsButton.vue";

const props = defineProps<{
  data: Term;
  secondary?: boolean;
  options?: TermOption[];
  draggable?: boolean;
}>();

const store = useRootStore();
const { termIsQlit } = useTerms();

const isMenuVisible = ref(false);
const isQlit = computed(() => termIsQlit(props.data));
const optionItems = computed(
  () =>
    props.options
      ?.map((op) => op(props.data))
      .filter((op) => op.isApplicable !== false) || [],
);

function dragStart() {
  isMenuVisible.value = false;
  store.dragged = { type: "term", data: props.data };
}

function dragEnd() {
  store.dragged = null;
}
</script>

<template>
  <OptionsButton :disabled="!optionItems.length">
    <drag
      class="inline-block relative"
      :draggable="draggable"
      @dragstart="dragStart"
      @dragend="dragEnd"
    >
      <span
        class="flex items-center transition-all px-2 py-0.5 text-black rounded-md shadow"
        :class="[
          isQlit
            ? secondary
              ? 'bg-tagyellow-bright'
              : 'bg-tagyellow'
            : 'bg-gray-200 dark:bg-gray-600 dark:text-gray-200',
          optionItems.length ? 'cursor-context-menu' : '',
        ]"
      >
        <slot>
          {{ data.label }}
        </slot>

        <icon
          v-if="optionItems.length"
          icon="ellipsis-v"
          size="xs"
          class="ml-2 opacity-50"
        />
      </span>
    </drag>

    <template v-if="optionItems.length" #menu>
      <ul
        class="bg-gray-50/95 dark:bg-gray-600/95 rounded shadow mt-0.5 w-40 text-base"
      >
        <li v-for="(option, i) in optionItems" :key="i">
          <component
            :is="option.to ? 'router-link' : 'div'"
            :to="option.to || undefined"
            class="block text-ellipsis overflow-hidden whitespace-nowrap px-1 hover:bg-gray-100 dark:hover:bg-gray-500 dark:text-stone-200 cursor-pointer"
            @click.prevent.stop="
              () => {
                option.action();
                isMenuVisible = false;
              }
            "
            v-html="option.label"
          />
        </li>
      </ul>
    </template>
  </OptionsButton>
</template>

<style scoped></style>
