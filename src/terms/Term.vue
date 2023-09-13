<script setup lang="ts">
import { computed, ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import useRootStore from "@/stores/root.store";
import type { Term } from "@/types/work";
import type { TermOption } from "./termOptions.composable";
import useTerms from "./terms.composable";

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

function toggleMenu(event: Event) {
  if (optionItems.value.length) {
    event.preventDefault();
    isMenuVisible.value = !isMenuVisible.value;
  }
}

function dragStart() {
  isMenuVisible.value = false;
  store.dragged = { type: "term", data: props.data };
}

function dragEnd() {
  store.dragged = null;
}
</script>

<template>
  <drag
    v-on-click-outside="() => (isMenuVisible = false)"
    class="inline-block relative"
    :draggable="draggable"
    @dragstart="dragStart"
    @dragend="dragEnd"
    @click="toggleMenu"
  >
    <span
      class="flex items-center transition-all px-2 py-0.5 text-black font-thin rounded-md shadow cursor-default"
      :class="[
        isQlit
          ? secondary
            ? 'bg-tagyellow-bright'
            : 'bg-tagyellow'
          : 'bg-gray-200',
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
    <Transition enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div
        v-if="optionItems.length"
        v-show="isMenuVisible"
        class="absolute z-10 h-0 bottom-0 left-0 duration-200"
      >
        <ul
          class="bg-gray-50/95 rounded shadow mt-0.5 text-sm w-40 overflow-hidden"
        >
          <li
            v-for="(option, i) in optionItems"
            :key="i"
            class="overflow-ellipsis whitespace-nowrap px-1 hover:bg-gray-100 cursor-pointer"
            @click.prevent.stop="
              () => {
                option.action();
                isMenuVisible = false;
              }
            "
            v-html="option.label"
          />
        </ul>
      </div>
    </Transition>
  </drag>
</template>

<style scoped></style>
