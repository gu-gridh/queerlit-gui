<template>
  <div v-on-click-outside="blur">
    <drop
      class="p-2 rounded-t"
      :class="{
        'rounded-b': !suggestions.length,
        incomplete: input,
        'bg-smoke-200 hover:bg-smoke-300 dark:bg-stone-700 dark:hover:bg-stone-700':
          !terms.length,
        'bg-blue-100 dark:bg-slate-600': terms.length,
        'animate-throb': isDraggingTerm,
      }"
      @drop="dropTerm"
    >
      <LabeledSection
        :label="label"
        :for-id="inputId"
        inner-class="flex items-center"
      >
        <div class="flex-1 flex flex-wrap items-baseline gap-1">
          <TermButton
            v-for="term in terms"
            :key="term.id"
            class="term-added text-md"
            :data="term"
            :options="[removeOption, goto]"
            :secondary="secondary"
            :draggable="true"
          >
            {{ term.label }}
            <template v-if="secondary">– perifert</template>
            <icon
              icon="times"
              size="xs"
              class="ml-1 cursor-pointer"
              @click.prevent="remove(term)"
            />
          </TermButton>

          <input
            :id="inputId"
            v-model="input"
            type="search"
            :size="Math.max(3, input.length + 1)"
            class="bg-transparent border border-transparent w-36 flex-1 transition-colors text-xl leading-none"
            @input="suggest"
            @keydown.backspace="removeLast"
            @focus="suggest"
          />
        </div>

        <ToggleIcon
          v-if="help"
          icon="question"
          :value="showHelp"
          :toggle="toggleHelp"
        />
      </LabeledSection>

      <TransitionExpand>
        <InputHelp v-if="showHelp" class="mb-0" @dismiss="toggleHelp(false)">
          {{ help }}
        </InputHelp>
      </TransitionExpand>
    </drop>

    <div v-show="suggestions.length" class="h-0 relative z-20">
      <CloseButton @click="setSuggestions([])" />
      <div class="bg-gray-50/95 dark:bg-gray-600/95 rounded-b pt-2 shadow">
        <div
          v-for="term in suggestions"
          :key="term.id"
          class="px-2 pb-2 flex items-baseline"
        >
          <TermButton :data="term" class="cursor-pointer" @click="add(term)">
            {{ term.label }}
            <icon icon="plus" size="xs" class="ml-1" />
          </TermButton>
          <div class="flex-1"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useToggle } from "@vueuse/core";
import { vOnClickOutside } from "@vueuse/components";
import debounce from "lodash/debounce";
import useRootStore from "@/stores/root.store";
import { searchTerms } from "@/services/terms.service";
import TransitionExpand from "@/components/TransitionExpand.vue";
import TermButton from "@/terms/TermButton.vue";
import CloseButton from "@/components/CloseButton.vue";
import ToggleIcon from "@/components/ToggleIcon.vue";
import InputHelp from "@/components/InputHelp.vue";
import useTerms from "./terms.composable";
import useTermOptions from "./termOptions.composable";
import LabeledSection from "@/components/LabeledSection.vue";
import type { Term } from "@/types/work";

const props = defineProps<{
  label: string;
  terms: Term[];
  inputId: string;
  help: string;
  secondary?: boolean;
}>();

const emit = defineEmits<{
  add: [Term];
  remove: [Term];
}>();

const store = useRootStore();
const [showHelp, toggleHelp] = useToggle();
const { remove: removeTerm, removeSecondary } = useTerms();
const { goto } = useTermOptions();

const input = ref("");
const suggestions = ref<Term[]>([]);
const isDraggingTerm = computed(() => store.dragged?.type == "term");

// No need to load suggestions until user slows down typing.
const getSuggestions = debounce(async () => {
  if (!input.value) return;
  const inputFixed = input.value;
  const items = await searchTerms(inputFixed);
  items.splice(10);
  // Update suggestion list only if the input hasn't already been changed again.
  if (inputFixed == input.value) setSuggestions(items);
}, 400);

async function suggest() {
  if (input.value) {
    getSuggestions();
  } else {
    setSuggestions([]);
  }
}

function add(term: Term) {
  emit("add", term);
  input.value = "";
  setSuggestions([]);
}

function remove(term: Term) {
  emit("remove", term);
}

function removeLast() {
  if (input.value) return;
  const lastTerm = props.terms[props.terms.length - 1];
  if (lastTerm) remove(lastTerm);
}

function setSuggestions(matches: Term[]) {
  suggestions.value = matches || [];
}

function blur() {
  setSuggestions([]);
}

const removeOption = (term: Term) => ({
  label: `Rensa <em>${term.label}</em>`,
  action: () => remove(term),
  isApplicable: true,
});

function dropTerm() {
  if (isDraggingTerm.value) {
    const term = store.dragged.data;
    // Remove from both fields.
    removeTerm(term);
    removeSecondary(term);
    // Add to the current field.
    add(term);

    store.dragged = null;
  }
}
</script>

<style scoped>
::placeholder {
  font-size: 20px;
}

.incomplete:not(:focus-within) {
  @apply bg-red-100 dark:bg-red-900;
}

.term-added:last-of-type {
  @apply mr-0;
}
</style>
