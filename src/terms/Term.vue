<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { vOnClickOutside } from "@vueuse/components";

const props = defineProps({
  data: Object,
  secondary: Boolean,
  options: {
    type: Array,
    default: () => [],
  },
  draggable: Boolean,
});

const { commit } = useStore();
const isQlit = computed(
  () =>
    props.data?.inScheme?.["@id"] == "https://queerlit.dh.gu.se/qlit/v1" ||
    props.data?.["@id"]?.indexOf("https://queerlit.dh.gu.se/qlit/v1/") === 0
);
const isMenuVisible = ref(false);

const optionItems = computed(() =>
  props.options
    .map((op) => op(props.data))
    .filter((op) => op.isApplicable !== false)
);

function toggleMenu(event) {
  if (optionItems.value?.length) {
    event.preventDefault();
    isMenuVisible.value = !isMenuVisible.value;
  }
}

function dragStart() {
  isMenuVisible.value = false;
  commit("setDragged", { type: "term", data: props.data });
}

function dragEnd() {
  commit("setDragged", null);
}
</script>

<template>
  <drag
    v-on-click-outside="() => (isMenuVisible = false)"
    class="inline-block relative"
    :draggable="draggable && !!data"
    @dragstart="dragStart"
    @dragend="dragEnd"
    @click="toggleMenu"
  >
    <span
      class="
        flex
        items-center
        transform
        transition-all
        px-2
        py-0.5
        text-black
        font-thin
        rounded-md
        shadow
        cursor-default
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

      <icon
        v-if="optionItems?.length"
        icon="ellipsis-v"
        size="xs"
        class="ml-2 opacity-50"
      />
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
