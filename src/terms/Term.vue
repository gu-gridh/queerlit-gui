<script setup>
import { computed, ref } from "@vue/reactivity";
import { vOnClickOutside } from "@vueuse/components";
import useTerms from "./terms.composable";

const props = defineProps({
  data: Object,
  secondary: Boolean,
  options: {
    type: Array,
    default: () => [],
    validate: (options) =>
      options.every((option) => ["search", "goto"].includes(option)),
  },
});
const { gotoTerm, searchByTerm } = useTerms();

const OPTION_DEFS = props.data && {
  goto: {
    label: `Om ämnesordet <em>${props.data._label}</em>`,
    action: () => gotoTerm(props.data),
  },
  search: {
    label: `Sök på <em>${props.data._label}</em>`,
    action: () => searchByTerm(props.data),
  },
};

const isQlit = computed(
  () =>
    props.data?.inScheme?.["@id"] == "https://queerlit.dh.gu.se/qlit/v1" ||
    props.data?.["@id"]?.indexOf("https://queerlit.dh.gu.se/qlit/v1/") === 0
);
const isHovering = ref(false);
const isMenuVisible = ref(false);
const isToggleable = ref(false);

const optionItems = computed(() => {
  return (
    props.data && props.options.map((key) => OPTION_DEFS[key]).filter(Boolean)
  );
});

function showMenu() {
  // Require a short hovering before showing the menu.
  isHovering.value = true;
  setTimeout(() => {
    if (isHovering.value) isMenuVisible.value = true;
  }, 150);

  // The user can dismiss the menu by clicking the term, but only after a short while.
  // Partly because the user might click before seeing that the menu is already shown on hover.
  // But also because on a touchscreen, the click event directly follows a mouseenter event;
  // then the click event should not undo what the mouseenter event did.
  isToggleable.value = false;
  setTimeout(() => (isToggleable.value = true), 500);
}

function hideMenu() {
  isMenuVisible.value = false;
  isHovering.value = false;
}

function toggleMenu() {
  if (isToggleable.value) isMenuVisible.value = !isMenuVisible.value;
}
</script>

<template>
  <span
    v-on-click-outside="() => (isMenuVisible = false)"
    class="inline-block relative"
    @click="toggleMenu()"
    @mouseenter="showMenu()"
    @mouseleave="hideMenu()"
  >
    <span
      class="
        transform
        hover:scale-105
        transition-all
        px-2
        py-1
        text-black
        font-thin
        rounded-md
        shadow
      "
      :class="[
        isQlit
          ? secondary
            ? 'bg-tagyellow-bright'
            : 'bg-tagyellow'
          : 'bg-gray-200',
      ]"
    >
      <slot>
        {{ data._label }}
      </slot>
    </span>
    <Transition enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div
        v-if="optionItems && optionItems.length"
        v-show="isMenuVisible"
        class="absolute z-10 h-0 bottom-0 left-0 duration-200"
      >
        <ul
          class="
            bg-gray-50 bg-opacity-95
            rounded
            shadow
            mt-0.5
            text-sm
            w-40
            overflow-hidden
          "
        >
          <li
            v-for="(option, i) in optionItems"
            :key="i"
            class="
              overflow-ellipsis
              whitespace-nowrap
              px-1
              hover:bg-gray-100
              cursor-pointer
            "
            @click.prevent.stop="option.action"
            v-html="option.label"
          />
        </ul>
      </div>
    </Transition>
  </span>
</template>

<style scoped></style>
