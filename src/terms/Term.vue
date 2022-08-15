<script setup>
import { computed, ref } from "@vue/reactivity";
import { vOnClickOutside } from "@vueuse/components";

const props = defineProps(["data", "options"]);

const isQlit = computed(
  () =>
    !props.data ||
    props.data.inScheme?.["@id"] == "https://queerlit.dh.gu.se/qlit/v1"
);
const label = computed(() => props.data?.prefLabel);
const isMenuVisible = ref(false);
const isToggleable = ref(false);

function showMenu() {
  isMenuVisible.value = true;
  // The user can dismiss the menu by clicking the term, but only after a short while.
  // Partly because the user might click before seeing that the menu is already shown on hover.
  // But also because on a touchscreen, the click event directly follows a mouseenter event;
  // then the click event should not undo what the mouseenter event did.
  isToggleable.value = false;
  setTimeout(() => (isToggleable.value = true), 500);
}
function hideMenu() {
  isMenuVisible.value = false;
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
      :class="[isQlit ? 'bg-tagyellow' : 'bg-gray-200']"
    >
      <slot>
        {{ label }}
      </slot>
    </span>
    <Transition enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div
        v-if="options && options.length"
        v-show="isMenuVisible"
        class="absolute z-10 h-0 bottom-0 left-0 duration-200"
      >
        <ul class="bg-gray-50 bg-opacity-95 rounded shadow mt-0.5 text-sm w-40">
          <li
            v-for="(option, i) in options"
            :key="i"
            class="
              overflow-hidden overflow-ellipsis
              whitespace-nowrap
              px-1
              hover:bg-gray-100
              cursor-pointer
            "
            @click.prevent="option.action"
            v-html="option.label"
          />
        </ul>
      </div>
    </Transition>
  </span>
</template>

<style scoped></style>
